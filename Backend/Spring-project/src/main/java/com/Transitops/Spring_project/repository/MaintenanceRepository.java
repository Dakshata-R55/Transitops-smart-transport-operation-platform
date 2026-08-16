package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.MaintenanceRecord;
import com.Transitops.Spring_project.model.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByStatus(MaintenanceStatus status);
    boolean existsByVehicleIdAndStatus(Long vehicleId, MaintenanceStatus status);
}