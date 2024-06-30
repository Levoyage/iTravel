package com.example.iTravel.controller;

import com.example.iTravel.model.TravelGuide;
import com.example.iTravel.service.TravelGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide")
public class TravelGuideController {

    @Autowired
    private TravelGuideService travelGuideService;

    @GetMapping("/")
    public List<TravelGuide> getAllTravelGuides() {
        return travelGuideService.getAllTravelGuides();
    }

    @PostMapping("/")
    public ResponseEntity<TravelGuide> createTravelGuide(@RequestBody TravelGuide travelGuide) {
        TravelGuide createdTravelGuide = travelGuideService.saveTravelGuide(travelGuide);
        return ResponseEntity.ok(createdTravelGuide);
    }
}
