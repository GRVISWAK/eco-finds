package com.example.ecofinds_backend.service;

import com.example.ecofinds_backend.model.Product;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // CREATE or UPDATE
    public Product save(Product product) {
        return productRepository.save(product);
    }

    // READ
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> search(String keyword) {
        return productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    public List<Product> filterByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> getBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    public Optional<Product> getById(Long id) {
        return productRepository.findById(id);
    }

    // UPDATE
    public Product update(Long id, Product payload) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return null;

        Product existing = opt.get();

        if (payload.getTitle() != null) existing.setTitle(payload.getTitle());
        if (payload.getDescription() != null) existing.setDescription(payload.getDescription());
        if (payload.getCategory() != null) existing.setCategory(payload.getCategory());
        if (payload.getPrice() != null) existing.setPrice(payload.getPrice());
        if (payload.getImageUrl() != null) existing.setImageUrl(payload.getImageUrl());

        return productRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
