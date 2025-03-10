# AuthController API Documentation

## Overview
The `AuthController` class provides authentication-related endpoints, including user login, registration, and retrieving user details.

**Base URL:** `/api/auth`

---

## Endpoints

### 1. User Login

**Endpoint:**  
`POST /api/auth/login`

**Description:**  
Authenticates a user and returns a JWT token along with user details.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
- **200 OK** – Successful authentication
  ```json
  {
    "token": "string",
    "id": "integer",
    "username": "string",
    "email": "string",
    "roles": ["string"],
    "avatarUrl": "string"
  }
  ```
- **401 Unauthorized** – Incorrect password
- **404 Not Found** – User does not exist
- **500 Internal Server Error** – Other errors

---

### 2. User Registration

**Endpoint:**  
`POST /api/auth/signup`

**Description:**  
Registers a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
- **200 OK** – Registration successful
  ```json
  {
    "message": "User registered successfully!"
  }
  ```
- **400 Bad Request** – Username or email already exists
- **500 Internal Server Error** – Other errors

---

### 3. Get Current User

**Endpoint:**  
`GET /api/auth/me`

**Description:**  
Returns details of the currently authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
- **200 OK** – Returns user details
  ```json
  {
    "token": null,
    "id": "integer",
    "username": "string",
    "email": "string",
    "roles": ["string"],
    "avatarUrl": "string"
  }
  ```
- **401 Unauthorized** – User not authenticated
- **404 Not Found** – User not found

---

## Error Handling
- **401 Unauthorized:** When authentication fails
- **404 Not Found:** When requested data is not available
- **500 Internal Server Error:** General errors

---

## Notes
- JWT token is required for accessing `/me` endpoint.
- Passwords are encrypted before storing in the database.
- Default role assigned to a user is `ROLE_USER`.

