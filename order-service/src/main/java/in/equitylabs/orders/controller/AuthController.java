package in.equitylabs.orders.controller;

import in.equitylabs.orders.model.User;
import in.equitylabs.orders.repository.UserRepository;
import in.equitylabs.orders.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public Mono<ResponseEntity<AuthResponse>> signup(@RequestBody SignupRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .flatMap(existing -> Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).<AuthResponse>build()))
                .switchIfEmpty(
                        userRepository.save(User.builder()
                                .userId(UUID.randomUUID().toString())
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build())
                                .map(user -> {
                                    String token = jwtUtil.generateToken(user.getUsername());
                                    return ResponseEntity.ok(new AuthResponse(token, user));
                                })
                );
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .flatMap(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        String token = jwtUtil.generateToken(user.getUsername());
                        return Mono.just(ResponseEntity.ok(new AuthResponse(token, user)));
                    } else {
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).<AuthResponse>build());
                    }
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).build()));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupRequest {
        private String fullName;
        private String email;
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private User user;
    }
}
