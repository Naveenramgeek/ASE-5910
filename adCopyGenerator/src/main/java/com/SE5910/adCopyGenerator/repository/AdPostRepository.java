package com.SE5910.adCopyGenerator.repository;

import com.SE5910.adCopyGenerator.model.AdPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdPostRepository extends MongoRepository<AdPost, String> {

    // Optional: fetch all posts by a specific user
    List<AdPost> findByUserId(String userId);

    // Optional: fetch posts by title
    List<AdPost> findByTitleContainingIgnoreCase(String title);

    // Optional: fetch posts by platform
    List<AdPost> findByPlatformIgnoreCase(String platform);
}
