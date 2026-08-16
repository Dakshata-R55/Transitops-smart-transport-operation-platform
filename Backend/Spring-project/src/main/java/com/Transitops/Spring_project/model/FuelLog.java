package com.Transitops.Spring_project.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private BigDecimal liters;

    @Column(nullable = false)
    private BigDecimal fuelCost;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}