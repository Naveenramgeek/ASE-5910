package com.SE5910.adCopyGenerator.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "adPosts")
public class AdPost {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String platform;
    private String tone;
    private String imageUrl;
    private String adDescription;
    private LocalDateTime createdAt;
}