package com.Transitops.Spring_project.controller;

import com.Transitops.Spring_project.dto.CreateExpenseRequest;
import com.Transitops.Spring_project.dto.ExpenseResponse;
import com.Transitops.Spring_project.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @PostMapping
    public ExpenseResponse createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        return expenseService.createExpense(request);
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @GetMapping
    public List<ExpenseResponse> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PreAuthorize("hasRole('FINANCIAL_ANALYST')")
    @PatchMapping("/{id}/complete")
    public ExpenseResponse completeExpense(@PathVariable Long id) {
        return expenseService.completeExpense(id);
    }
}