# KimiController API Documentation

## Overview
The Kimi AI allows users to generate personalized travel itineraries (`guide`) and receive travel recommendations (`recommendations`). The backend API forwards requests to Kimi AI.

## API Documentation

### Base URL
```
/api/kimi
```

### 1. Generate Travel Itinerary

**Endpoint:**  
`POST /api/kimi/guide`

**Description:**  
Generates a detailed travel itinerary for a specified destination and number of days.

**Request Body:**
```json
{
  "model": "kimi",
  "messages": [
    {
      "role": "user",
      "content": "Generate a general travel itinerary for Paris for 3 days..."
    }
  ],
  "use_search": false,
  "stream": false
}
```

**Response:**
```json
{
  "result": "string",
  "data": { "itinerary": "structured itinerary data" }
}
```

---

### 2. Get Travel Recommendations

**Endpoint:**  
`POST /api/kimi/recommendations`

**Description:**  
Returns recommended points of interest for a given destination based on user preferences.

**Request Body:**
```json
{
  "model": "kimi",
  "messages": [
    {
      "role": "user",
      "content": "Recommend 3 points of interest in Tokyo for historical sites."
    }
  ],
  "use_search": false,
  "stream": false
}
```

**Response:**
```json
{
  "result": "string",
  "data": { "recommendations": ["POI1", "POI2", "POI3"] }
}
```


## Prompts

### 1. Generating a Travel Guide

Generate a general travel itinerary for ${destination.toUpperCase()} for ${days} day(s) based on the current season, outlining activities for each day. List the activities in an itemized format and keep the description under 300 words. Please provide a detailed itinerary in a structured format for a trip lasting [number of days] days. Each day should be clearly labeled starting from Day 1 to Day [number of days], followed by a descriptive title for the day's theme. Each activity should be listed with a specific time block (Morning, Late Morning, Afternoon, Evening). Here is the format I need:

- **Day 1: [Theme of the Day]**
  - Morning: [Activity]
  - Late Morning: [Activity]
  - Afternoon: [Activity]
  - Evening: [Activity]

Continue this format for each subsequent day.
Be realistic, especially for one (or two)-day trip. Only include the itinerary details and activities without any additional commentary (eg."Certainly! Here is...").

### 2. Fetching Travel Recommendations
Recommend 3 points of interest in ${destination.toUpperCase()} for these categories: ${query}.

**(Recommend More Button)** Recommend 3 other points of interest in ${currentDestination.toUpperCase()} for these categories: ${query}. Make sure the recommendations are different from any previously provided.


### **Note on Query Construction**

When fetching travel recommendations from Kimi AI, the query is dynamically constructed based on:

1. **User-selected Preferences:**  
   Users can choose from predefined categories from `PreferenceForm`, such as:
  - `Natural landscapes`
  - `Historical landmarks`
  - `Modern architecture`

2. **Current Destination:**  
   The frontend automatically retrieves the current destination from `GuidePage`.