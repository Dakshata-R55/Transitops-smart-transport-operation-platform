package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.DashboardResponse;
import com.Transitops.Spring_project.model.VehicleStatus;
import com.Transitops.Spring_project.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String region) {
        return dashboardService.getDashboard(type, status, region);
    }
}