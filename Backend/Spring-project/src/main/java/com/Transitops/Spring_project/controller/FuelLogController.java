package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateFuelLogRequest;
import com.Transitops.Spring_project.dto.FuelLogResponse;
import com.Transitops.Spring_project.service.FuelLogService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-logs")
public class FuelLogController {

    private final FuelLogService fuelLogService;

    public FuelLogController(FuelLogService fuelLogService) {
        this.fuelLogService = fuelLogService;
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @PostMapping
    public FuelLogResponse createFuelLog(@Valid @RequestBody CreateFuelLogRequest request) {
        return fuelLogService.createFuelLog(request);
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @GetMapping
    public List<FuelLogResponse> getAllFuelLogs() {
        return fuelLogService.getAllFuelLogs();
    }
}