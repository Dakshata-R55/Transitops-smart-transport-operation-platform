package com.Transitops.Spring_project.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SettingsResponse {
    private String depotName;
    private String currency;        
    private String currencyLabel;   
    private String distanceUnit;    
    private List<CurrencyOptionDto> supportedCurrencies;
}