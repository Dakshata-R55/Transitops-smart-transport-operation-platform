package com.Transitops.Spring_project.dto;

import com.Transitops.Spring_project.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private String message;
    private String token;
}