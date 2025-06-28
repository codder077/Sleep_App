const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/wysa-test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is running');
    });
  });

  describe('API Documentation', () => {
    it('should return API documentation', async () => {
      const res = await request(app)
        .get('/api')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Wysa Sleep Assessment API');
      expect(res.body.endpoints).toBeDefined();
    });
  });

  describe('Authentication', () => {
    const testUser = {
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123'
    };

    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.token).toBeDefined();
    });

    it('should login user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Sleep Data', () => {
    let token;
    let sleepDataId;

    beforeAll(async () => {
      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123'
        });
      token = loginRes.body.data.token;
    });

    it('should create sleep data', async () => {
      const sleepData = {
        username: 'TestUser',
        change: ['I would go to sleep easily'],
        sleepStruggle: {
          min: 2,
          max: 8
        },
        bedTime: '23:30',
        wakeTime: '06:00',
        sleepDuration: 6.5,
        sleepQuality: 8,
        sleepEfficiency: 85
      };

      const res = await request(app)
        .post('/api/sleep')
        .set('Authorization', `Bearer ${token}`)
        .send(sleepData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.sleepData.username).toBe(sleepData.username);
      sleepDataId = res.body.data.sleepData.id;
    });

    it('should get sleep data', async () => {
      const res = await request(app)
        .get('/api/sleep')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.sleepData).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should get sleep statistics', async () => {
      const res = await request(app)
        .get('/api/sleep/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toBeDefined();
    });
  });
}); 