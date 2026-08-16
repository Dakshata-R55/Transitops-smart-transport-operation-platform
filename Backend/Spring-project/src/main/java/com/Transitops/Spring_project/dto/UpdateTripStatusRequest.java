package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.TripStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTripStatusRequest {

    @NotNull(message = "Status is required")
    private TripStatus status;
}