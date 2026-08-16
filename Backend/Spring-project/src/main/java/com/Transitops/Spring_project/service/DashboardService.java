package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.DashboardResponse;
import com.Transitops.Spring_project.model.*;
import com.Transitops.Spring_project.repository.DriverRepository;
import com.Transitops.Spring_project.repository.TripRepository;
import com.Transitops.Spring_project.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final Map<String, String> REGION_BY_PREFIX = Map.ofEntries(
            Map.entry("DL", "North"), Map.entry("HR", "North"),
            Map.entry("PB", "North"), Map.entry("UP", "North"),
            Map.entry("MH", "West"), Map.entry("GJ", "West"), Map.entry("GA", "West"),
            Map.entry("KA", "South"), Map.entry("TN", "South"),
            Map.entry("KL", "South"), Map.entry("AP", "South"), Map.entry("TS", "South"),
            Map.entry("WB", "East"), Map.entry("OD", "East"), Map.entry("BH", "East"),
            Map.entry("MP", "Central"), Map.entry("RJ", "Central"), Map.entry("CG", "Central")
    );

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardService(
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String type, VehicleStatus status, String region) {
        List<Vehicle> filteredVehicles = vehicleRepository.findAll().stream()
                .filter(v -> matchesType(v, type))
                .filter(v -> status == null || v.getStatus() == status)
                .filter(v -> matchesRegion(v, region))
                .toList();

        Set<Long> vehicleIds = filteredVehicles.stream()
                .map(Vehicle::getId)
                .collect(Collectors.toSet());

        List<Trip> filteredTrips = tripRepository.findAll().stream()
                .filter(t -> vehicleIds.contains(t.getVehicle().getId()))
                .toList();

        int activeVehicles = filteredVehicles.stream()
                .filter(v -> v.getStatus() != VehicleStatus.RETIRED)
                .toList().size();

        int availableVehicles = filteredVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .toList().size();

        int vehiclesInMaintenance = filteredVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_SHOP)
                .toList().size();

        int vehiclesOnTrip = filteredVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.ON_TRIP)
                .toList().size();

        int activeTrips = filteredTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.DISPATCHED)
                .toList().size();

        int pendingTrips = filteredTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.DRAFT)
                .toList().size();

        int driversOnDuty = driverRepository.findAll().stream()
                .filter(d -> d.getStatus() == DriverStatus.ON_TRIP)
                .toList().size();

        int fleetUtilization = activeVehicles == 0
                ? 0
                : (int) Math.round((vehiclesOnTrip * 100.0) / activeVehicles);

        return DashboardResponse.builder()
                .activeVehicles(activeVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesInMaintenance(vehiclesInMaintenance)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .fleetUtilization(fleetUtilization)
                .build();
    }

    private boolean matchesType(Vehicle vehicle, String type) {
        if (type == null || type.isBlank()) return true;
        return vehicle.getType().equalsIgnoreCase(type.trim());
    }

    private boolean matchesRegion(Vehicle vehicle, String region) {
        if (region == null || region.isBlank()) return true;
        return getRegion(vehicle).equals(region.trim());
    }

    private String getRegion(Vehicle vehicle) {
        String reg = vehicle.getRegistrationNumber();
        if (reg == null || reg.length() < 2) return "Other";
        String prefix = reg.substring(0, 2).toUpperCase();
        return REGION_BY_PREFIX.getOrDefault(prefix, "Other");
    }
}