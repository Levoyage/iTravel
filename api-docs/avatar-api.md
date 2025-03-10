# FileController API Documentation

## Overview
The `FileController` class provides endpoints for uploading and downloading user avatar files.

**Base URL:** `/`

---

## Endpoints

### 1. Upload Avatar

**Endpoint:**  
`POST /upload_avatar`

**Description:**  
Uploads a user's avatar image and updates the user's profile.

**Request Parameters:**
- `Content-Type`: application/json
- `Authorization`: Bearer {token}

**Response:**
- **200 OK** – Successfully uploaded, returns file ID
  ```json
  "fileId"
  ```
- **500 Internal Server Error** – Other errors

**Example Request:**
```bash
curl -X POST "http://localhost:8080/upload_avatar" -H "Authorization: Bearer {token}" -F "file=@avatar.jpg"
```

---

### 2. Download Avatar

**Endpoint:**  
`GET /download_avatar/{fileId}`

**Description:**  
Downloads the avatar file associated with the given `fileId`.

**Path Parameters:**
- `fileId` (String) – The ID of the file to be downloaded.

**Response:**
- **200 OK** – Returns the file as a stream
- **404 Not Found** – File not found

**Example Request:**
```bash
curl -X GET "http://localhost:8080/download_avatar/{fileId}" -H "Authorization: Bearer {token}" -o avatar.jpg
```

---

## Error Handling
- **404 Not Found:** File not found
- **500 Internal Server Error:** General errors

---

## Notes
- Authentication is required for uploading files.
- The uploaded file is stored in GridFS, and its ID is used as the avatar URL for the user.
