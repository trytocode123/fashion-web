package com.example.backend.service;

import com.example.backend.entity.Order;

public interface IEmailService {
    void sendVNPaySuccessMail(String to, String txnRef, double amount);
    void sendVerificationMail(String to, String token);
    void sendOrderConfirmationMail(Order order);
}
