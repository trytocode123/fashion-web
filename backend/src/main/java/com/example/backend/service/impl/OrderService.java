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

    /**
     * Creates an order from a cart or direct purchase.
     * The DB operations run in one transaction.
     * Email is sent after the transaction commits to avoid LazyInitializationException.
     */
    @Override
    public Order createOrderFromCart(String username, String paymentRef) {
        // Run DB operations in a dedicated transaction first
        Order savedOrder = createOrderTransactional(username, paymentRef);

        // Send email AFTER the transaction commits — order data is now fully committed and retrievable
        if (savedOrder != null) {
            try {
                emailService.sendOrderConfirmationMail(savedOrder);
                System.out.println("DEBUG [OrderService]: Email triggered for order #" + savedOrder.getId());
            } catch (Exception e) {
                System.err.println("ERROR [OrderService]: Email failed: " + e.getMessage());
                e.printStackTrace();
            }
        }

        return savedOrder;
    }

    @Transactional
    public Order createOrderTransactional(String username, String paymentRef) {
        // 1. Deduplication check
        Optional<Order> existingOrder = orderRepository.findByPaymentRef(paymentRef);
        if (existingOrder.isPresent()) {
            System.out.println("DEBUG [OrderService]: Duplicate order detected for paymentRef=" + paymentRef + ". Skipping.");
            return existingOrder.get();
        }

        // 2. Get Transaction (for direct purchase detection)
        PaymentTransaction transaction = paymentTransactionRepository.findById(paymentRef).orElse(null);

        // 3. Get Account
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found: " + username));

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
            System.out.println("DEBUG [OrderService]: Direct Purchase - product=" + product.getName() + " qty=" + transaction.getQuantity());

        } else {
            // ====== Cart Purchase ======
            Cart cart = cartRepository.findByAccount_Username(username)
                    .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));

            List<CartItem> cartItems = cart.getCartItems();
            if (cartItems == null || cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty for user: " + username);
            }

            System.out.println("DEBUG [OrderService]: Cart has " + cartItems.size() + " items for user: " + username);

            for (CartItem cartItem : cartItems) {
                if (cartItem.getProduct() == null) continue;
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(cartItem.getProduct());
                item.setQuantity((long) cartItem.getQuantity());
                item.setSize(cartItem.getSize());
                orderItems.add(item);
                totalAmount += (cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice() : 0L) * cartItem.getQuantity();
            }

            // Use @Modifying JPQL query to bypass the Hibernate cache / orphanRemoval conflict
            cartItemRepository.deleteAllByCart(cart);
            System.out.println("DEBUG [OrderService]: Cart cleared via JPQL DELETE for user: " + username);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        System.out.println("DEBUG [OrderService]: Order saved, ID=" + savedOrder.getId() + " total=" + totalAmount);

        return savedOrder;
    }
}
