package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.VehicleStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateVehicleRequest {

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Vehicle name/model is required")
    private String nameModel;

    @NotBlank(message = "Vehicle type is required")
    private String type;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than 0")
    private Integer maxLoadCapacityKg;

    @NotNull(message = "Odometer is required")
    @Min(value = 0, message = "Odometer cannot be negative")
    private Integer odometer;

    @NotNull(message = "Acquisition cost is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Acquisition cost must be greater than 0")
    private BigDecimal acquisitionCost;

    @NotNull(message = "Status is required")
    private VehicleStatus status;
}