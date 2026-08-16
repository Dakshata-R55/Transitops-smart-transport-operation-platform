package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.ExpenseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRecordRepository extends JpaRepository<ExpenseRecord, Long> {
    boolean existsByMaintenanceRecordId(Long maintenanceRecordId);
}