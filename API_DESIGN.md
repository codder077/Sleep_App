# Sleep Assessment App - REST API Design

## Overview
This document outlines the complete REST API design for the Sleep Assessment application, including authentication, user management, and sleep data operations.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "displayName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phoneCode": "+1",
  "phoneNumber": "5551234567",
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "displayName": "John Doe",
      "email": "john.doe@example.com",
      "phoneCode": "+1",
      "phoneNumber": "5551234567",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "isAdmin": false,
      "emailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "displayName": "John Doe",
      "email": "john.doe@example.com",
      "phoneCode": "+1",
      "phoneNumber": "5551234567",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "isAdmin": false,
      "emailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Get Current User Profile
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "displayName": "John Doe",
      "email": "john.doe@example.com",
      "phoneCode": "+1",
      "phoneNumber": "5551234567",
      "photoURL": "https://example.com/photo.jpg",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "isAdmin": false,
      "emailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 1.4 Update User Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "displayName": "John Smith",
  "phoneCode": "+1",
  "phoneNumber": "5559876543",
  "photoURL": "https://example.com/new-photo.jpg",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "displayName": "John Smith",
      "email": "john.doe@example.com",
      "phoneCode": "+1",
      "phoneNumber": "5559876543",
      "photoURL": "https://example.com/new-photo.jpg",
      "city": "Los Angeles",
      "state": "CA",
      "country": "USA",
      "isAdmin": false,
      "emailVerified": false,
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### 1.5 Change Password
**PUT** `/auth/change-password`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 1.6 Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 1.7 Refresh Token
**POST** `/auth/refresh`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Sleep Data Endpoints

### 2.1 Create Sleep Data Entry
**POST** `/sleep`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "john_doe",
  "change": ["Reduced caffeine", "Earlier bedtime"],
  "sleepStruggle": {
    "min": 0,
    "max": 2
  },
  "bedTime": "22:30",
  "wakeTime": "07:00",
  "sleepDuration": 8.5,
  "sleepQuality": 7,
  "sleepEfficiency": 85,
  "notes": "Slept well after reducing screen time",
  "tags": ["good-sleep", "routine"],
  "isPublic": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sleep data created successfully",
  "data": {
    "sleepData": {
      "id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "change": ["Reduced caffeine", "Earlier bedtime"],
      "sleepStruggle": {
        "min": 0,
        "max": 2
      },
      "bedTime": "22:30",
      "wakeTime": "07:00",
      "sleepDuration": 8.5,
      "sleepQuality": 7,
      "sleepEfficiency": 85,
      "calculatedDuration": 8.5,
      "qualityDescription": "Good",
      "notes": "Slept well after reducing screen time",
      "tags": ["good-sleep", "routine"],
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2.2 Get User's Sleep Data
**GET** `/sleep?limit=10&page=1&sort=-createdAt`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (optional): Number of records per page (default: 10, max: 50)
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort field with direction (e.g., `-createdAt`, `sleepQuality`)
- `filter` (optional): Filter by quality, duration, etc.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sleepData": [
      {
        "id": "507f1f77bcf86cd799439012",
        "username": "john_doe",
        "change": ["Reduced caffeine", "Earlier bedtime"],
        "sleepStruggle": {
          "min": 0,
          "max": 2
        },
        "bedTime": "22:30",
        "wakeTime": "07:00",
        "sleepDuration": 8.5,
        "sleepQuality": 7,
        "sleepEfficiency": 85,
        "calculatedDuration": 8.5,
        "qualityDescription": "Good",
        "notes": "Slept well after reducing screen time",
        "tags": ["good-sleep", "routine"],
        "isPublic": false,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 2.3 Get Specific Sleep Data Entry
**GET** `/sleep/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sleepData": {
      "id": "507f1f77bcf86cd799439012",
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "displayName": "John Doe",
        "email": "john.doe@example.com"
      },
      "username": "john_doe",
      "change": ["Reduced caffeine", "Earlier bedtime"],
      "sleepStruggle": {
        "min": 0,
        "max": 2
      },
      "bedTime": "22:30",
      "wakeTime": "07:00",
      "sleepDuration": 8.5,
      "sleepQuality": 7,
      "sleepEfficiency": 85,
      "calculatedDuration": 8.5,
      "qualityDescription": "Good",
      "notes": "Slept well after reducing screen time",
      "tags": ["good-sleep", "routine"],
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2.4 Update Sleep Data Entry
**PUT** `/sleep/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "sleepQuality": 8,
  "sleepEfficiency": 90,
  "notes": "Updated notes about sleep quality improvement",
  "tags": ["excellent-sleep", "routine", "improvement"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sleep data updated successfully",
  "data": {
    "sleepData": {
      "id": "507f1f77bcf86cd799439012",
      "username": "john_doe",
      "change": ["Reduced caffeine", "Earlier bedtime"],
      "sleepStruggle": {
        "min": 0,
        "max": 2
      },
      "bedTime": "22:30",
      "wakeTime": "07:00",
      "sleepDuration": 8.5,
      "sleepQuality": 8,
      "sleepEfficiency": 90,
      "calculatedDuration": 8.5,
      "qualityDescription": "Excellent",
      "notes": "Updated notes about sleep quality improvement",
      "tags": ["excellent-sleep", "routine", "improvement"],
      "isPublic": false,
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### 2.5 Delete Sleep Data Entry
**DELETE** `/sleep/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sleep data deleted successfully"
}
```

### 2.6 Get Sleep Statistics
**GET** `/sleep/stats`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEntries": 50,
      "avgSleepDuration": 7.8,
      "avgSleepQuality": 6.5,
      "avgSleepEfficiency": 78.5,
      "minSleepDuration": 4.2,
      "maxSleepDuration": 10.5,
      "bestSleepQuality": 10,
      "worstSleepQuality": 2,
      "recentTrends": {
        "last7Days": {
          "avgDuration": 8.1,
          "avgQuality": 7.2
        },
        "last30Days": {
          "avgDuration": 7.9,
          "avgQuality": 6.8
        }
      },
      "qualityDistribution": {
        "excellent": 15,
        "good": 20,
        "fair": 10,
        "poor": 5
      }
    }
  }
}
```

### 2.7 Get Public Sleep Data
**GET** `/sleep/public?limit=10&page=1`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sleepData": [
      {
        "id": "507f1f77bcf86cd799439013",
        "username": "anonymous_user",
        "sleepStruggle": {
          "min": 2,
          "max": 8
        },
        "bedTime": "23:00",
        "wakeTime": "06:30",
        "sleepDuration": 7.5,
        "sleepQuality": 6,
        "sleepEfficiency": 75,
        "calculatedDuration": 7.5,
        "qualityDescription": "Good",
        "tags": ["public", "insomnia"],
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 3. Error Responses

### 3.1 Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### 3.2 Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

### 3.3 Authorization Error (403 Forbidden)
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

### 3.4 Not Found Error (404 Not Found)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 3.5 Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 4. API Interaction Flows

### 4.1 User Registration and Onboarding Flow
1. **Register User** → `POST /auth/register`
2. **Complete Onboarding** → `POST /sleep` (multiple entries)
3. **View Dashboard** → `GET /sleep/stats` + `GET /sleep?limit=5`

### 4.2 Daily Sleep Tracking Flow
1. **Login** → `POST /auth/login`
2. **Add Sleep Entry** → `POST /sleep`
3. **View Recent Data** → `GET /sleep?limit=7`
4. **Check Statistics** → `GET /sleep/stats`

### 4.3 Sleep Data Management Flow
1. **View All Entries** → `GET /sleep?limit=20&page=1`
2. **Edit Entry** → `PUT /sleep/:id`
3. **Delete Entry** → `DELETE /sleep/:id`
4. **Update Profile** → `PUT /auth/profile`

### 4.4 Public Data Sharing Flow
1. **Set Entry as Public** → `PUT /sleep/:id` (set `isPublic: true`)
2. **Browse Public Data** → `GET /sleep/public`
3. **View Community Insights** → Analyze public data patterns

---

## 5. Rate Limiting and Security

### 5.1 Rate Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **Sleep data endpoints**: 100 requests per minute per user
- **Public endpoints**: 50 requests per minute per IP

### 5.2 Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 5.3 CORS Configuration
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 6. Pagination and Filtering

### 6.1 Pagination Parameters
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10, max: 50)

### 6.2 Sorting Parameters
- `sort`: Field with direction (e.g., `-createdAt`, `sleepQuality`, `-sleepDuration`)

### 6.3 Filtering Parameters
- `quality`: Filter by sleep quality (1-10)
- `duration`: Filter by sleep duration range
- `dateFrom`: Filter from date (ISO format)
- `dateTo`: Filter to date (ISO format)
- `tags`: Filter by tags (comma-separated)

---

## 7. WebSocket Events (Future Enhancement)

### 7.1 Real-time Updates
```javascript
// Connect to WebSocket
const socket = io('http://localhost:5000');

// Listen for sleep data updates
socket.on('sleepDataUpdated', (data) => {
  console.log('Sleep data updated:', data);
});

// Listen for new entries
socket.on('newSleepEntry', (data) => {
  console.log('New sleep entry:', data);
});
```

This comprehensive API design provides a complete foundation for the sleep assessment application with robust authentication, data management, and analytics capabilities. 