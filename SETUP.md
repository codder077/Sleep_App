# Wysa Sleep Assessment - Complete Setup Guide

This guide will help you set up both the frontend and backend for the Wysa Sleep Assessment application.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd wysa-sleep-assessment

# Install frontend dependencies
npm install

# Setup backend
cd backend
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 3. Environment Configuration

#### Backend Configuration
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wysa-sleep-assessment
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wysa-sleep-assessment
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Configuration (Optional)
Create `.env` in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Using Scripts (Recommended)

**Windows:**
```bash
# Start backend
start-backend.bat

# In another terminal, start frontend
npm start
```

**macOS/Linux:**
```bash
# Make script executable
chmod +x start-backend.sh

# Start backend
./start-backend.sh

# In another terminal, start frontend
npm start
```

#### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 5. Verify Installation

1. **Backend Health Check**: http://localhost:5000/health
2. **API Documentation**: http://localhost:5000/api
3. **Frontend**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Sleep Data
- `POST /api/sleep` - Create sleep data
- `GET /api/sleep` - Get user sleep data
- `GET /api/sleep/stats` - Get sleep statistics
- `PUT /api/sleep/:id` - Update sleep data
- `DELETE /api/sleep/:id` - Delete sleep data

## Testing the API

### Using Postman or similar tool:

1. **Register a user:**
   ```http
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "displayName": "Test User",
     "email": "test@example.com",
     "password": "TestPass123"
   }
   ```

2. **Login:**
   ```http
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "TestPass123"
   }
   ```

3. **Create sleep data:**
   ```http
   POST http://localhost:5000/api/sleep
   Authorization: Bearer <token-from-login>
   Content-Type: application/json
   
   {
     "username": "TestUser",
     "change": ["I would go to sleep easily"],
     "sleepStruggle": {
       "min": 2,
       "max": 8
     },
     "bedTime": "23:30",
     "wakeTime": "06:00",
     "sleepDuration": 6.5,
     "sleepQuality": 8
   }
   ```

## Running Tests

```bash
cd backend
npm test
```

## Production Deployment

### Backend Deployment

1. **Set production environment variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-secret
   CORS_ORIGIN=your-frontend-domain
   ```

2. **Install production dependencies:**
   ```bash
   npm install --production
   ```

3. **Start server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder to your hosting service**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for cloud MongoDB

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port

3. **CORS Errors**
   - Verify CORS_ORIGIN in backend `.env`
   - Check frontend API URL configuration

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration

### Logs

- **Backend logs**: Check terminal where backend is running
- **Frontend logs**: Check browser console
- **Database logs**: Check MongoDB logs

## Security Considerations

1. **Change default JWT secret** in production
2. **Use HTTPS** in production
3. **Set up proper CORS** for your domain
4. **Use environment variables** for sensitive data
5. **Regular security updates** for dependencies

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Test API endpoints individually
5. Check database connectivity

## Next Steps

After successful setup:

1. **Explore the API documentation** at http://localhost:5000/api
2. **Test user registration and login**
3. **Create sleep data entries**
4. **View sleep statistics**
5. **Customize the application** for your needs

Happy coding! 🚀 