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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final IOrderRepository orderRepository;
    private final IOrderItemRepository orderItemRepository;
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IAccountRepository accountRepository;
    private final IEmailService emailService;
    private final IProductRepository productRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    @Transactional
    public Order createOrderFromCart(String username, String paymentRef) {
        // 1. Deduplication check - prevent duplicate orders
        Optional<Order> existingOrder = orderRepository.findByPaymentRef(paymentRef);
        if (existingOrder.isPresent()) {
            System.out.println("DEBUG: Order with paymentRef=" + paymentRef + " already exists. Skipping.");
            return existingOrder.get();
        }

        // 2. Get Transaction for direct purchase info
        PaymentTransaction transaction = paymentTransactionRepository.findById(paymentRef).orElse(null);

        // 3. Get Account
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found for username: " + username));

        Order order = new Order();
        order.setAccount(account);
        order.setStatus(OrderStatus.PAID);
        order.setPaymentRef(paymentRef);
        List<OrderItem> orderItems = new ArrayList<>();
        long totalAmount = 0;

        // 4. Logic: Direct Purchase vs Cart Purchase
        if (transaction != null && transaction.getProductId() != null) {
            // --- Direct Purchase (Buy Now) ---
            Product product = productRepository.findById(transaction.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + transaction.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity((long) transaction.getQuantity());
            orderItem.setSize(transaction.getSize());
            orderItems.add(orderItem);

            totalAmount = (product.getPrice() != null ? product.getPrice() : 0L) * transaction.getQuantity();
            System.out.println("DEBUG: Direct Purchase order created for product: " + product.getName());
        } else {
            // --- Cart Purchase ---
            Cart cart = cartRepository.findByAccount_Username(username)
                    .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));

            if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
                throw new RuntimeException("Cart is empty for user: " + username);
            }

            for (CartItem cartItem : cart.getCartItems()) {
                if (cartItem.getProduct() == null) continue;
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity((long) cartItem.getQuantity());
                orderItem.setSize(cartItem.getSize());
                orderItems.add(orderItem);
                totalAmount += (cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice() : 0L) * cartItem.getQuantity();
            }

            // Clear cart items directly via repository (more reliable than collection.clear() with lazy loading)
            cartItemRepository.deleteByCart(cart);
            System.out.println("DEBUG: Cart cleared for user: " + username + " (" + orderItems.size() + " items)");
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // 5. Save Order
        Order savedOrder = orderRepository.save(order);
        System.out.println("DEBUG: Order saved with ID=" + savedOrder.getId() + ", total=" + totalAmount);

        // 6. Send Invoice Email
        try {
            emailService.sendOrderConfirmationMail(savedOrder);
            System.out.println("DEBUG: Order confirmation email sent to user: " + username);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to send order confirmation email: " + e.getMessage());
            e.printStackTrace();
        }

        return savedOrder;
    }
}
