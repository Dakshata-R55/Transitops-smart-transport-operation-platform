package com.Transitops.Spring_project.dto;

import lombok.Data;

@Data
public class FleetManagerProfileDto {
    private String employeeId;
    private String company;
    private Integer fleetSize;
    private String branch;
}