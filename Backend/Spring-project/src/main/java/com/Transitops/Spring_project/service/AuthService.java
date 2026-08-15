package com.Transitops.Spring_project.service;

import com.Transitops.Spring_project.dto.AuthResponse;
import com.Transitops.Spring_project.dto.LoginRequest;
import com.Transitops.Spring_project.dto.SignupRequest;
import com.Transitops.Spring_project.model.User;
import com.Transitops.Spring_project.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {
    String email = request.getEmail().trim().toLowerCase();

    if (userRepository.existsByEmail(email)) {
        throw new IllegalArgumentException("Email already registered");
    }

    User user = User.builder()
            .fullName(request.getFullName().trim())
            .email(email)
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .build();

    userRepository.save(user);

    return toResponse(user, "Signup successful");
}
    public AuthResponse login(LoginRequest request) {
    String email = request.getEmail().trim().toLowerCase();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new IllegalArgumentException("Invalid email or password");
    }

    return toResponse(user, "Login successful");
}

    private AuthResponse toResponse(User user, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .message(message)
                .build();
    }
}