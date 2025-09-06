package com.example.ecofinds_backend.repository;

import com.example.ecofinds_backend.model.Product;
import com.example.ecofinds_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String desc);
}
