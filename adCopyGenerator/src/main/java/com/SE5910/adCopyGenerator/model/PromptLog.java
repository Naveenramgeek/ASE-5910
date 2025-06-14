package com.SE5910.adCopyGenerator.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "promptLogs")
public class PromptLog {
    @Id
    private String id;
    private String userId;
    private String originalPrompt;
    private String revisedPrompt;
    private String modelUsed;
    private String imageUrl;  // Or base64
    private LocalDateTime createdAt;
}
