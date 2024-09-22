package com.example.iTravel.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.iTravel.model.ERole;
import com.example.iTravel.model.Role;
import com.example.iTravel.model.User;
import com.example.iTravel.payload.JwtResponse;
import com.example.iTravel.payload.LoginRequest;
import com.example.iTravel.payload.MessageResponse;
import com.example.iTravel.payload.SignupRequest;
import com.example.iTravel.repository.RoleRepository;
import com.example.iTravel.repository.UserRepository;
import com.example.iTravel.security.JwtUtils;
import com.example.iTravel.service.UserDetailsImpl;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Received login request: " + loginRequest);

        try {
            // 提前检查用户是否存在
            Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
            if (!userOpt.isPresent()) {
                // 用户不存在，返回 404 错误
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // 尝试认证用户的用户名和密码
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // 设置认证信息
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 生成 JWT
            String jwt = jwtUtils.generateJwtToken(authentication);

            // 获取当前认证用户的详细信息
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // 获取用户的角色
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // 返回带有 JWT 和用户信息的响应
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    userOpt.get().getAvatarUrl().toString()));  // 添加头像URL

        } catch (BadCredentialsException e) {
            // 捕获密码错误的异常并返回 401 错误
            logger.error("Invalid login attempt: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        } catch (Exception e) {
            // 捕获其他异常并返回 500 错误
            logger.error("Error during authentication: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login. Please try again.");
        }
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        logger.info("Received signup request for username: " + signUpRequest.getUsername());

        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                logger.info("Username is already taken: " + signUpRequest.getUsername());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                logger.info("Email is already in use: " + signUpRequest.getEmail());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            // Create new user's account
            User user = new User(signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()));

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);
            logger.info("User registered successfully: " + signUpRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            logger.error("Error during user registration: ", e);
            return ResponseEntity
                    .internalServerError()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // 获取当前认证的用户信息
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 根据用户名从数据库中查找用户
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));


        // 构建响应对象，包含JWT token、用户基本信息以及头像URL
        return ResponseEntity.ok(new JwtResponse(
                null, // JWT token不需要重新生成，仅在登录时生成
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList()),
                user.getAvatarUrl().toString() // 包含用户的头像URL
        ));
    }


}