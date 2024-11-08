package com.example.iTravel.controller;

import com.example.iTravel.model.POI;
import com.example.iTravel.service.POIService;
import com.example.iTravel.service.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.bson.types.ObjectId;

@RestController
@RequestMapping("/api/pois")
@CrossOrigin(origins = "http://i-travel-app.s3-website-us-east-1.amazonaws.com")
public class POIController {

    @Autowired
    private POIService poiService;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePOI(@PathVariable String id) {
        boolean isDeleted = poiService.deletePOIById(id);
        if (isDeleted) {
            return ResponseEntity.ok("POI deleted successfully");
        } else {
            return ResponseEntity.status(404).body("POI not found or invalid ID format");
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> addPOI(@RequestBody POI poi, HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User is not authenticated");
        }
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        poi.setUserId(userId);
        POI savedPOI = poiService.savePOI(poi);
        return ResponseEntity.ok(savedPOI);
    }

    @GetMapping("/user/{userId}")
    public List<POI> getPOIsByUserId(@PathVariable String userId) {
        return poiService.getPOIsByUserId(userId);
    }
}