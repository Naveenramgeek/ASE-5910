package com.SE5910.adCopyGenerator.service;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;

@Service
public class AdPostService {

    private final WebClient webClient;

    public AdPostService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/images/generations")
                .defaultHeader("Authorization", "Bearer YOUR_OPENAI_API_KEY")
                .build();
    }

    public String generateImageFromPrompt(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-image-1",
                "prompt", prompt,
                "n", 1,
                "size", "1024x1024",
                "quality", "high"
        );

        Map<String, Object> response = webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String base64Image = (String) ((Map<String, Object>) ((java.util.List<?>) response.get("data")).get(0)).get("b64_json");

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
}
