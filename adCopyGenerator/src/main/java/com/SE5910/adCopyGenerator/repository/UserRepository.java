package com.SE5910.adCopyGenerator.repository;

import com.SE5910.adCopyGenerator.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}

