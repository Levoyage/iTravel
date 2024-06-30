package com.example.iTravel.confg;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoClients;

/**
 * ClassName: MongoTestConfiguration
 * Package: com.example.iTravel.confg
 * Description:
 *
 * @Author Yuki
 * @Create 14/06/2024 15:16
 * @Version 1.0
 */

@Configuration
public class MongoTestConfiguration {

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(MongoClients.create(), "test-database");
    }
}

