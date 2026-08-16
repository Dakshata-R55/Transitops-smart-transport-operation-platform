package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.Trip;
import com.Transitops.Spring_project.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);
}