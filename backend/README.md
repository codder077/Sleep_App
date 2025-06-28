# Wysa Sleep Assessment Backend API

A comprehensive Node.js/Express backend API for the Wysa Sleep Assessment application with MongoDB database, JWT authentication, and advanced sleep data management.

## Features

- 🔐 **JWT Authentication** - Secure user registration, login, and token management
- 📊 **Sleep Data Management** - CRUD operations for sleep tracking data
- 📈 **Analytics & Statistics** - Sleep quality analysis and trends
- 🔒 **Security** - Rate limiting, CORS, helmet, input validation
- 📝 **Validation** - Comprehensive request validation using express-validator
- 🗄️ **Database** - MongoDB with Mongoose ODM
- 🚀 **Performance** - Compression, indexing, pagination
- 📋 **API Documentation** - Built-in endpoint documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors, rate-limiting
- **Logging**: Morgan

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wysa-sleep-assessment/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/wysa-sleep-assessment
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your machine
   - Cloud: Use MongoDB Atlas or other cloud provider

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/auth/refresh` | Refresh token | Private |

### Sleep Data

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/sleep` | Create sleep data | Private |
| GET | `/api/sleep` | Get user sleep data | Private |
| GET | `/api/sleep/stats` | Get sleep statistics | Private |
| GET | `/api/sleep/:id` | Get specific entry | Private |
| PUT | `/api/sleep/:id` | Update entry | Private |
| DELETE | `/api/sleep/:id` | Delete entry | Private |
| GET | `/api/sleep/public` | Get public data | Public |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API documentation |

## Request/Response Examples

### User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "displayName": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-07-20T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Create Sleep Data
```bash
POST /api/sleep
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "JohnDoe",
  "change": ["I would go to sleep easily", "I would sleep throughout the night"],
  "sleepStruggle": {
    "min": 2,
    "max": 8
  },
  "bedTime": "23:30",
  "wakeTime": "06:00",
  "sleepDuration": 6.5,
  "sleepQuality": 8,
  "sleepEfficiency": 85,
  "notes": "Felt well rested today",
  "tags": ["good-sleep", "well-rested"]
}
```

## Data Models

### User Model
- `displayName`: String (2-32 chars)
- `email`: String (unique, validated)
- `password`: String (hashed)
- `phoneCode`, `phoneNumber`: String
- `photoURL`: String
- `city`, `state`, `country`: String
- `isAdmin`: Boolean
- `isActive`: Boolean
- `lastLogin`: Date
- `emailVerified`: Boolean

### Sleep Data Model
- `user`: ObjectId (ref: User)
- `username`: String
- `change`: Array of strings
- `sleepStruggle`: Object with min/max values
- `bedTime`, `wakeTime`: String (HH:MM format)
- `sleepDuration`: Number (0-24 hours)
- `sleepQuality`: Number (1-10)
- `sleepEfficiency`: Number (0-100%)
- `notes`: String
- `tags`: Array of strings
- `isPublic`: Boolean

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Compression**: Response compression

## Error Handling

The API provides consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRE`: JWT expiration time
- `CORS_ORIGIN`: Allowed CORS origin
- `RATE_LIMIT_WINDOW_MS`: Rate limit window
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## Deployment

1. **Set environment variables** for production
2. **Install dependencies**: `npm install --production`
3. **Start server**: `npm start`
4. **Use PM2** for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "wysa-backend"
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 