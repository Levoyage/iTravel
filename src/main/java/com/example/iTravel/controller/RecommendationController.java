package com.example.iTravel.controller;

import com.example.iTravel.service.RecommendationService;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://i-travel-app.s3-website-us-east-1.amazonaws.com")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private Cache<String, Object> caffeineCache;

    @GetMapping("/recommendations")
    public Object getRecommendations(@RequestParam String destination, @RequestParam String date) {
        String cacheKey = "recommendations:" + destination + ":" + date;
        Object cachedRecommendations = caffeineCache.getIfPresent(cacheKey);

        if (cachedRecommendations != null) {
            return cachedRecommendations;
        }

        Object recommendations = recommendationService.getRecommendations(destination, date);
        if (recommendations != null) {
            caffeineCache.put(cacheKey, recommendations);
        }
        return recommendations;
    }
}
