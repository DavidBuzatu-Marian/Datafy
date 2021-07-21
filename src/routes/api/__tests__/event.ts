import request from 'supertest';
import app from '../../../server/server';
import crypto from 'crypto';
import { connectToDatabase, destroyDatabase } from '../../../database/connect';
import { Event, EventModel } from '../../../models/event';

beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  destroyDatabase();
});

describe('post valid event', () => {
  it('should add an event to the database given valid name, date and location', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        name: crypto.randomBytes(20).toString('hex'),
        date: Date.now(),
        location: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('post valid event with other fields', () => {
  it('should add an event to the database given valid name, date and location and other non-mandatory fields', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        name: crypto.randomBytes(20).toString('hex'),
        date: Date.now(),
        location: crypto.randomBytes(20).toString('hex'),
        details: crypto.randomBytes(100).toString('hex'),
        directions: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('post valid event without name', () => {
  it('should fail to add event without required name', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        date: Date.now(),
        location: crypto.randomBytes(20).toString('hex'),
        details: crypto.randomBytes(100).toString('hex'),
        directions: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('post valid event without date', () => {
  it('should fail to add event without required date', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        name: crypto.randomBytes(20).toString('hex'),
        location: crypto.randomBytes(20).toString('hex'),
        details: crypto.randomBytes(100).toString('hex'),
        directions: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('post valid event without location', () => {
  it('should fail to add event without required location', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        name: crypto.randomBytes(20).toString('hex'),
        date: Date.now(),
        details: crypto.randomBytes(100).toString('hex'),
        directions: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('post valid event with invalid date', () => {
  it('should fail to add event with invalid required date', async () => {
    const response = await request(app)
      .post('/api/event')
      .send({
        name: crypto.randomBytes(20).toString('hex'),
        date: '2020.20.20',
        location: crypto.randomBytes(20).toString('hex'),
        details: crypto.randomBytes(100).toString('hex'),
        directions: crypto.randomBytes(20).toString('hex'),
      });
    expect(response.statusCode).toEqual(400);
  });
});
