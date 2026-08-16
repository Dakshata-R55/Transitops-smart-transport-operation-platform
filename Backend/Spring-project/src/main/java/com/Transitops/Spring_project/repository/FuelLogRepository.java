package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
}