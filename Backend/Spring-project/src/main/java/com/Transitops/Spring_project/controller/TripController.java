package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateTripRequest;
import com.Transitops.Spring_project.dto.TripResponse;
import com.Transitops.Spring_project.dto.UpdateTripStatusRequest;
import com.Transitops.Spring_project.model.TripStatus;
import com.Transitops.Spring_project.service.TripService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PreAuthorize("hasRole('DISPATCHER')")
    @PostMapping
    public TripResponse createTrip(@Valid @RequestBody CreateTripRequest request) {
        return tripService.createTrip(request);
    }

    @PreAuthorize("hasAnyRole('DISPATCHER', 'SAFETY_OFFICER')")
    @GetMapping
    public List<TripResponse> getTrips(@RequestParam(required = false) TripStatus status) {
        return tripService.getTrips(status);
    }

    @PreAuthorize("hasRole('DISPATCHER')")
    @PatchMapping("/{id}/status")
    public TripResponse updateTripStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTripStatusRequest request) {
        return tripService.updateTripStatus(id, request);
    }
}