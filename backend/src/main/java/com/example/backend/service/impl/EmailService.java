package com.example.backend.service.impl;

import com.example.backend.service.IEmailService;
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

    public EmailService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Async
    @Override
    public void sendVNPaySuccessMail(String to, String txnRef, double amount) {
        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
            return;
        }
        try {
            // Prepare request body
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

            // Format HTML
            Context context = new Context();
            context.setVariable("txnRef", txnRef);
            context.setVariable("amount", String.format("%,.0f", amount));
            context.setVariable(
                    "time",
                    LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
            );
            String htmlContent = templateEngine.process("mail/vnpay-success", context);

            body.put("htmlContent", htmlContent);

            // Prepare Headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Send Request
            restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    entity,
                    String.class
            );


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
    @Async
    @Override
    public void sendOrderConfirmationMail(Order order) {
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
            toMap.put("email", order.getAccount().getUsername());
            toList.add(toMap);
            body.put("to", toList);

            body.put("subject", "Order Confirmation - Invoice #" + order.getId());

            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            
            String htmlContent = templateEngine.process("mail/order-confirmation", context);
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
}
