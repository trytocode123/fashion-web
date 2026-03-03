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
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IAccountRepository accountRepository;
    private final IEmailService emailService;
    private final IProductRepository productRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    /**
     * Creates an order from a cart or direct purchase.
     * The DB operations run in one transaction.
     * Email is sent after the transaction commits to avoid LazyInitializationException.
     */
    @Override
    @Transactional
    public Order createOrderFromCart(String username, String paymentRef) {
        // 1. Deduplication check
        Order existingOrder = orderRepository.findByPaymentRef(paymentRef);
        if (existingOrder != null) {
            System.out.println("DEBUG [OrderService]: Order with paymentRef=" + paymentRef + " already exists. Skipping.");
            return existingOrder;
        }

        // 2. Get Transaction (for direct purchase detection)
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

        if (transaction != null && transaction.getProductId() != null) {
            // ====== Direct Purchase (Buy Now) ======
            Product product = productRepository.findById(transaction.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + transaction.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity((long) transaction.getQuantity());
            item.setSize(transaction.getSize());
            orderItems.add(item);

            totalAmount = (product.getPrice() != null ? product.getPrice() : 0L) * transaction.getQuantity();
            System.out.println("DEBUG [OrderService]: Direct Purchase created for: " + product.getName());

        } else {
            // ====== Cart Purchase ======
            Cart cart = cartRepository.findByAccount_Username(username)
                    .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));

            int itemsSize = (cart.getCartItems() != null) ? cart.getCartItems().size() : 0;
            System.out.println("DEBUG [OrderService]: Processing cart ID=" + cart.getId() + " for user=" + username + ". Items found: " + itemsSize);

            if (itemsSize == 0) {
                throw new RuntimeException("Cart is empty for user: " + username + " (Cart ID=" + cart.getId() + ")");
            }

            for (CartItem cartItem : cart.getCartItems()) {
                if (cartItem.getProduct() == null) continue;
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(cartItem.getProduct());
                item.setQuantity((long) cartItem.getQuantity());
                item.setSize(cartItem.getSize());
                orderItems.add(item);
                totalAmount += (cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice() : 0L) * cartItem.getQuantity();
            }

            // Direct JPQL delete inside transaction ensures cart is cleared
            cartItemRepository.deleteAllByCart(cart);
            System.out.println("DEBUG [OrderService]: Cart items deleted for user: " + username);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        System.out.println("DEBUG [OrderService]: Order saved ID=" + savedOrder.getId());

        // 4. Register Post-Commit Email Sending
        // This ensures email is sent ONLY if the transaction commits
        // and also bypasses LazyInit issues because the thread is still the same but transaction is closing.
        final Order finalOrder = savedOrder;
        if (org.springframework.transaction.support.TransactionSynchronizationManager.isActualTransactionActive()) {
            org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
                    new org.springframework.transaction.support.TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            try {
                                emailService.sendOrderConfirmationMail(finalOrder);
                                System.out.println("DEBUG [OrderService]: Email triggered after commit.");
                            } catch (Exception e) {
                                System.err.println("ERROR [OrderService]: Task commit-email failed: " + e.getMessage());
                            }
                        }
                    }
            );
        } else {
            // Fallback for non-transactional calls (should not happen with @Transactional)
            emailService.sendOrderConfirmationMail(savedOrder);
        }

        return savedOrder;
    }

    @Override
    public Order findByPaymentRef(String txnRef) {
        return orderRepository.findByPaymentRef(txnRef);
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }
}
