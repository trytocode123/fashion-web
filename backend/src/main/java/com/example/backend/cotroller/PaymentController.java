package com.example.backend.cotroller;

import com.example.backend.config.VNPayConfig;
import com.example.backend.dto.PaymentInfoDTO;
import com.example.backend.dto.PaymentInputDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping(value = "/v1/api/payment")
@CrossOrigin("*")
public class PaymentController {
    @PostMapping("/savePayment")
    public ResponseEntity<?> savePayment(@RequestBody PaymentInputDTO paymentInputDTO, HttpServletRequest req) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String bankCode = paymentInputDTO.getBankCode();

//        long amount = Long.parseLong(req.getParameter("amount")) * 100;
        String amountStr = paymentInputDTO.getAmount() + "";
        System.out.println("Amount param: " + amountStr); // debug

        long amount = (long) Double.parseDouble(amountStr) * 100;

        String vnp_TxnRef = paymentInputDTO.getOrderId();
//        long amount = 50000 * 100;
//        String vnp_TxnRef = "1238";
        String vnp_IpAddr = VNPayConfig.getIpAddress(req);
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = paymentInputDTO.getLanguage();
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }

        // Get request base URL to build the return URL dynamically
        String baseUrl = req.getRequestURL().toString().replace(req.getRequestURI(), "");
        String vnp_ReturnUrl = baseUrl + VNPayConfig.vnp_ReturnUrl;

        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        TimeZone tz = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
        Calendar cld = Calendar.getInstance(tz);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(tz);
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        // Build hash data and query string
        for (String fieldName : (List<String>) fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // 1. URL Encode the value
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString());

                // 2. VNPay 2.1.0 requires %20 instead of +
                encodedValue = encodedValue.replace("+", "%20");

                // 3. Build hash data (using ENCODED values for 2.1.0)
                if (hashData.length() > 0) hashData.append('&');
                hashData.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                hashData.append('=');
                hashData.append(encodedValue);

                // 4. Build query string
                if (query.length() > 0) query.append('&');
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append('=');
                query.append(encodedValue);
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        System.out.println("VNP Final Hash String: " + hashData.toString());

        System.out.println("VNP Raw Hash Data: " + hashData.toString()); // Debug on Railway logs

        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/showFormToPay/{total}")
    public ResponseEntity<?> showFormToPay(@PathVariable Long total) {
        System.out.println(total);
        String orderId = "TEST" + System.currentTimeMillis();
        System.out.println(orderId);
        PaymentInfoDTO paymentInfoDTO = new PaymentInfoDTO();
        paymentInfoDTO.setAmount(total);
        paymentInfoDTO.setOrderId(orderId);
        return ResponseEntity.ok(paymentInfoDTO);
    }
}
