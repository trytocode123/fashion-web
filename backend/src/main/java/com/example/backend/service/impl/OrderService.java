package com.example.backend.service.impl;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.service.IOrderService;
import com.example.backend.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final IOrderRepository orderRepository;
    private final IOrderItemRepository orderItemRepository;
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IAccountRepository accountRepository;
    private final IEmailService emailService;

    @Override
    @Transactional
    public Order createOrderFromCart(String username) {
        // 1. Get Account and Cart
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Cart cart = cartRepository.findByAccount_Username(username)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 2. Create Order
        Order order = new Order();
        order.setAccount(account);
        order.setStatus(OrderStatus.PAID);
        
        long totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getProduct() == null) {
                System.err.println("DEBUG ERROR: CartItem " + cartItem.getId() + " has null product");
                continue;
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity((long) cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItems.add(orderItem);
            
            totalAmount += (cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice() : 0L) * cartItem.getQuantity();
        }
        
        System.out.println("DEBUG: Calculated totalAmount: " + totalAmount);
        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);
        
        // 3. Save Order (Cascade should handle orderItems if configured, but let's be explicit if needed)
        Order savedOrder = orderRepository.save(order);

        // 4. Clear Cart
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // 5. Send Professional Invoice Email
        try {
            emailService.sendOrderConfirmationMail(savedOrder);
        } catch (Exception e) {
            System.err.println("DEBUG ERROR: Failed to trigger email: " + e.getMessage());
        }

        return savedOrder;
    }
}
