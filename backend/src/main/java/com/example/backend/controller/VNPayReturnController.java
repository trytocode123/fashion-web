package com.example.backend.controller;


import com.example.backend.config.VNPayConfig;
import com.example.backend.entity.PaymentTransaction;
import com.example.backend.repository.PaymentTransactionRepository;
import com.example.backend.service.IEmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/vnpay_return")
public class VNPayReturnController {
    final IEmailService emailService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public VNPayReturnController(IEmailService emailService, PaymentTransactionRepository paymentTransactionRepository) {
        this.emailService = emailService;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @GetMapping
    public ResponseEntity<?> result(HttpServletRequest request) throws Exception {

        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();

            if (!fieldName.startsWith("vnp_")) continue;

            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");

        // log bank code
        String vnp_BankCode = request.getParameter("vnp_BankCode");
        System.out.println(vnp_BankCode);

        // log date create payment
        String vnp_payDate = request.getParameter("vnp_PayDate");
        System.out.println(vnp_payDate);

        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                if (i > 0) hashData.append('&');
                hashData.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            }
        }

        String signValue = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());

        if (signValue.equals(vnp_SecureHash) && "00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            String txnRef = request.getParameter("vnp_TxnRef");
            Optional<PaymentTransaction> transactionOptional = paymentTransactionRepository.findById(txnRef);
            if (transactionOptional.isPresent()) {
                PaymentTransaction transaction = transactionOptional.get();
                double amount = Double.parseDouble(request.getParameter("vnp_Amount")) / 100;

                emailService.sendVNPaySuccessMail(transaction.getEmail(), txnRef, amount);

                paymentTransactionRepository.delete(transaction);
            } else {
                System.out.println("DEBUG: Transaction NOT found in DB with txnRef: " + txnRef);
            }
            return ResponseEntity.status(303).header("Location", "https://fashion-web-omega.vercel.app/vnpaySuccess").build();
        }
        return ResponseEntity.status(303).header("Location", "https://fashion-web-omega.vercel.app/vnpayFail").build();
    }
}
