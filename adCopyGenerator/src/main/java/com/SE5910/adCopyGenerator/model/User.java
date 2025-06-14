package com.SE5910.adCopyGenerator.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String googleId;
    private String name;
    private String email;
    private String profilePictureUrl;
    private String role; // ADMIN or USER
}
