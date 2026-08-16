package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.FinanceSummaryResponse;
import com.Transitops.Spring_project.service.ExpenseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final ExpenseService expenseService;

    public FinanceController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @GetMapping("/summary")
    public FinanceSummaryResponse getSummary() {
        return expenseService.getFinanceSummary();
    }
}