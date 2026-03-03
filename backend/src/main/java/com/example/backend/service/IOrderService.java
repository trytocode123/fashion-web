package com.example.backend.service;

import com.example.backend.entity.Order;

import java.util.Optional;

public interface IOrderService {
    Order createOrderFromCart(String username, String paymentRef);

    Order findByPaymentRef(String txnRef);

    Order save(Order order);
}
