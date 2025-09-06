package com.example.ecofinds_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ecofinds_backend.model.Product;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.service.ProductService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    // CREATE
    @PostMapping
    public Product add(@RequestBody Product product) {
        return productService.save(product);
    }

    // READ: All products
    @GetMapping
    public List<Product> all() {
        return productService.getAll();
    }

    // READ: Search products
    @GetMapping("/search")
    public List<Product> search(@RequestParam String keyword) {
        return productService.search(keyword);
    }

    // READ: Filter by category
    @GetMapping("/category/{category}")
    public List<Product> filter(@PathVariable String category) {
        return productService.filterByCategory(category);
    }

    // READ: Products by seller
    @GetMapping("/seller/{id}")
    public List<Product> sellerProducts(@PathVariable Long id) {
        User seller = new User();
        seller.setId(id);
        return productService.getBySeller(seller);
    }

    // READ: Get product by ID
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        Optional<Product> opt = productService.getById(id);
        return opt.orElse(null);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product payload) {
        return productService.update(id, payload);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
