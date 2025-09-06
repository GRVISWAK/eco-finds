package com.example.ecofinds_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ecofinds_backend.model.Cart;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.service.CartService;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public Cart add(@RequestBody Cart cart) {
        return cartService.addToCart(cart);
    }

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return cartService.getCart(user);
    }

    @DeleteMapping("/remove/{id}")
    public void remove(@PathVariable Long id) {
        cartService.remove(id);
    }
}
