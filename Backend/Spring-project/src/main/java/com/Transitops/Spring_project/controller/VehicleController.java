package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateVehicleRequest;
import com.Transitops.Spring_project.dto.VehicleResponse;
import com.Transitops.Spring_project.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @PostMapping
    public VehicleResponse createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST')")
    @GetMapping
    public List<VehicleResponse> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }
}