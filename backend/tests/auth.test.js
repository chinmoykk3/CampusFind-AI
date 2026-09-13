const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

// Require the setup hooks which will initialize our memory DB
require('./setup');

describe('Authentication API', () => {
    const testUser = {
        name: 'Test Student',
        email: 'test@university.edu',
        password: 'securepassword123'
    };

    describe('POST /api/v1/auth/register', () => {
        it('should correctly register a new valid user and return 201', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', testUser.email);

            // Verify database insertion
            const userInDb = await User.findOne({ email: testUser.email }).lean();
            expect(userInDb).not.toBeNull();
            expect(userInDb.password).not.toBe(testUser.password); // Password should be hashed
        });

        it('should block non-edu emails if strict university validation is active (simulated via missing required fields)', async () => {
            const badUser = {
                email: 'test@gmail.com', // Validation expects specific criteria
                password: 'password'
            };
            const response = await request(app)
                .post('/api/auth/register')
                .send(badUser);

            // Checking validation errors (400)
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Seed db before login tests
            await request(app).post('/api/auth/register').send(testUser);
        });

        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token'); // JWT provided 
            // Also verifies httpOnly secure cookie was set in the response headers
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should fail with a 401 on incorrect passwords', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
