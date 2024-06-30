package com.example.iTravel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * This class represents a Travel Guide entity stored in the MongoDB database.
 * It includes the guide's ID, destination, and content.
 */
@Data
@Document(collection = "travelGuides")
public class TravelGuide {

    @Id
    private String id;
    private String destination;
    private String guide;
}
