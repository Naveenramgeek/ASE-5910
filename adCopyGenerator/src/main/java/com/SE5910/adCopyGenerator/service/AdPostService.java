package com.SE5910.adCopyGenerator.service;

import com.SE5910.adCopyGenerator.dto.AdPostRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;

import jakarta.annotation.PostConstruct;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class AdPostService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private WebClient imageClient;
    private WebClient chatClient;

    @PostConstruct
    public void initClients() {
        int bufferSize = 16 * 1024 * 1024; // 16MB

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(bufferSize))
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

    public String generateImageFromPrompt(AdPostRequest request) {
        String prompt = generatePrompt(
                request.getTitle(),
                request.getDescription(),
                request.getPlatform(),
                request.getTone()
        );

        System.out.println("Generated Prompt: " + prompt);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-image-1",
                "prompt", prompt,
                "n", 1,
                "size", "1024x1024"
        );

        Map<String, Object> response = imageClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnError(error -> System.err.println("API Error: " + error.getMessage()))
                .block();

        System.out.println("Response: " + response);

        String base64Image = (String) ((Map<String, Object>) ((List<?>) response.get("data")).get(0)).get("b64_json");
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        String filePath = "generated/ad_image_" + System.currentTimeMillis() + ".png";

        try {
            Path path = Paths.get(filePath);
            Files.createDirectories(path.getParent());
            Files.write(path, imageBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to write image file", e);
        }

        return filePath;
    }

    public String generatePrompt(String title, String description, String platform, String tone) {
        String systemMessage = """
        You are a professional ad designer assistant. Given a brand, short product description, 
        target platform, and tone, generate a vivid, layout-specific visual prompt for AI-based image generation.

        Instructions:
        - Start the prompt by stating the brand prominently.
        - Suggest embedded overlay text such as titles, discount badges, contact info, etc.
        - Describe the desired layout (e.g., top banner text, image panels, color schemes).
        - Focus on visual elements suitable for the specified platform (e.g., Instagram = bold + eye-catching).
        - Reflect the tone through styling (e.g., Friendly = warm fonts, bright colors; Professional = clean and modern).
        - Avoid generic phrases. Be concrete and imaginative.
    """;

        String userMessage = String.format("""
        Brand: %s

        Description: %s
        Target Platform: %s
        Tone: %s

        Generate a compelling and visually detailed prompt with embedded overlay text that guides AI image creation.
    """, title.toUpperCase(), description, platform.toUpperCase(), tone.toUpperCase());

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

        if (response == null || !response.containsKey("choices")) {
            throw new RuntimeException("Invalid response from OpenAI");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString().trim();
    }


}
