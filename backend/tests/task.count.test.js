import express from 'express';
import request from 'supertest';
import { getTasksCount } from '../controllers/taskController.js';

const app = express();
app.use(express.json());

// Mock protect middleware
const protect = (req, res, next) => {
  req.user = { _id: '507f1f77bcf86cd799439011' };
  next();
};

app.get('/api/tasks/count', protect, getTasksCount);

describe('GET /api/tasks/count', () => {
  it('should return a count (mock DB)', async () => {
    process.env.USE_MOCK_DB = 'true';
    const res = await request(app).get('/api/tasks/count');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('count');
    // count is a number
    expect(typeof res.body.count).toBe('number');
  });

  it('should support status filter (mock DB)', async () => {
    process.env.USE_MOCK_DB = 'true';
    const res = await request(app).get('/api/tasks/count?status=pending');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('count');
  });

  afterAll(() => {
    delete process.env.USE_MOCK_DB;
  });
}); 