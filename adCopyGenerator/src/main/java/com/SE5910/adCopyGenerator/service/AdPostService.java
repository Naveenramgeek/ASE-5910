package com.SE5910.adCopyGenerator.service;

import com.SE5910.adCopyGenerator.dto.AdPostRequest;
import com.SE5910.adCopyGenerator.model.AdGeneratedResponse;
import com.SE5910.adCopyGenerator.model.AdPost;
import com.SE5910.adCopyGenerator.model.PromptGenerationResult;
import com.SE5910.adCopyGenerator.repository.AdPostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;

import jakarta.annotation.PostConstruct;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class AdPostService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private final AdPostRepository adPostRepository;

    private WebClient imageClient;
    private WebClient chatClient;

    private final S3Client s3Client = S3Client.builder()
            .region(Region.US_EAST_2) // change to your region
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create("YOUR_KEY", "YOUR_SECRET")
            ))
            .build();

    public AdPostService(AdPostRepository adPostRepository) {
        this.adPostRepository = adPostRepository;
    }

    @PostConstruct
    public void initClients() {
        int bufferSize = 16 * 1024 * 1024;
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(bufferSize))
                .build();

        this.imageClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/images/generations")
                .defaultHeader("Authorization", "Bearer " + openAiApiKey)
                .exchangeStrategies(strategies)
                .build();

        this.chatClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + openAiApiKey)
                .exchangeStrategies(strategies)
                .build();
    }

    public AdGeneratedResponse generateImageFromPrompt(AdPostRequest request, String userId) {
        PromptGenerationResult prompt = generatePromptAndText(request.getTitle(), request.getDescription(), request.getPlatform(), request.getTone());

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-image-1",
                "prompt", prompt.getImagePrompt(),
                "n", 1,
                "size", "1024x1024"
        );

        Map<String, Object> response = imageClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String base64Image = (String) ((Map<String, Object>) ((List<?>) response.get("data")).get(0)).get("b64_json");
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        String fileName = "ad_image_" + System.currentTimeMillis() + ".png";

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType("image/png")
                .build();

        s3Client.putObject(objectRequest, RequestBody.fromBytes(imageBytes));


        String s3Url = "https://" + bucketName + ".s3.amazonaws.com/" + fileName;

        AdPost post = new AdPost();
        post.setUserId(userId);
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setPlatform(request.getPlatform());
        post.setTone(request.getTone());
        post.setImageUrl(s3Url);
        post.setAdDescription(prompt.getAdText());
        post.setCreatedAt(LocalDateTime.now());

        adPostRepository.save(post);

        AdGeneratedResponse adGeneratedResponse= new AdGeneratedResponse();
        adGeneratedResponse.setImageUrl(s3Url);
        adGeneratedResponse.setPromptUsed(prompt.getAdText());

        return adGeneratedResponse;
    }

    public PromptGenerationResult generatePromptAndText(String title, String description, String platform, String tone) {
        String imagePrompt = generateImagePrompt(title, description, platform, tone);
        String adText = generateAdText(title, description, platform, tone);

        PromptGenerationResult result = new PromptGenerationResult();
        result.setImagePrompt(imagePrompt);
        result.setAdText(adText);

        return result;
    }

    public String generateImagePrompt(String title, String description, String platform, String tone) {
        String systemMessage = """
        You are a visionary AI ad designer.

        Given a product brand, description, platform, and tone, generate an imaginative, layout-agnostic visual prompt for generating an advertisement image using AI.

        🎯 Your responsibilities:
        - Invent creative overlay text that **do not copy** user inputs. Use engaging, original copywriting.
        - Design a visually rich scene with **full freedom of layout** — vary composition, layering, text styles, and positioning in every prompt.
        - Always ensure **brand visibility** in a way that fits the concept organically — but don’t hardcode its position.
        - Always prefer **photo-realistic photography** style. Do NOT use illustrations, sketches, or painted artwork.
        - Specify **realistic lighting**, shadows, and depth to avoid a cartoon or artificial look.
        - Integrate decorative elements, props, characters, color schemes, and textures appropriate to the product and tone.
        - Allow dynamic placement of all elements: overlay text, logos, images, background — don’t fix them.
        - Assume a 1024x1024 square canvas.
        - All text must be placed with **at least 10% padding** from image edges to avoid cropping.
        - Overlay text should be inside visually distinct areas (e.g., gradient box, ribbon, signage) when necessary.
    
        ✨ Embrace variety and uniqueness. Each image should feel like a standalone creative work.

        📱 Platform guidance:
        - Instagram: vibrant, eye-catching, stylized
        - LinkedIn: elegant, clean, modern
        - Facebook: warm, relatable, welcoming

        🎨 Tone styling:
        - Friendly: colorful, soft fonts, playful mood
        - Professional: structured, crisp design, confident messaging

        Output only the **final creative prompt**.
    """;

        String userMessage = String.format("""
        Product/Brand: %s
        Description: %s
        Platform: %s
        Tone: %s

        Generate a visually rich and original prompt for image creation.
    """, title.toUpperCase(), description, platform.toUpperCase(), tone.toUpperCase());

        return callChatModel(systemMessage, userMessage);
    }


    private String generateAdText(String title, String description, String platform, String tone) {
        String systemMessage = """
        You are a marketing copywriter.
        Write a single compelling **1-sentence ad caption** based on brand, product description, platform, and tone.

        Guidelines:
        - Reflect the tone in the writing (e.g., Friendly = casual, Professional = formal)
        - Match the platform style (LinkedIn = business, Instagram = hashtags/emojis, Facebook = engaging)
        - Keep it concise, catchy, and clear.
    """;

        String userMessage = String.format("""
        Brand: %s
        Description: %s
        Platform: %s
        Tone: %s
    """, title, description, platform, tone);

        return callChatModel(systemMessage, userMessage);
    }

    private String callChatModel(String systemMessage, String userMessage) {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4",
                "messages", List.of(
                        Map.of("role", "system", "content", systemMessage),
                        Map.of("role", "user", "content", userMessage)
                ),
                "temperature", 0.7
        );

        Map<String, Object> response = chatClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        return ((Map<String, Object>) ((List<?>) response.get("choices")).get(0)).get("message")
                .toString()
                .replace("{role=assistant, content=", "")
                .replace("}", "")
                .replace("refusal=null", "")
                .replace("annotations=[]", "")
                .replaceAll(",\\s*,", ",") // Clean up double commas if any
                .replaceAll(",\\s*}", "}") // Remove trailing comma before closing brace
                .replaceAll("\\{\\s*,", "{") // Remove leading comma after opening brace
                .trim();
    }
}
