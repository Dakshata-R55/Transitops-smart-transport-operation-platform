package com.Transitops.Spring_project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateTripRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Vehicle is required")
    private Long vehicleId;

    @NotNull(message = "Driver is required")
    private Long driverId;

    @NotNull(message = "Cargo weight is required")
    @Positive(message = "Cargo weight must be greater than 0")
    private Integer cargoWeight;

    @NotNull(message = "Planned distance is required")
    @Positive(message = "Planned distance must be greater than 0")
    private Integer plannedDistance;
}