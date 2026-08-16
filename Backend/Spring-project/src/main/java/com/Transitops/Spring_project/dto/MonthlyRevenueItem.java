package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class MonthlyRevenueItem {
    private String month;      // "2026-07"
    private BigDecimal revenue;
}