package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ReportsAnalyticsResponse {
    private BigDecimal fuelEfficiencyKmPerLiter;   // e.g. 8.4
    private int fleetUtilizationPercent;           // e.g. 81
    private BigDecimal operationalCost;            // e.g. 34070
    private BigDecimal vehicleRoiPercent;          // e.g. 14.2
    private List<MonthlyRevenueItem> monthlyRevenue;
    private List<VehicleCostItem> topCostliestVehicles;
}