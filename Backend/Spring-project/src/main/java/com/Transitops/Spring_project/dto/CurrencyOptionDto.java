package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrencyOptionDto {
    private String code;   // "INR"
    private String label;  // "INR (Rs)"
}