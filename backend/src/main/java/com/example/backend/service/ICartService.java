package com.example.backend.service;

import com.example.backend.dto.CartDTO;
import com.example.backend.entity.Size;

public interface ICartService {
    CartDTO getCartForUser(String username);
    CartDTO addItemToCart(String username, Long productId, Size size, Integer quantity);
    CartDTO updateItemQuantity(String username, Long cartItemId, Integer quantity);
    CartDTO removeItemFromCart(String username, Long cartItemId);
    void clearCart(String username);
}
