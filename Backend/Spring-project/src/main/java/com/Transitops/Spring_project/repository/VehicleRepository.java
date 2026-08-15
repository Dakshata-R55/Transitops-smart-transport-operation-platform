package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByRegistrationNumber(String registrationNumber);
}