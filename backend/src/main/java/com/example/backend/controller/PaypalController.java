package com.example.backend.controller;

import com.example.backend.dto.PaypalAmountDTO;
import com.example.backend.service.IPaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/v1/api/paypal")
public class PaypalController {
    private static final String SUCCESS_URL = "https://fashion-web-omega.vercel.app/paypalSuccess";
    private static final String CANCEL_URL = "https://fashion-web-omega.vercel.app/paypalFail";

    private final IPaypalService paypalService;
    private final com.example.backend.service.IOrderService orderService;
    private final com.example.backend.repository.PaymentTransactionRepository paymentTransactionRepository;

    public PaypalController(IPaypalService paypalService, com.example.backend.service.IOrderService orderService, com.example.backend.repository.PaymentTransactionRepository paymentTransactionRepository) {
        this.paypalService = paypalService;
        this.orderService = orderService;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @PostMapping("/save-paypal")
    public ResponseEntity<?> implementPaypalMethod(@RequestBody PaypalAmountDTO paypalAmountDTO, java.security.Principal principal) throws PayPalRESTException {
        if (principal == null) return ResponseEntity.status(401).build();
        System.out.println(paypalAmountDTO.getAmount());
        try {
            Payment payment = paypalService.creatPaymentWithPaypal(
                    paypalAmountDTO.getAmount(),
                    "USD",
                    "paypal",
                    "sale",
                    "Transfer money",
                    CANCEL_URL,
                    SUCCESS_URL
            );

            // Save Transaction Info for Order deduplication and Direct Purchase
            com.example.backend.entity.PaymentTransaction transaction = new com.example.backend.entity.PaymentTransaction();
            transaction.setTxnRef(payment.getId());
            transaction.setUsername(principal.getName());
            transaction.setAmount(paypalAmountDTO.getAmount());
            
            if (paypalAmountDTO.getProductId() != null) {
                transaction.setProductId(paypalAmountDTO.getProductId());
                transaction.setSize(com.example.backend.entity.Size.valueOf(paypalAmountDTO.getSize().toUpperCase()));
                transaction.setQuantity(paypalAmountDTO.getQuantity());
            }
            
            paymentTransactionRepository.save(transaction);

            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/success/{paymentId}/{payerID}")
    public ResponseEntity<?> executeSuccess(@PathVariable String paymentId, @PathVariable String payerID, java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            paypalService.excutePayment(paymentId, payerID);
            orderService.createOrderFromCart(principal.getName(), paymentId);
            return ResponseEntity.ok("success");
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
