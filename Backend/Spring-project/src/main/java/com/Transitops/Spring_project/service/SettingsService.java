package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.CurrencyOptionDto;
import com.Transitops.Spring_project.dto.SettingsResponse;
import com.Transitops.Spring_project.dto.UpdateSettingsRequest;
import com.Transitops.Spring_project.model.AppSettings;
import com.Transitops.Spring_project.model.CurrencyCode;
import com.Transitops.Spring_project.repository.AppSettingsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class SettingsService {

    private static final long SETTINGS_ID = 1L;

    private final AppSettingsRepository appSettingsRepository;

    @Value("${app.settings.default-depot-name:Gandhinagar Depot GJ4}")
    private String defaultDepotName;

    @Value("${app.settings.default-currency:INR}")
    private CurrencyCode defaultCurrency;

    @Value("${app.settings.distance-unit:Kilometers}")
    private String distanceUnit;

    public SettingsService(AppSettingsRepository appSettingsRepository) {
        this.appSettingsRepository = appSettingsRepository;
    }

    @Transactional(readOnly = true)
    public SettingsResponse getSettings() {
        return toResponse(getOrCreateSettings());
    }

    @Transactional
    public SettingsResponse updateSettings(UpdateSettingsRequest request) {
        AppSettings settings = getOrCreateSettings();
        settings.setDepotName(request.getDepotName().trim());
        settings.setCurrency(request.getCurrency()); // must be one of enum values
        appSettingsRepository.save(settings);
        return toResponse(settings);
    }

    private AppSettings getOrCreateSettings() {
        return appSettingsRepository.findById(SETTINGS_ID)
                .orElseGet(() -> appSettingsRepository.save(
                        AppSettings.builder()
                                .id(SETTINGS_ID)
                                .depotName(defaultDepotName)
                                .currency(defaultCurrency)
                                .build()
                ));
    }

    private List<CurrencyOptionDto> getSupportedCurrencies() {
        return Arrays.stream(CurrencyCode.values())
                .map(c -> CurrencyOptionDto.builder()
                        .code(c.name())
                        .label(c.getLabel())
                        .build())
                .toList();
    }

    private SettingsResponse toResponse(AppSettings settings) {
        return SettingsResponse.builder()
                .depotName(settings.getDepotName())
                .currency(settings.getCurrency().name())
                .currencyLabel(settings.getCurrency().getLabel())
                .distanceUnit(distanceUnit)
                .supportedCurrencies(getSupportedCurrencies())
                .build();
    }
}