package com.example.backend.service;

public interface IEmailService {
    void sendVNPaySuccessMail(String to,String txnRef, double amount);
}
