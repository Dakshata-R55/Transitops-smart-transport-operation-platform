package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.TripStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TripResponse {
    private Long id;
    private String source;
    private String destination;
    private Long vehicleId;
    private Long driverId;
    private Integer cargoWeight;
    private Integer plannedDistance;
    private TripStatus status;
    private LocalDateTime createdAt;
    private String message;
}