package com.example.ecofinds_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecofinds_backend.model.Purchase;
import com.example.ecofinds_backend.model.User;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByBuyer(User buyer);
    List<Purchase> findBySeller(User seller);
}