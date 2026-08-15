package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.FinancialAnalystProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialAnalystProfileRepository extends JpaRepository<FinancialAnalystProfile, Long> {
    boolean existsByEmployeeIdAndCompany(String employeeId, String company);
}