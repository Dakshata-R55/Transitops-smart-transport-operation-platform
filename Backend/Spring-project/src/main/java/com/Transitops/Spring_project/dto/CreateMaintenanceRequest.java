package com.Transitops.Spring_project.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateMaintenanceRequest {

    @NotNull(message = "Vehicle is required")
    private Long vehicleId;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cost must be greater than 0")
    private BigDecimal cost;

    @NotNull(message = "Service date is required")
    private LocalDate serviceDate;
}