package com.example.iTravel.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;

@RestController
@RequestMapping("/api/kimi")
@CrossOrigin(origins = "http://localhost:3000")
public class KimiController {

    @Value("${kimi.api.url}")
    private String kimiApiUrl;

    @Value("${kimi.api.token}")
    private String kimiApiToken;

    @PostMapping("/{type}")
    public ResponseEntity<Map<String, Object>> forwardRequest(@PathVariable String type, @RequestBody Map<String, Object> request) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + kimiApiToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                kimiApiUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        return ResponseEntity.ok(response.getBody());
    }
}
