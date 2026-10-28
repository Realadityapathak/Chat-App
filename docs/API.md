# API Reference

Base URL: `http://localhost:3000/api` (in local development)

All protected routes expect an HTTP-only cookie named `jwt`.

---

## System Endpoints

### Healthcheck
- **Route**: `GET /healthz`
- **Auth Required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-28T09:35:33.512Z",
    "uptimeSeconds": 120,
    "database": "connected"
  }
  ```

---

## Authentication Endpoints (`/api/auth`)

Applied Middleware: `arcjetProtection`

### 1. Register User
- **Route**: `POST /api/auth/signup`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "user@example.com",
    "password": "secretpassword"
  }
  ```
- **Validation Rules**:
  - `fullName`, `email`, `password` are required.
  - `password` length must be >= 6 characters.
  - `email` must match regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - `email` must be unique in `User` collection.
- **Success Response**: `201 Created`
  - Cookie: Sets `jwt` (HTTP-only, 7 days max-age).
  - Body:
    ```json
    {
      "_id": "65b...",
      "fullName": "John Doe",
      "email": "user@example.com",
      "profilePic": ""
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: `{ "message": "All fields are required" | "Password must be at least 6 characters" | "Invalid email format" | "Email already exists" | "Invalid user data" }`
  - `500 Internal Server Error`: `{ "message": "Internal server error" }`

---

### 2. Login User
- **Route**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response**: `200 OK`
  - Cookie: Sets `jwt` (HTTP-only, 7 days max-age).
  - Body:
    ```json
    {
      "_id": "65b...",
      "fullName": "John Doe",
      "email": "user@example.com",
      "profilePic": "https://..."
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: `{ "message": "Email and password are required" | "Invalid credentials" }`
  - `500 Internal Server Error`: `{ "message": "Internal server error" }`

---

### 3. Logout User
- **Route**: `POST /api/auth/logout`
- **Auth Required**: No
- **Request Body**: None
- **Success Response**: `200 OK`
  - Cookie: Clears `jwt` (`maxAge: 0`, matching `httpOnly`, `secure`, and `sameSite` attributes).
  - Body: `{ "message": "Logged out successfully" }`

---

### 4. Update Profile Picture
- **Route**: `PUT /api/auth/update-profile`
- **Auth Required**: Yes (`protectRoute`)
- **Request Body**:
  ```json
  {
    "profilePic": "data:image/png;base64,..."
  }
  ```
- **Success Response**: `200 OK`
  - Body: Updated user object with new `profilePic` URL from Cloudinary (password field omitted).
- **Error Responses**:
  - `400 Bad Request`: `{ "message": "Profile pic is required" }`
  - `401 Unauthorized`: `{ "message": "Unauthorized - No token provided" }`
  - `500 Internal Server Error`: `{ "message": "Internal server error" }`

---

### 5. Check Authentication Status
- **Route**: `GET /api/auth/check`
- **Auth Required**: Yes (`protectRoute`)
- **Success Response**: `200 OK`
  - Body: Sanitized User object excluding password.
- **Error Responses**:
  - `401 Unauthorized`: `{ "message": "Unauthorized - No token provided" }`
  - `404 Not Found`: `{ "message": "User not found" }`
  - `500 Internal Server Error`: `{ "message": "Internal server error" }`

---

## Messaging Endpoints (`/api/messages`)

Applied Middleware: `arcjetProtection`, `protectRoute` on all `/api/messages` routes.

### 1. Get All Contacts
- **Route**: `GET /api/messages/contacts`
- **Auth Required**: Yes
- **Query Params**: None
- **Success Response**: `200 OK`
  - Body: Array of User objects excluding the authenticated user, excluding password (`select("-password")`).
- **Error Responses**:
  - `500 Internal Server Error`: `{ "message": "Server error" }`

---

### 2. Get Chat Partners
- **Route**: `GET /api/messages/chats`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  - Body: Array of User objects (without password) who have exchanged messages with the authenticated user, aggregated and sorted by most recent conversation interaction.
- **Error Responses**:
  - `500 Internal Server Error`: `{ "error": "Internal server error" }`

---

### 3. Get Messages by User ID (with Cursor Pagination)
- **Route**: `GET /api/messages/:id`
- **Auth Required**: Yes
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the chat partner.
- **Query Parameters**:
  - `limit`: Number of messages to return (default: `50`, max: `100`).
  - `before`: ISO timestamp string cursor to fetch older messages before this date.
- **Success Response**: `200 OK`
  - Body: Chronologically sorted array of Message documents between the authenticated user and `:id`.
- **Error Responses**:
  - `400 Bad Request`: `{ "message": "Invalid user ID format." }`
  - `500 Internal Server Error`: `{ "error": "Internal server error" }`

---

### 4. Send Message
- **Route**: `POST /api/messages/send/:id`
- **Auth Required**: Yes
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the recipient.
- **Request Body**:
  ```json
  {
    "text": "Hello world",
    "image": "data:image/png;base64,..."
  }
  ```
  *(Either `text` or `image` is required)*
- **Success Response**: `201 Created`
  - Body: Created Message object.
  - Side effect: Emits `newMessage` socket event to recipient's private user room (`io.to(receiverId)`).
- **Error Responses**:
  - `400 Bad Request`: `{ "message": "Text or image is required." | "Cannot send messages to yourself." | "Invalid receiver ID format." }`
  - `404 Not Found`: `{ "message": "Receiver not found." }`
  - `500 Internal Server Error`: `{ "error": "Internal server error" }`

---

## WebSocket Events (`Socket.io`)

### Connection
- **URL**: `http://localhost:3000`
- **Auth**: Authenticated during handshake using `socket.handshake.headers.cookie` (`jwt` token). Connection is rejected if cookie is absent or invalid.
- **Room Isolation**: Each socket automatically joins a room corresponding to the authenticated `userId` (`socket.join(userId)`).

### Server -> Client Events
- `getOnlineUsers`: Emitted on connect and disconnect. Payload: Array of unique active user ID strings `string[]`.
- `newMessage`: Emitted to recipient's room. Payload: Message document.
