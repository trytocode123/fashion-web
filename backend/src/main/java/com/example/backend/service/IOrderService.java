package com.example.backend.service;

import com.example.backend.entity.Order;

public interface IOrderService {
    Order createOrderFromCart(String username);
}
