package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CreateFuelLogRequest;
import com.Transitops.Spring_project.dto.FuelLogResponse;
import com.Transitops.Spring_project.model.FuelLog;
import com.Transitops.Spring_project.model.Vehicle;
import com.Transitops.Spring_project.repository.FuelLogRepository;
import com.Transitops.Spring_project.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;

    public FuelLogService(
            FuelLogRepository fuelLogRepository,
            VehicleRepository vehicleRepository) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public FuelLogResponse createFuelLog(CreateFuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Vehicle not found"));

        FuelLog fuelLog = FuelLog.builder()
                .vehicle(vehicle)
                .logDate(request.getLogDate())
                .liters(request.getLiters())
                .fuelCost(request.getFuelCost())
                .build();

        fuelLogRepository.save(fuelLog);
        return toResponse(fuelLog, "Fuel log created successfully");
    }

    @Transactional(readOnly = true)
    public List<FuelLogResponse> getAllFuelLogs() {
        return fuelLogRepository.findAll()
                .stream()
                .map(log -> toResponse(log, null))
                .toList();
    }

    private FuelLogResponse toResponse(FuelLog fuelLog, String message) {
        Vehicle vehicle = fuelLog.getVehicle();
        return FuelLogResponse.builder()
                .id(fuelLog.getId())
                .vehicleId(vehicle.getId())
                .vehicleRegistrationNumber(vehicle.getRegistrationNumber())
                .vehicleNameModel(vehicle.getNameModel())
                .logDate(fuelLog.getLogDate())
                .liters(fuelLog.getLiters())
                .fuelCost(fuelLog.getFuelCost())
                .message(message)
                .build();
    }
}