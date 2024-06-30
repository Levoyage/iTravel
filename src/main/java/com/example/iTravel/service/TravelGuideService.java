package com.example.iTravel.service;

import com.example.iTravel.model.TravelGuide;
import com.example.iTravel.repository.TravelGuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling business logic related to TravelGuide entities.
 * Provides methods to save a new travel guide and retrieve all travel guides.
 */
@Service
public class TravelGuideService {

    @Autowired
    private TravelGuideRepository repository;

    /**
     * Saves a new travel guide to the database.
     * @param travelGuide The TravelGuide entity to be saved.
     * @return The saved TravelGuide entity.
     */
    public TravelGuide saveTravelGuide(TravelGuide travelGuide) {
        return repository.save(travelGuide);
    }

    /**
     * Retrieves all travel guides from the database.
     * @return A list of all TravelGuide entities.
     */
    public List<TravelGuide> getAllTravelGuides() {
        return repository.findAll();
    }
}
