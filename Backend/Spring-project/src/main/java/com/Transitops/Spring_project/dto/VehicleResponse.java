package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.VehicleStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class VehicleResponse {
    private Long id;
    private String registrationNumber;
    private String nameModel;
    private String type;
    private Integer maxLoadCapacityKg;
    private Integer odometer;
    private BigDecimal acquisitionCost;
    private VehicleStatus status;
    private String message;
}