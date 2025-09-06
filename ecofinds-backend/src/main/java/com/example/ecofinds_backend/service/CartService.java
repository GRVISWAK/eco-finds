package com.example.ecofinds_backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ecofinds_backend.model.Cart;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.repository.CartRepository;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public Cart addToCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public List<Cart> getCart(User user) {
        return cartRepository.findByUser(user);
    }

    public void remove(Long id) {
        cartRepository.deleteById(id);
    }
}