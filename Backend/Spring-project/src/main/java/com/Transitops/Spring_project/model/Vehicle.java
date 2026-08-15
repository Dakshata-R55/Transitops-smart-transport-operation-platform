package com.Transitops.Spring_project.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    private String nameModel;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer maxLoadCapacityKg;

    @Column(nullable = false)
    private Integer odometer;

    @Column(nullable = false)
    private BigDecimal acquisitionCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;
}