package com.Transitops.Spring_project.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DriverProfileDto {
    private String employeeId;
    private String licenseNumber;
    private LocalDate licenseExpiryDate;
    private Long assignedVehicleId;
    private String emergencyContact;
}