package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CreateTripRequest;
import com.Transitops.Spring_project.dto.TripResponse;
import com.Transitops.Spring_project.dto.UpdateTripStatusRequest;
import com.Transitops.Spring_project.model.*;
import com.Transitops.Spring_project.repository.DriverRepository;
import com.Transitops.Spring_project.repository.TripRepository;
import com.Transitops.Spring_project.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class TripService {

    private static final Map<TripStatus, Set<TripStatus>> ALLOWED_TRANSITIONS = Map.of(
            TripStatus.DRAFT, Set.of(TripStatus.DISPATCHED, TripStatus.CANCELLED),
            TripStatus.DISPATCHED, Set.of(TripStatus.COMPLETED, TripStatus.CANCELLED),
            TripStatus.COMPLETED, Set.of(),
            TripStatus.CANCELLED, Set.of()
    );

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripService(
            TripRepository tripRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional
    public TripResponse createTrip(CreateTripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Vehicle not found"));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Driver not found"));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Selected vehicle is not available");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Selected driver is not available");
        }

        if (request.getCargoWeight() > vehicle.getMaxLoadCapacityKg()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cargo weight exceeds vehicle capacity of "
                            + vehicle.getMaxLoadCapacityKg() + " kg");
        }

        Trip trip = Trip.builder()
                .source(request.getSource().trim())
                .destination(request.getDestination().trim())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeightKg(request.getCargoWeight())
                .plannedDistanceKm(request.getPlannedDistance())
                .status(TripStatus.DRAFT)
                .build();

        tripRepository.save(trip);
        return toResponse(trip, "Trip created successfully");
    }

    public List<TripResponse> getTrips(TripStatus status) {
        List<Trip> trips = status == null
                ? tripRepository.findAll()
                : tripRepository.findByStatus(status);

        return trips.stream()
                .map(t -> toResponse(t, null))
                .toList();
    }

    @Transactional
    public TripResponse updateTripStatus(Long tripId, UpdateTripStatusRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Trip not found"));

        TripStatus current = trip.getStatus();
        TripStatus next = request.getStatus();

        if (!ALLOWED_TRANSITIONS.get(current).contains(next)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot change status from " + current + " to " + next);
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (next == TripStatus.DISPATCHED) {
            if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Vehicle is no longer available");
            }
            if (driver.getStatus() != DriverStatus.AVAILABLE) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Driver is no longer available");
            }
            vehicle.setStatus(VehicleStatus.ON_TRIP);
            driver.setStatus(DriverStatus.ON_TRIP);
        }

        if (current == TripStatus.DISPATCHED
                && (next == TripStatus.COMPLETED || next == TripStatus.CANCELLED)) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
        }

        trip.setStatus(next);
        return toResponse(trip, "Trip status updated to " + next);
    }

    private TripResponse toResponse(Trip trip, String message) {
        return TripResponse.builder()
                .id(trip.getId())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .vehicleId(trip.getVehicle().getId())
                .driverId(trip.getDriver().getId())
                .cargoWeight(trip.getCargoWeightKg())
                .plannedDistance(trip.getPlannedDistanceKm())
                .status(trip.getStatus())
                .createdAt(trip.getCreatedAt())
                .message(message)
                .build();
    }
}