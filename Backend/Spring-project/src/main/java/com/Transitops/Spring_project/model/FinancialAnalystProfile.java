package com.Transitops.Spring_project.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "financial_analyst_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialAnalystProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String department;

    private String financeId;
}