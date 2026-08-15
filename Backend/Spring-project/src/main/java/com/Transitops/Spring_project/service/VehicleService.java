package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CreateVehicleRequest;
import com.Transitops.Spring_project.dto.VehicleResponse;
import com.Transitops.Spring_project.model.Vehicle;
import com.Transitops.Spring_project.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        String regNo = request.getRegistrationNumber().trim().toUpperCase();

        if (vehicleRepository.existsByRegistrationNumber(regNo)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Registration number already exists");
        }

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(regNo)
                .nameModel(request.getNameModel().trim())
                .type(request.getType().trim())
                .maxLoadCapacityKg(request.getMaxLoadCapacityKg())
                .odometer(request.getOdometer())
                .acquisitionCost(request.getAcquisitionCost())
                .status(request.getStatus())
                .build();

        vehicleRepository.save(vehicle);
        return toResponse(vehicle, "Vehicle created successfully");
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(v -> toResponse(v, null))
                .toList();
    }

    private VehicleResponse toResponse(Vehicle vehicle, String message) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .nameModel(vehicle.getNameModel())
                .type(vehicle.getType())
                .maxLoadCapacityKg(vehicle.getMaxLoadCapacityKg())
                .odometer(vehicle.getOdometer())
                .acquisitionCost(vehicle.getAcquisitionCost())
                .status(vehicle.getStatus())
                .message(message)
                .build();
    }
}