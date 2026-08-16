package com.Transitops.Spring_project.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateFuelLogRequest {

    @NotNull
    private Long vehicleId;

    @NotNull
    private LocalDate logDate;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal liters;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal fuelCost;
}