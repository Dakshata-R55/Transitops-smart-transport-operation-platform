package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.SafetyOfficerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SafetyOfficerProfileRepository extends JpaRepository<SafetyOfficerProfile, Long> {
    boolean existsByEmployeeIdAndCompany(String employeeId, String company);
}