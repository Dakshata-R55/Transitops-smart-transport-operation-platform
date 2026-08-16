package com.Transitops.Spring_project.repository;

import com.Transitops.Spring_project.model.AppSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppSettingsRepository extends JpaRepository<AppSettings, Long> {
}