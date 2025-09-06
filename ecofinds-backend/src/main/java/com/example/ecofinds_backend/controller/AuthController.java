package com.example.ecofinds_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
            return userService.findByEmail(user.getEmail())
            .filter(u -> u.getPassword().equals(user.getPassword()))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(401).build()); // no body, just 401
    }    
}