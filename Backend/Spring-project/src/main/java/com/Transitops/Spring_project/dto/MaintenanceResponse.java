package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.MaintenanceStatus;
import com.Transitops.Spring_project.model.VehicleStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MaintenanceResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private String vehicleNameModel;
    private VehicleStatus vehicleStatus;
    private String serviceType;
    private BigDecimal cost;
    private LocalDate serviceDate;
    private MaintenanceStatus status;
    private LocalDateTime createdAt;
    private String message;
}