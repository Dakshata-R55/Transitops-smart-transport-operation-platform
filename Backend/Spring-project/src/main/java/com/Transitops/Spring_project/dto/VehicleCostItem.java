package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class VehicleCostItem {
    private Long vehicleId;
    private String registrationNumber;
    private String nameModel;
    private BigDecimal totalCost;  // fuel + maintenance for that vehicle
}