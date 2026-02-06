package com.example.backend.cotroller;


import com.example.backend.config.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
public class PaymentReturnController {
    @GetMapping
    public ResponseEntity<?> result(HttpServletRequest request
    ) throws Exception {

        Map<String, String> fields = new HashMap<>();

        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();

            if (!fieldName.startsWith("vnp_"))
                continue;

            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");

        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                if (hashData.length() > 0) hashData.append('&');
                hashData.append(fieldName).append('=').append(fieldValue);
            }
        }

        String signValue = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());

        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "http://localhost:5174";
        }

        if (signValue.equals(vnp_SecureHash) && "00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            return ResponseEntity
                    .status(302)
                    .header("Location", frontendUrl + "/paymentSuccess?vnp_TxnRef=" + vnp_TxnRef)
                    .build();
        }
        return ResponseEntity
                .status(302)
                .header("Location", frontendUrl + "/paymentFail?vnp_TxnRef=" + vnp_TxnRef)
                .build();
    }
}
