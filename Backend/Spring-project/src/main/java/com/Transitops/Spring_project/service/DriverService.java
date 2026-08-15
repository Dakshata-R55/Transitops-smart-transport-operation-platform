package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CreateDriverRequest;
import com.Transitops.Spring_project.dto.DriverResponse;
import com.Transitops.Spring_project.model.Driver;
import com.Transitops.Spring_project.model.DriverStatus;
import com.Transitops.Spring_project.repository.DriverRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public DriverResponse createDriver(CreateDriverRequest request) {
        String licenseNumber = request.getLicenseNumber().trim().toUpperCase();

        if (driverRepository.existsByLicenseNumber(licenseNumber)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License number already exists");
        }

        if (request.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License has already expired");
        }

        Driver driver = Driver.builder()
                .name(request.getName().trim())
                .licenseNumber(licenseNumber)
                .licenseCategory(request.getLicenseCategory().trim())
                .licenseExpiryDate(request.getLicenseExpiryDate())
                .contactNumber(request.getContactNumber().trim())
                .emergencyContact(trimOrNull(request.getEmergencyContact()))
                .safetyScore(100)
                .status(DriverStatus.AVAILABLE)
                .build();

        driverRepository.save(driver);
        return toResponse(driver, "Driver created successfully");
    }

    public List<DriverResponse> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(d -> toResponse(d, null))
                .toList();
    }

    private String trimOrNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private DriverResponse toResponse(Driver driver, String message) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .licenseNumber(driver.getLicenseNumber())
                .licenseCategory(driver.getLicenseCategory())
                .licenseExpiryDate(driver.getLicenseExpiryDate())
                .contactNumber(driver.getContactNumber())
                .emergencyContact(driver.getEmergencyContact())
                .safetyScore(driver.getSafetyScore())
                .status(driver.getStatus())
                .message(message)
                .build();
    }
}