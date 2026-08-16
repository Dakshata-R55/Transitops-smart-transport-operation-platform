package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class FuelLogResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private String vehicleNameModel;
    private LocalDate logDate;
    private BigDecimal liters;
    private BigDecimal fuelCost;
    private String message;
}