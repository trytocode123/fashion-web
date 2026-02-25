package com.example.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaypalAmountDTO {
    private Double amount;
    private Long productId;
    private String size;
    private Integer quantity;
}
