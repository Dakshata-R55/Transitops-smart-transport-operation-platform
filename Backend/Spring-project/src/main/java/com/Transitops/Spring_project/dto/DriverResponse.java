package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.DriverStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class DriverResponse {
    private Long id;
    private String name;
    private String licenseNumber;
    private String licenseCategory;
    private LocalDate licenseExpiryDate;
    private String contactNumber;
    private String emergencyContact;
    private Integer safetyScore;
    private DriverStatus status;
    private String message;
}