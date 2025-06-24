package com.SE5910.adCopyGenerator.controller;

import com.SE5910.adCopyGenerator.dto.AdPostRequest;
import com.SE5910.adCopyGenerator.model.AdGeneratedResponse;
import com.SE5910.adCopyGenerator.model.AdPost;
import com.SE5910.adCopyGenerator.repository.AdPostRepository;
import com.SE5910.adCopyGenerator.service.AdPostService;
import com.SE5910.adCopyGenerator.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ad-post")
public class AdPostController {

    @Autowired
    private AdPostService adImageService;

    @Autowired
    private AdPostRepository adPostRepository;

    @PostMapping("/generate")
    public ResponseEntity<AdGeneratedResponse> generateAdImage(@RequestBody AdPostRequest request) {
        String userId = AuthUtil.getCurrentUserId();

        AdGeneratedResponse response = adImageService.generateImageFromPrompt(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AdPost>> generateAdImage() {
        String userId = AuthUtil.getCurrentUserId();
        List<AdPost> result = adPostRepository.findByUserId(userId);
        return ResponseEntity.ok(result);
    }

}
