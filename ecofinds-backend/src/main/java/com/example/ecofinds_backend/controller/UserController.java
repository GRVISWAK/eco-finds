package com.example.ecofinds_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User updated) {
        return userService.updateUser(id, updated);
    }
}