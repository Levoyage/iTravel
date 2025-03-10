# **TravelGuideController & POIController API Documentation**

## **Overview**
This API allows authenticated users to manage their **travel guides** and **points of interest (POI)**, including saving, retrieving, and deleting them.

All data is stored in **MongoDB**.

---

## **Travel Guide API**

### **Model: TravelGuide**
| Field        | Type    | Description                                      |
|-------------|--------|--------------------------------------------------|
| `_id`       | String | Unique identifier for the guide (MongoDB ObjectId) |
| `userId`    | String | User ID of the owner                             |
| `destination` | String | Travel destination                              |
| `time`      | String | Timestamp when the guide was created             |
| `guide`     | Array  | A structured list of daily activities            |
| `description` | String | Additional description of the guide             |


### **Base URL:**
```
/api/guides
```

### **1. Save a Travel Guide**
**Endpoint:**  
`POST /api/guides/guide`

**Description:**  
Saves a travel guide to the authenticated user's account.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response (Success):**
```json
{
  "_id": "66af902e12a255054b7e75d2",
  "destination": "chengdu",
  "time": "2024-08-04T14:29:01.982Z",
  "guide": [
    {
      "day": "Day 1: Urban Exploration and Culinary Delights",
      "activities": [
        {
          "time": "Morning",
          "description": "Start your day with a visit to the Chengdu Research Base of Giant Panda Breeding to witness these adorable creatures in their natural habitat. (7:30 AM - 9:30 AM)"
        },
        {
          "time": "Late Morning",
          "description": "Head to the Wuhou Shrine to explore the history and culture of the Three Kingdoms period. (10:00 AM - 12:00 PM)"
        },
        {
          "time": "Afternoon",
          "description": "Take a leisurely stroll through the People's Park, a perfect place to experience local life and enjoy a traditional tea ceremony. (1:00 PM - 3:00 PM)"
        }
      ]
    }
  ],
  "description": "Travel guide for chengdu"
}
```

**Error Responses:**
- **401 Unauthorized** – User not authenticated
- **500 Internal Server Error** – Server error

---

### **2. Get Saved Guides by User**
**Endpoint:**  
`GET /api/guides/user/{userId}`

**Description:**  
Retrieves all saved travel guides for a specific user.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response:**
- **200 OK** – Successfully retrieved guides
- **401 Unauthorized** – User not authenticated
- **500 Internal Server Error** – Server error

---

### **3. Delete a Travel Guide**
**Endpoint:**  
`DELETE /api/guides/delete/{id}`

**Description:**  
Deletes a saved travel guide by its ID.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response:**
- **200 OK** – Travel Guide deleted successfully
- **404 Not Found** – Guide not found or invalid ID format
- **500 Internal Server Error** – Server error

---

## **POI (Points of Interest) API**

### **Model: POI**
| Field       | Type    | Description                                      |
|-------------|--------|--------------------------------------------------|
| `_id`       | String | Unique identifier for the POI (MongoDB ObjectId) |
| `userId`    | String | User ID of the owner                             |
| `name`      | String | Name of the point of interest                    |
| `description` | String | Description of the POI                           |
| `category`  | String | **Not used now**, mostly "Uncategorized"         |
| `location`  | String | **Not used now**, mostly "Unknown"               |
| `rating`    | Double | **Not used now**, mostly `0.0`                   |
| `imageUrl`  | String | URL of an image for the POI                      |

---

### **Base URL:**
```
/api/pois
```

### **1. Save a POI**
**Endpoint:**  
`POST /api/pois/save`

**Description:**  
Saves a point of interest to the authenticated user's account.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response (Success):**
```json
{
  "_id": "66d7a51b3fb33951e4880fc9",
  "userId": "string",
  "name": "Chengdu International Finance Square (IFS)",
  "description": "A large commercial and office complex...",
  "imageUrl": "http://127.0.0.1:5000/dataset/Chengdu_International_Finance_Square_(IFS)/Image_1.jpg"
}
```

---

### **2. Get Saved POIs by User**
**Endpoint:**  
`GET /api/pois/user/{userId}`

**Description:**  
Retrieves all saved points of interest (POIs) for a specific authenticated user.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response:**
- **200 OK** – Successfully retrieved POIs
- **401 Unauthorized** – User not authenticated
- **500 Internal Server Error** – Server error

---

### **3. Delete a POI**
**Endpoint:**  
`DELETE /api/pois/delete/{id}`

**Description:**  
Deletes a saved POI by its ID.

**Request Parameters:**
- `Authorization`: Bearer {token}

**Response:**
- **200 OK** – POI deleted successfully
- **404 Not Found** – POI not found or invalid ID format
- **500 Internal Server Error** – Server error

---

## **Notes**
- **Authentication Required:** All endpoints require a `Bearer {token}`.
- **Fields like `category`, `location`, and `rating` are deprecated and mostly unused.**