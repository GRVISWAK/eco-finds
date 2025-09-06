package com.example.ecofinds_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ecofinds_backend.model.Purchase;
import com.example.ecofinds_backend.model.User;
import com.example.ecofinds_backend.service.PurchaseService;

import java.util.List;

@RestController
@RequestMapping("/purchases")
@CrossOrigin
public class PurchaseController {
    @Autowired
    private PurchaseService purchaseService;

    @PostMapping
    public Purchase add(@RequestBody Purchase purchase) {
        return purchaseService.save(purchase);
    }

    @GetMapping("/buyer/{userId}")
    public List<Purchase> getBuyerPurchases(@PathVariable Long userId) {
        User buyer = new User();
        buyer.setId(userId);
        return purchaseService.getByBuyer(buyer);
    }

    @GetMapping("/seller/{userId}")
    public List<Purchase> getSellerSales(@PathVariable Long userId) {
        User seller = new User();
        seller.setId(userId);
        return purchaseService.getBySeller(seller);
    }
}
