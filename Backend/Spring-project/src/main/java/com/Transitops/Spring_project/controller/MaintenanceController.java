package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateMaintenanceRequest;
import com.Transitops.Spring_project.dto.MaintenanceResponse;
import com.Transitops.Spring_project.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @PostMapping
    public MaintenanceResponse createMaintenance(
            @Valid @RequestBody CreateMaintenanceRequest request) {
        return maintenanceService.createMaintenance(request);
    }

    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'DISPATCHER')")
    @GetMapping
    public List<MaintenanceResponse> getAllMaintenanceRecords() {
        return maintenanceService.getAllMaintenanceRecords();
    }

    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @PatchMapping("/{id}/complete")
    public MaintenanceResponse completeMaintenance(@PathVariable Long id) {
        return maintenanceService.completeMaintenance(id);
    }
}