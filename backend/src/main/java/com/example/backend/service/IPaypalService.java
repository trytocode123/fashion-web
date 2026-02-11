package com.example.backend.service;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

public interface IPaypalService {
    Payment creatPaymentWithPaypal(Double total, String currency, String method, String intent,
                                   String description, String cancelURL, String successURL) throws PayPalRESTException;

    Payment excutePayment(String paymentId, String payerId) throws PayPalRESTException;
}
