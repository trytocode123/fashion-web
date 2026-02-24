package com.example.backend.service;

public interface IEmailService {
    void sendVNPaySuccessMail(String to, String txnRef, double amount);
    void sendVerificationMail(String to, String token);
}
