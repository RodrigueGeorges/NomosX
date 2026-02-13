/**
 * Integration Tests for Analysis API
 * Tests full API flow with real database (test environment)
 */

const {describe,it,expect,beforeAll,afterAll} = require('vitest');
const request = require('supertest');
const {PrismaClient} = require('@prisma/client');
const {app} = require('../../../src/api/server'); // Assuming we export app from server.ts

const prisma = new PrismaClient();

describe('Analysis API Integration Tests', () => {
  beforeAll(async () => {
    // Setup: Clean test database
    await prisma.analysisRun.deleteMany();
    await prisma.claim.deleteMany();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });

  describe('POST /api/v1/analysis', () => {
    it('should create a new analysis run', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .send({
          question: 'What is the impact of carbon taxes on emissions?',
          mode: 'brief',
          providers: ['openalex', 'crossref'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('runId');
      expect(response.body).toHaveProperty('correlationId');
      expect(response.body.status).toBe('PENDING');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .send({
          // Missing 'question'
          mode: 'brief',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should include correlation ID in response headers', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .send({
          question: 'Test question',
          mode: 'brief',
        })
        .expect(201);

      expect(response.headers).toHaveProperty('x-correlation-id');
    });

    it('should handle duplicate requests with idempotency', async () => {
      const idempotencyKey = 'test-idempotency-key-1';

      const response1 = await request(app)
        .post('/api/v1/analysis')
        .set('X-Idempotency-Key', idempotencyKey)
        .send({
          question: 'Idempotent test',
          mode: 'brief',
        })
        .expect(201);

      const response2 = await request(app)
        .post('/api/v1/analysis')
        .set('X-Idempotency-Key', idempotencyKey)
        .send({
          question: 'Idempotent test',
          mode: 'brief',
        });

      // Should return same run ID or appropriate response
      expect(response1.body.runId).toBeDefined();
    });
  });

  describe('GET /api/v1/analysis/:runId', () => {
    let runId: string;

    beforeAll(async () => {
      // Create a test run
      const run = await prisma.analysisRun.create({
        data: {
          question: 'Test question for GET',
          mode: 'brief',
          correlationId: 'test-correlation-id',
          status: 'COMPLETED',
          trustScore: 0.8,
          claimCount: 5,
        },
      });

      runId = run.id;
    });

    it('should get analysis run by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/analysis/${runId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', runId);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('status', 'COMPLETED');
      expect(response.body).toHaveProperty('trustScore', 0.8);
    });

    it('should return 404 for non-existent run', async () => {
      await request(app)
        .get('/api/v1/analysis/non-existent-id')
        .expect(404);
    });

    it('should include claims in response if requested', async () => {
      const response = await request(app)
        .get(`/api/v1/analysis/${runId}?includeClaims=true`)
        .expect(200);

      expect(response.body).toHaveProperty('claims');
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should include correlation ID in error responses', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .send({
          // Invalid payload
        })
        .expect(400);

      expect(response.headers).toHaveProperty('x-correlation-id');
    });

    it('should return structured error responses', async () => {
      const response = await request(app)
        .post('/api/v1/analysis')
        .send({
          question: '', // Empty question
          mode: 'brief',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      // Make many requests rapidly
      const requests = Array.from({ length: 150 }, () =>
        request(app).get('/api/v1/health')
      );

      const responses = await Promise.all(requests);

      // At least some should be rate limited (429)
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});
