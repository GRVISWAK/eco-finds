package com.example.ecofinds_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ecofinds_backend.model.Purchase;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.repository.PurchaseRepository;

import java.util.List;

@Service
public class PurchaseService {
    @Autowired
    private PurchaseRepository purchaseRepository;

    public Purchase save(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    public List<Purchase> getByBuyer(User buyer) {
        return purchaseRepository.findByBuyer(buyer);
    }

    public List<Purchase> getBySeller(User seller) {
        return purchaseRepository.findBySeller(seller);
    }
}

