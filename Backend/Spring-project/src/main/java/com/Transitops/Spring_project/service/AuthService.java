package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.*;
import com.Transitops.Spring_project.model.*;
import com.Transitops.Spring_project.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FleetManagerProfileRepository fleetManagerProfileRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final SafetyOfficerProfileRepository safetyOfficerProfileRepository;
    private final FinancialAnalystProfileRepository financialAnalystProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            FleetManagerProfileRepository fleetManagerProfileRepository,
            DriverProfileRepository driverProfileRepository,
            SafetyOfficerProfileRepository safetyOfficerProfileRepository,
            FinancialAnalystProfileRepository financialAnalystProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.fleetManagerProfileRepository = fleetManagerProfileRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.safetyOfficerProfileRepository = safetyOfficerProfileRepository;
        this.financialAnalystProfileRepository = financialAnalystProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(trimToNull(request.getPhone()))
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        switch (request.getRole()) {
            case FLEET_MANAGER -> saveFleetManagerProfile(user, request.getFleetManagerProfile());
            case DRIVER -> saveDriverProfile(user, request.getDriverProfile());
            case SAFETY_OFFICER -> saveSafetyOfficerProfile(user, request.getSafetyOfficerProfile());
            case FINANCIAL_ANALYST -> saveFinancialAnalystProfile(user, request.getFinancialAnalystProfile());
        }

        return toResponse(user, "Signup successful");
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toResponse(user, "Login successful");
    }

    private void saveFleetManagerProfile(User user, FleetManagerProfileDto dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fleet manager profile is required");
        }
        requireNotBlank(dto.getEmployeeId(), "Employee ID is required");
        requireNotBlank(dto.getCompany(), "Company is required");
        requireNotBlank(dto.getBranch(), "Location/Branch is required");

        if (fleetManagerProfileRepository.existsByEmployeeIdAndCompany(
                dto.getEmployeeId().trim(), dto.getCompany().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee ID already exists in this company");
        }

        fleetManagerProfileRepository.save(FleetManagerProfile.builder()
                .user(user)
                .employeeId(dto.getEmployeeId().trim())
                .company(dto.getCompany().trim())
                .fleetSize(dto.getFleetSize())
                .branch(dto.getBranch().trim())
                .build());
    }

    private void saveDriverProfile(User user, DriverProfileDto dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Driver profile is required");
        }
        requireNotBlank(dto.getEmployeeId(), "Employee/Driver ID is required");
        requireNotBlank(dto.getLicenseNumber(), "License number is required");
        requireNotBlank(dto.getEmergencyContact(), "Emergency contact is required");

        if (dto.getLicenseExpiryDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License expiry date is required");
        }
        if (dto.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License has already expired");
        }
        if (driverProfileRepository.existsByLicenseNumber(dto.getLicenseNumber().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License number already registered");
        }
        if (driverProfileRepository.existsByEmployeeId(dto.getEmployeeId().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Driver ID already registered");
        }

        driverProfileRepository.save(DriverProfile.builder()
                .user(user)
                .employeeId(dto.getEmployeeId().trim())
                .licenseNumber(dto.getLicenseNumber().trim())
                .licenseExpiryDate(dto.getLicenseExpiryDate())
                .assignedVehicleId(dto.getAssignedVehicleId())
                .emergencyContact(dto.getEmergencyContact().trim())
                .safetyScore(100)
                .status(DriverStatus.AVAILABLE)
                .build());
    }

    private void saveSafetyOfficerProfile(User user, SafetyOfficerProfileDto dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Safety officer profile is required");
        }
        requireNotBlank(dto.getEmployeeId(), "Employee ID is required");
        requireNotBlank(dto.getCompany(), "Company is required");
        requireNotBlank(dto.getDepartment(), "Department/Branch is required");

        if (safetyOfficerProfileRepository.existsByEmployeeIdAndCompany(
                dto.getEmployeeId().trim(), dto.getCompany().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee ID already exists in this company");
        }

        safetyOfficerProfileRepository.save(SafetyOfficerProfile.builder()
                .user(user)
                .employeeId(dto.getEmployeeId().trim())
                .company(dto.getCompany().trim())
                .certification(trimToNull(dto.getCertification()))
                .department(dto.getDepartment().trim())
                .build());
    }

    private void saveFinancialAnalystProfile(User user, FinancialAnalystProfileDto dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Financial analyst profile is required");
        }
        requireNotBlank(dto.getEmployeeId(), "Employee ID is required");
        requireNotBlank(dto.getCompany(), "Company is required");
        requireNotBlank(dto.getDepartment(), "Department is required");

        if (financialAnalystProfileRepository.existsByEmployeeIdAndCompany(
                dto.getEmployeeId().trim(), dto.getCompany().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee ID already exists in this company");
        }

        financialAnalystProfileRepository.save(FinancialAnalystProfile.builder()
                .user(user)
                .employeeId(dto.getEmployeeId().trim())
                .company(dto.getCompany().trim())
                .department(dto.getDepartment().trim())
                .financeId(trimToNull(dto.getFinanceId()))
                .build());
    }

    private void requireNotBlank(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private AuthResponse toResponse(User user, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .message(message)
                .build();
    }
}