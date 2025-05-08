import express from 'express';
import request from 'supertest';
import { validateCreateTask, validateUpdateTask } from '../middleware/validation.js';

const app = express();
app.use(express.json());
app.post('/tasks', validateCreateTask, (req, res) => res.status(200).json({ success: true }));
app.put('/tasks/:id', validateUpdateTask, (req, res) => res.status(200).json({ success: true }));

describe('Task Validation Middleware', () => {
  describe('Create Task', () => {
    it('should succeed with valid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          priority: 'high',
          complexity: 'moderate',
          status: 'pending',
          dueDate: '2099-12-31',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with invalid complexity', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          complexity: 'difficult',
        });
      console.log('TEST RESPONSE BODY:', res.body);
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('complexity'))).toBe(true);
    });

    it('should fail with missing title', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ priority: 'high' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('title'))).toBe(true);
    });

    it('should fail with invalid priority', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          priority: 'urgent',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('priority'))).toBe(true);
    });

    it('should fail with invalid status', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          status: 'archived',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('status'))).toBe(true);
    });

    it('should fail with invalid dueDate', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          dueDate: 'not-a-date',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('dueDate'))).toBe(true);
    });

    it('should fail with invalid assignedTo', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          assignedTo: 'notanid',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('assignedTo'))).toBe(true);
    });

    it('should fail with invalid project', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          project: 'notanid',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('project'))).toBe(true);
    });

    it('should fail with invalid tags', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          tags: 'not-an-array',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('tags'))).toBe(true);
    });

    it('should fail with invalid tag element', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          tags: [123, 456],
        });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('tags['))).toBe(true);
    });
  });

  describe('Update Task', () => {
    it('should succeed with valid data', async () => {
      const res = await request(app)
        .put('/tasks/507f1f77bcf86cd799439011')
        .send({
          title: 'Updated Task',
          complexity: 'complex',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with invalid complexity', async () => {
      const res = await request(app)
        .put('/tasks/507f1f77bcf86cd799439011')
        .send({ complexity: 'hard' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field && e.field.startsWith('complexity'))).toBe(true);
    });
  });
}); 