package com.example.backend.cotroller;

import com.example.backend.config.VNPayConfig;
import com.example.backend.entity.Account;
import com.example.backend.entity.Customer;
import com.example.backend.entity.PaymentTransaction;
import com.example.backend.repository.PaymentTransactionRepository;
import com.example.backend.entity.Customer;
import com.example.backend.service.IAccountService;
import com.example.backend.service.ICustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping(value = "/v1/api/payment")
@CrossOrigin("*")
public class VNPayController {
    private final IAccountService accountService;
    private final ICustomerService customerService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public VNPayController(IAccountService accountService, ICustomerService customerService, PaymentTransactionRepository paymentTransactionRepository) {
        this.accountService = accountService;
        this.customerService = customerService;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @GetMapping("/savePayment/{data}")
    public ResponseEntity<?> savePayment(@PathVariable String data, HttpServletRequest req) throws UnsupportedEncodingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String username = authentication.getName();
        Account account = accountService.findByUsername(username);
        Customer customer = customerService.findCustomerByAccount(account);
        String email = customer.getEmail();
        System.out.println(email);
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
//        long amount = Long.parseLong(req.getParameter("amount")) * 100;
        String amountStr = data;
        System.out.println("Amount param: " + amountStr); // debug

        long amount = (long) Double.parseDouble(amountStr) * 100;

        String vnp_TxnRef = "TEST" + System.currentTimeMillis();

        // Save to Database instead of Cache
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTxnRef(vnp_TxnRef);
        transaction.setEmail(email);
        transaction.setAmount((double) amount);
        paymentTransactionRepository.save(transaction);
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
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
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
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {

                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;
        return ResponseEntity.ok(paymentUrl);
    }
}
