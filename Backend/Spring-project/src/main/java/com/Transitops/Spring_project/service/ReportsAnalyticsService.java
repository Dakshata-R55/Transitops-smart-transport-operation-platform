package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.*;
import com.Transitops.Spring_project.model.*;
import com.Transitops.Spring_project.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportsAnalyticsService {

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRecordRepository expenseRecordRepository;

    @Value("${analytics.revenue-per-km:50}")
    private BigDecimal revenuePerKm;

    public ReportsAnalyticsService(
            VehicleRepository vehicleRepository,
            TripRepository tripRepository,
            FuelLogRepository fuelLogRepository,
            ExpenseRecordRepository expenseRecordRepository) {
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.expenseRecordRepository = expenseRecordRepository;
    }

    @Transactional(readOnly = true)
    public ReportsAnalyticsResponse getReportsAnalytics() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Trip> trips = tripRepository.findAll();
        List<FuelLog> fuelLogs = fuelLogRepository.findAll();
        List<ExpenseRecord> expenses = expenseRecordRepository.findAll();

        // --- Fleet utilization ---
        int activeVehicles = vehicles.stream()
                .filter(v -> v.getStatus() != VehicleStatus.RETIRED)
                .toList().size();
        int vehiclesOnTrip = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.ON_TRIP)
                .toList().size();
        int fleetUtilization = activeVehicles == 0
                ? 0
                : Math.round((vehiclesOnTrip * 100.0) / activeVehicles);

        // --- Fuel efficiency: distance / liters ---
        int totalDistanceKm = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .mapToInt(Trip::getPlannedDistanceKm)
                .sum();

        BigDecimal totalLiters = fuelLogs.stream()
                .map(FuelLog::getLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal fuelEfficiency = totalLiters.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(totalDistanceKm)
                        .divide(totalLiters, 2, RoundingMode.HALF_UP);

        // --- Costs ---
        BigDecimal totalFuelCost = fuelLogs.stream()
                .map(FuelLog::getFuelCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMaintenanceCost = expenses.stream()
                .map(ExpenseRecord::getMaintenanceLinkedCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTollFees = expenses.stream()
                .map(ExpenseRecord::getTollFee)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOtherFees = expenses.stream()
                .map(ExpenseRecord::getOtherFee)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal operationalCost = totalFuelCost
                .add(totalMaintenanceCost)
                .add(totalTollFees)
                .add(totalOtherFees);

        // --- Revenue (completed trips only) ---
        BigDecimal totalRevenue = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .map(t -> BigDecimal.valueOf(t.getPlannedDistanceKm()).multiply(revenuePerKm))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAcquisitionCost = vehicles.stream()
                .filter(v -> v.getStatus() != VehicleStatus.RETIRED)
                .map(Vehicle::getAcquisitionCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal vehicleRoiPercent = totalAcquisitionCost.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalRevenue.subtract(totalFuelCost).subtract(totalMaintenanceCost)
                        .divide(totalAcquisitionCost, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(1, RoundingMode.HALF_UP);

        // --- Monthly revenue chart ---
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, BigDecimal> revenueByMonth = new TreeMap<>();

        for (Trip trip : trips) {
            if (trip.getStatus() != TripStatus.COMPLETED) continue;
            String month = trip.getCreatedAt().format(monthFmt);
            BigDecimal tripRevenue = BigDecimal.valueOf(trip.getPlannedDistanceKm())
                    .multiply(revenuePerKm);
            revenueByMonth.merge(month, tripRevenue, BigDecimal::add);
        }

        List<MonthlyRevenueItem> monthlyRevenue = revenueByMonth.entrySet().stream()
                .map(e -> MonthlyRevenueItem.builder()
                        .month(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .toList();

        // --- Top costliest vehicles ---
        Map<Long, BigDecimal> costByVehicle = new HashMap<>();

        for (FuelLog log : fuelLogs) {
            Long id = log.getVehicle().getId();
            costByVehicle.merge(id, log.getFuelCost(), BigDecimal::add);
        }
        for (ExpenseRecord exp : expenses) {
            Long id = exp.getVehicle().getId();
            BigDecimal maint = exp.getMaintenanceLinkedCost();
            costByVehicle.merge(id, maint, BigDecimal::add);
        }

        List<VehicleCostItem> topCostliest = vehicles.stream()
                .filter(v -> costByVehicle.containsKey(v.getId()))
                .map(v -> VehicleCostItem.builder()
                        .vehicleId(v.getId())
                        .registrationNumber(v.getRegistrationNumber())
                        .nameModel(v.getNameModel())
                        .totalCost(costByVehicle.get(v.getId()))
                        .build())
                .sorted((a, b) -> b.getTotalCost().compareTo(a.getTotalCost()))
                .limit(5)
                .toList();

        return ReportsAnalyticsResponse.builder()
                .fuelEfficiencyKmPerLiter(fuelEfficiency)
                .fleetUtilizationPercent(fleetUtilization)
                .operationalCost(operationalCost)
                .vehicleRoiPercent(vehicleRoiPercent)
                .monthlyRevenue(monthlyRevenue)
                .topCostliestVehicles(topCostliest)
                .build();
    }
}