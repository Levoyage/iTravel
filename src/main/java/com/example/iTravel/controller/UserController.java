package com.example.iTravel.controller;

import com.example.iTravel.model.POI;
import com.example.iTravel.model.TravelGuide;
import com.example.iTravel.model.User;
import com.example.iTravel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://i-travel-app.s3-website-us-east-1.amazonaws.com")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}/guides")
    public List<TravelGuide> getUserGuides(@PathVariable String userId) {
        return userService.getUserGuides(userId);
    }

    @GetMapping("/{userId}/pois")
    public List<POI> getUserPOIs(@PathVariable String userId) {
        return userService.getUserPOIs(userId);
    }

}
