package com.example.backend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VNPayCacheDTO {
    private String email;
    private double amount;
    private List<Long> productIds;
}
