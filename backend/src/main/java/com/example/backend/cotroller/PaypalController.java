package com.example.backend.cotroller;

import com.example.backend.dto.PaypalAmountDTO;
import com.example.backend.service.IPaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/paypal")
public class PaypalController {
    private static final String SUCCESS_URL = "https://fashion-web-omega.vercel.app/paypalSuccess";
    private static final String CANCEL_URL = "https://fashion-web-omega.vercel.app/paypalFail";

    private final IPaypalService paypalService;

    public PaypalController(IPaypalService paypalService) {
        this.paypalService = paypalService;
    }

    @PostMapping("/save-paypal")
    public ResponseEntity<?> implementPaypalMethod(@RequestBody PaypalAmountDTO paypalAmountDTO) throws PayPalRESTException {
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
    public ResponseEntity<?> excuteSuccess(@PathVariable String paymentId, @PathVariable String payerID) {
        System.out.println("vào rồi");
        try {
            paypalService.excutePayment(paymentId, payerID);
            return ResponseEntity.ok("success");
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
