package com.example.iTravel;

import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.junit.jupiter.api.Test;
import com.example.iTravel.model.POI;
import org.springframework.data.mongodb.core.query.Query;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ClassName: MongoDbSpringIntegrationTest
 * Package: com.example.iTravel
 * Description:
 *
 * @Author Yuki
 * @Create 14/06/2024 15:04
 * @Version 1.0
 */

@DataMongoTest
public class MongoDbSpringIntegrationTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    void testMongoDbConnection() throws Exception {
        // Create a new POI object
        POI poi = new POI();
        poi.setName("Eiffel Tower");
        poi.setDescription("Iconic symbol of Paris");
        poi.setCategory("Landmark");
        poi.setLocation("Paris, France");
        poi.setRating(4.7);

        // Save the POI to the 'pois' collection
        mongoTemplate.save(poi, "pois");

        // Count POIs in the 'pois' collection
        long count = mongoTemplate.count(new Query(), POI.class);
        assertThat(count).isGreaterThan(0);
    }
}
