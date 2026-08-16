package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class FinanceSummaryResponse {
    private BigDecimal totalFuelCost;
    private BigDecimal totalMaintenanceCost;
    private BigDecimal totalTollFees;
    private BigDecimal totalOtherFees;
    private BigDecimal totalOperationalCost;
}