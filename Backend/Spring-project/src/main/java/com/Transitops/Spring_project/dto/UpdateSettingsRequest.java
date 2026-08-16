package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.CurrencyCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSettingsRequest {

    @NotBlank(message = "Depot name is required")
    private String depotName;

    @NotNull(message = "Currency is required")
    private CurrencyCode currency;
}