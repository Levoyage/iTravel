package com.example.iTravel.repository;

import com.example.iTravel.model.TravelGuide;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for accessing TravelGuide data from MongoDB.
 * Extends MongoRepository to provide CRUD operations on TravelGuide entities.
 */

@Repository
public interface TravelGuideRepository extends MongoRepository<TravelGuide, String> {
    //List<TravelGuide> findByTitle(String title);//迭代功能：用户查询
}