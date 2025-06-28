# Sleep Assessment App - Database Schema Design

## Overview
This document outlines the complete database schema design for the Sleep Assessment application using MongoDB with Mongoose ODM. The schema is designed for optimal performance, data integrity, and scalability.

---

## Database: `sleep_assessment_db`

### Connection String
```
mongodb://localhost:27017/sleep_assessment_db
```

---

## 1. Users Collection

### Collection Name: `users`

### Schema Definition
```javascript
{
  _id: ObjectId,
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  phoneCode: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  photoURL: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Sample Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "displayName": "John Doe",
  "email": "john.doe@example.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe",
  "phoneCode": "+1",
  "phoneNumber": "5551234567",
  "photoURL": "https://example.com/photos/john.jpg",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "isAdmin": false,
  "isActive": true,
  "lastLogin": ISODate("2024-01-15T10:30:00.000Z"),
  "emailVerified": false,
  "createdAt": ISODate("2024-01-15T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Indexes
```javascript
// Primary indexes
{ "email": 1 } // Unique index for email lookups
{ "displayName": 1 } // Index for name searches

// Compound indexes
{ "isActive": 1, "createdAt": -1 } // For active user queries
{ "emailVerified": 1, "isActive": 1 } // For verification queries

// Text indexes
{ "displayName": "text", "email": "text" } // For search functionality
```

### Validation Rules
- Email must be unique across all users
- Password must be at least 6 characters
- Display name must be 2-32 characters
- Email format must be valid
- Phone number format validation (if provided)

---

## 2. Sleep Data Collection

### Collection Name: `sleepdata`

### Schema Definition
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32
  },
  change: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length <= 10;
      },
      message: 'Change array cannot exceed 10 items'
    }
  },
  sleepStruggle: {
    min: {
      type: Number,
      enum: [0, 2, 8],
      default: 0,
      required: true
    },
    max: {
      type: Number,
      enum: [2, 8, 10],
      default: 2,
      required: true
    }
  },
  bedTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  wakeTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  sleepDuration: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  sleepEfficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length <= 5;
      },
      message: 'Tags array cannot exceed 5 items'
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Sample Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "username": "john_doe",
  "change": ["Reduced caffeine intake", "Earlier bedtime routine"],
  "sleepStruggle": {
    "min": 0,
    "max": 2
  },
  "bedTime": "22:30",
  "wakeTime": "07:00",
  "sleepDuration": 8.5,
  "sleepQuality": 7,
  "sleepEfficiency": 85,
  "notes": "Slept much better after implementing new routine. Reduced screen time before bed helped significantly.",
  "tags": ["good-sleep", "routine", "improvement"],
  "isPublic": false,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Indexes
```javascript
// Primary indexes
{ "user": 1, "createdAt": -1 } // For user's sleep data queries
{ "username": 1 } // For username lookups

// Performance indexes
{ "createdAt": -1 } // For recent data queries
{ "sleepQuality": -1 } // For quality-based queries
{ "isPublic": 1, "createdAt": -1 } // For public data queries

// Compound indexes
{ "user": 1, "sleepQuality": -1 } // For user's quality trends
{ "user": 1, "sleepDuration": -1 } // For user's duration trends
{ "isPublic": 1, "sleepQuality": -1 } // For public quality analysis

// Text indexes
{ "notes": "text", "tags": "text" } // For content search
```

### Validation Rules
- User reference must exist in users collection
- Sleep struggle min must be less than max
- Sleep duration must be between 0-24 hours
- Sleep quality must be between 1-10
- Sleep efficiency must be between 0-100%
- Time formats must be HH:MM
- Tags array cannot exceed 5 items
- Change array cannot exceed 10 items

---

## 3. Analytics Collection (Future Enhancement)

### Collection Name: `analytics`

### Schema Definition
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  metrics: {
    totalEntries: Number,
    avgSleepDuration: Number,
    avgSleepQuality: Number,
    avgSleepEfficiency: Number,
    minSleepDuration: Number,
    maxSleepDuration: Number,
    bestSleepQuality: Number,
    worstSleepQuality: Number,
    consistencyScore: Number
  },
  trends: {
    durationTrend: String, // 'improving', 'declining', 'stable'
    qualityTrend: String,
    efficiencyTrend: String
  },
  insights: [{
    type: String,
    category: String,
    description: String,
    severity: String // 'low', 'medium', 'high'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Sample Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "period": "weekly",
  "startDate": ISODate("2024-01-08T00:00:00.000Z"),
  "endDate": ISODate("2024-01-14T23:59:59.000Z"),
  "metrics": {
    "totalEntries": 7,
    "avgSleepDuration": 7.8,
    "avgSleepQuality": 6.5,
    "avgSleepEfficiency": 78.5,
    "minSleepDuration": 6.2,
    "maxSleepDuration": 9.1,
    "bestSleepQuality": 8,
    "worstSleepQuality": 4,
    "consistencyScore": 75.2
  },
  "trends": {
    "durationTrend": "improving",
    "qualityTrend": "stable",
    "efficiencyTrend": "improving"
  },
  "insights": [
    {
      "type": "sleep_duration",
      "category": "improvement",
      "description": "Sleep duration increased by 0.5 hours this week",
      "severity": "medium"
    }
  ],
  "createdAt": ISODate("2024-01-15T00:00:00.000Z")
}
```

---

## 4. Notifications Collection (Future Enhancement)

### Collection Name: `notifications`

### Schema Definition
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['reminder', 'insight', 'achievement', 'alert'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: Object,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 5. Database Relationships

### 5.1 One-to-Many: User to Sleep Data
```javascript
// User can have multiple sleep data entries
User (1) → SleepData (N)

// Query example
const userWithSleepData = await User.findById(userId)
  .populate('sleepData', 'bedTime wakeTime sleepQuality createdAt')
  .exec();
```

### 5.2 Referential Integrity
```javascript
// Ensure user exists before creating sleep data
const user = await User.findById(userId);
if (!user) {
  throw new Error('User not found');
}

// Cascade delete (optional)
// When user is deleted, delete all their sleep data
userSchema.pre('remove', async function(next) {
  await SleepData.deleteMany({ user: this._id });
  next();
});
```

---

## 6. Data Validation and Constraints

### 6.1 Application-Level Validation
```javascript
// Sleep data validation
sleepDataSchema.pre('save', function(next) {
  // Validate sleep struggle range
  if (this.sleepStruggle.min >= this.sleepStruggle.max) {
    return next(new Error('Sleep struggle minimum must be less than maximum'));
  }
  
  // Validate sleep duration
  if (this.sleepDuration < 0 || this.sleepDuration > 24) {
    return next(new Error('Sleep duration must be between 0 and 24 hours'));
  }
  
  // Validate time format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(this.bedTime) || !timeRegex.test(this.wakeTime)) {
    return next(new Error('Invalid time format. Use HH:MM'));
  }
  
  next();
});
```

### 6.2 Database-Level Constraints
```javascript
// Unique constraints
db.users.createIndex({ "email": 1 }, { unique: true });

// Compound unique constraints
db.sleepdata.createIndex({ "user": 1, "createdAt": 1 }, { unique: false });

// Partial indexes for performance
db.sleepdata.createIndex(
  { "isPublic": 1, "createdAt": -1 },
  { partialFilterExpression: { "isPublic": true } }
);
```

---

## 7. Performance Optimization

### 7.1 Index Strategy
```javascript
// Most frequently used queries
{ "user": 1, "createdAt": -1 } // User's sleep data
{ "isPublic": 1, "createdAt": -1 } // Public data
{ "sleepQuality": -1, "createdAt": -1 } // Quality analysis

// Compound indexes for complex queries
{ "user": 1, "sleepQuality": -1, "createdAt": -1 }
{ "user": 1, "sleepDuration": -1, "createdAt": -1 }
```

### 7.2 Aggregation Pipeline Optimization
```javascript
// Optimized stats aggregation
const stats = await SleepData.aggregate([
  { $match: { user: new ObjectId(userId) } },
  { $sort: { createdAt: -1 } },
  {
    $group: {
      _id: null,
      totalEntries: { $sum: 1 },
      avgSleepDuration: { $avg: '$sleepDuration' },
      avgSleepQuality: { $avg: '$sleepQuality' },
      avgSleepEfficiency: { $avg: '$sleepEfficiency' },
      minSleepDuration: { $min: '$sleepDuration' },
      maxSleepDuration: { $max: '$sleepDuration' },
      bestSleepQuality: { $max: '$sleepQuality' },
      worstSleepQuality: { $min: '$sleepQuality' }
    }
  }
]);
```

---

## 8. Data Migration and Backup

### 8.1 Backup Strategy
```bash
# Daily backup
mongodump --db sleep_assessment_db --out /backup/daily/

# Weekly backup
mongodump --db sleep_assessment_db --out /backup/weekly/

# Monthly backup
mongodump --db sleep_assessment_db --out /backup/monthly/
```

### 8.2 Data Migration Scripts
```javascript
// Migration script for adding new fields
db.sleepdata.updateMany(
  { "sleepEfficiency": { $exists: false } },
  { $set: { "sleepEfficiency": 0 } }
);

// Migration script for data cleanup
db.sleepdata.updateMany(
  { "sleepDuration": { $lt: 0 } },
  { $set: { "sleepDuration": 0 } }
);
```

---

## 9. Security Considerations

### 9.1 Data Encryption
```javascript
// Sensitive data encryption
const encryptedPassword = await bcrypt.hash(password, 12);

// JWT token encryption
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '7d',
  algorithm: 'HS256'
});
```

### 9.2 Access Control
```javascript
// Row-level security
const userSleepData = await SleepData.find({
  user: userId,
  $or: [
    { isPublic: true },
    { user: req.user.id }
  ]
});
```

---

## 10. Monitoring and Analytics

### 10.1 Database Metrics
```javascript
// Collection statistics
db.sleepdata.stats();

// Index usage statistics
db.sleepdata.aggregate([
  { $indexStats: {} }
]);

// Query performance analysis
db.sleepdata.find({ user: ObjectId("...") }).explain("executionStats");
```

### 10.2 Health Checks
```javascript
// Database connection health
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

This comprehensive database schema design provides a robust foundation for the sleep assessment application with proper indexing, validation, and performance optimization strategies. 