package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private int activeVehicles;
    private int availableVehicles;
    private int vehiclesInMaintenance;
    private int activeTrips;
    private int pendingTrips;
    private int driversOnDuty;
    private int fleetUtilization;
}