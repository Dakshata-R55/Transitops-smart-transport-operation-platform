package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByEmployeeId(String employeeId);
}