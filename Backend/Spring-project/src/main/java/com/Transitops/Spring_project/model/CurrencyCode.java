package com.Transitops.Spring_project.model;

public enum CurrencyCode {
    INR("INR (Rs)"),
    USD("USD ($)"),
    EUR("EUR (€)"),
    GBP("GBP (£)"),
    AED("AED (Dh)"),
    JPY("JPY (¥)");

    private final String label;

    CurrencyCode(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}