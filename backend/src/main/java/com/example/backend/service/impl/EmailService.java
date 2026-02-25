package com.example.backend.service.impl;

import com.example.backend.service.IEmailService;
import com.example.backend.entity.Order;
import com.example.backend.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService implements IEmailService {

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final TemplateEngine templateEngine;
    private final com.example.backend.repository.ICustomerRepository customerRepository;
    private final IOrderRepository orderRepository;

    public EmailService(TemplateEngine templateEngine,
                        com.example.backend.repository.ICustomerRepository customerRepository,
                        IOrderRepository orderRepository) {
        this.templateEngine = templateEngine;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @Async
    @Override
    public void sendVNPaySuccessMail(String to, String txnRef, double amount) {
        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
            return;
        }
        try {
            Map<String, Object> body = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("name", "Fashion hub");
            sender.put("email", "nguyenthienan.171202@gmail.com");
            body.put("sender", sender);

            List<Map<String, String>> toList = new ArrayList<>();
            Map<String, String> toMap = new HashMap<>();
            toMap.put("email", to);
            toList.add(toMap);
            body.put("to", toList);

            body.put("subject", "Successful Payment");

            Context context = new Context();
            context.setVariable("txnRef", txnRef);
            context.setVariable("amount", String.format("%,.0f", amount));
            context.setVariable("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            String htmlContent = templateEngine.process("mail/vnpay-success", context);
            body.put("htmlContent", htmlContent);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendVerificationMail(String to, String token) {
        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
            return;
        }
        try {
            Map<String, Object> body = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("name", "Fashion Hub");
            sender.put("email", "nguyenthienan.171202@gmail.com");
            body.put("sender", sender);

            List<Map<String, String>> toList = new ArrayList<>();
            Map<String, String> toMap = new HashMap<>();
            toMap.put("email", to);
            toList.add(toMap);
            body.put("to", toList);

            body.put("subject", "Identify Fashion hub account");

            Context context = new Context();
            String verificationUrl = "https://fashion-web-omega.vercel.app/verify?token=" + token;
            context.setVariable("verificationUrl", verificationUrl);
            String htmlContent = templateEngine.process("mail/verification", context);
            body.put("htmlContent", htmlContent);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Sends order confirmation email.
     * NOTE: NOT @Async - must be synchronous so the JPA session stays open,
     * allowing Thymeleaf to lazily load order.orderItems without LazyInitializationException.
     */
    @Override
    public void sendOrderConfirmationMail(Order order) {
        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
            System.err.println("ERROR [Email]: BREVO_API_KEY is empty. Cannot send email.");
            return;
        }
        try {
            // Re-fetch order with a fresh context so all lazy collections are loadable
            Order freshOrder = orderRepository.findById(order.getId()).orElse(order);

            // Force-initialize lazy collections before Thymeleaf rendering
            if (freshOrder.getOrderItems() != null) {
                freshOrder.getOrderItems().size();
                freshOrder.getOrderItems().forEach(item -> {
                    if (item.getProduct() != null) {
                        item.getProduct().getName(); // init product proxy
                    }
                });
            }

            Map<String, Object> body = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("name", "Fashion Hub");
            sender.put("email", "nguyenthienan.171202@gmail.com");
            body.put("sender", sender);

            List<Map<String, String>> toList = new ArrayList<>();
            Map<String, String> toMap = new HashMap<>();

            com.example.backend.entity.Customer customer = customerRepository.findCustomerByAccount(freshOrder.getAccount());
            String recipientEmail = (customer != null && customer.getEmail() != null)
                    ? customer.getEmail()
                    : freshOrder.getAccount().getUsername();

            System.out.println("DEBUG [Email]: Sending order confirmation to: " + recipientEmail);

            toMap.put("email", recipientEmail);
            toList.add(toMap);
            body.put("to", toList);

            body.put("subject", "Order Confirmation - Invoice #" + freshOrder.getId());

            Context context = new Context();
            context.setVariable("order", freshOrder);
            context.setVariable("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

            String htmlContent = templateEngine.process("mail/order-confirmation", context);
            body.put("htmlContent", htmlContent);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", entity, String.class);
            System.out.println("DEBUG [Email]: Order confirmation sent successfully for order #" + freshOrder.getId());
        } catch (Exception e) {
            System.err.println("ERROR [Email]: Failed to send order confirmation: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
