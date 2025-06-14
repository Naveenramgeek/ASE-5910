package com.SE5910.adCopyGenerator.controller;

import com.SE5910.adCopyGenerator.model.AdPost;
import com.SE5910.adCopyGenerator.service.AdPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ad-post")
public class AdPostController {

    @Autowired
    private AdPostService adImageService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateAdImage(@RequestBody AdPost request) {
        String imagePath = adImageService.generateImageFromPrompt(request.getDescription());
        return ResponseEntity.ok("Image saved at: " + imagePath);
    }

}
