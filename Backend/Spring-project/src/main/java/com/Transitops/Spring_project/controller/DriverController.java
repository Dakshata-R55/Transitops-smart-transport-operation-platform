package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateDriverRequest;
import com.Transitops.Spring_project.dto.DriverResponse;
import com.Transitops.Spring_project.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    public DriverResponse createDriver(@Valid @RequestBody CreateDriverRequest request) {
        return driverService.createDriver(request);
    }

    @GetMapping
    public List<DriverResponse> getAllDrivers() {
        return driverService.getAllDrivers();
    }
}