package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.FleetManagerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FleetManagerProfileRepository extends JpaRepository<FleetManagerProfile, Long> {
    boolean existsByEmployeeIdAndCompany(String employeeId, String company);
}