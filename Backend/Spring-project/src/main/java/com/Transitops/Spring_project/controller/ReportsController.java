package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.ReportsAnalyticsResponse;
import com.Transitops.Spring_project.service.ReportsAnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsAnalyticsService reportsAnalyticsService;

    public ReportsController(ReportsAnalyticsService reportsAnalyticsService) {
        this.reportsAnalyticsService = reportsAnalyticsService;
    }

    @PreAuthorize("hasAnyRole('FINANCIAL_ANALYST', 'FLEET_MANAGER')")
    @GetMapping("/analytics")
    public ReportsAnalyticsResponse getAnalytics() {
        return reportsAnalyticsService.getReportsAnalytics();
    }
}