package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CreateMaintenanceRequest;
import com.Transitops.Spring_project.dto.MaintenanceResponse;
import com.Transitops.Spring_project.model.*;
import com.Transitops.Spring_project.repository.MaintenanceRepository;
import com.Transitops.Spring_project.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(
            MaintenanceRepository maintenanceRepository,
            VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public MaintenanceResponse createMaintenance(CreateMaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Vehicle not found"));

        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Retired vehicles cannot enter maintenance");
        }

        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Vehicle is already in shop");
        }

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Vehicle is currently on a trip");
        }

        if (maintenanceRepository.existsByVehicleIdAndStatus(
                vehicle.getId(), MaintenanceStatus.IN_SHOP)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Vehicle already has an active maintenance record");
        }

        MaintenanceRecord record = MaintenanceRecord.builder()
                .vehicle(vehicle)
                .serviceType(request.getServiceType().trim())
                .cost(request.getCost())
                .serviceDate(request.getServiceDate())
                .status(MaintenanceStatus.IN_SHOP)
                .build();

        vehicle.setStatus(VehicleStatus.IN_SHOP);

        maintenanceRepository.save(record);
        return toResponse(record, "Maintenance record created");
    }

    public List<MaintenanceResponse> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll()
                .stream()
                .map(r -> toResponse(r, null))
                .toList();
    }

    @Transactional
    public MaintenanceResponse completeMaintenance(Long id) {
        MaintenanceRecord record = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Maintenance record not found"));

        if (record.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Maintenance is already completed");
        }

        Vehicle vehicle = record.getVehicle();
        record.setStatus(MaintenanceStatus.COMPLETED);
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        return toResponse(record, "Maintenance marked as completed");
    }

    private MaintenanceResponse toResponse(MaintenanceRecord record, String message) {
        Vehicle vehicle = record.getVehicle();
        return MaintenanceResponse.builder()
                .id(record.getId())
                .vehicleId(vehicle.getId())
                .vehicleRegistrationNumber(vehicle.getRegistrationNumber())
                .vehicleNameModel(vehicle.getNameModel())
                .vehicleStatus(vehicle.getStatus())
                .serviceType(record.getServiceType())
                .cost(record.getCost())
                .serviceDate(record.getServiceDate())
                .status(record.getStatus())
                .createdAt(record.getCreatedAt())
                .message(message)
                .build();
    }
}