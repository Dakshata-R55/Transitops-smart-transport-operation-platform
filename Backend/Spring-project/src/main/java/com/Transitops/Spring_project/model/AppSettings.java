package com.Transitops.Spring_project.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppSettings {

    @Id
    private Long id;

    @Column(nullable = false)
    private String depotName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CurrencyCode currency;
}