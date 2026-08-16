package com.Transitops.Spring_project.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateExpenseRequest {
    private Long tripId;
    @NotNull private Long vehicleId;
    @DecimalMin("0.0") private BigDecimal tollFee = BigDecimal.ZERO;
    @DecimalMin("0.0") private BigDecimal otherFee = BigDecimal.ZERO;
}