import request from 'supertest';
import app from '../../../server/server';
import crypto from 'crypto';
import { connectToDatabase, destroyDatabase } from '../../../database/connect';

beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  destroyDatabase();
});

describe('get all events', () => {
  it('should get all events', async () => {
    await addEvents(10);
    const responseGetEvents = await request(app).get(`/api/event/`);
    expect(responseGetEvents.statusCode).toEqual(200);
    expect(responseGetEvents.body.length).toEqual(10);
  });
});

describe('post valid event', () => {
  it('should add an event to the database given valid name, date and location', async () => {
    const response = await addEvent();
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
    expect(response.statusCode).toEqual(400);
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
    expect(response.statusCode).toEqual(500);
  });
});

describe('get event by id', () => {
  it('should add an event and get it using its id', async () => {
    const response = await addEvent();
    expect(response.statusCode).toEqual(200);
    const responseGetEvent = await request(app).get(
      `/api/event/${response.body._id}`
    );
    expect(responseGetEvent.statusCode).toEqual(200);
    expect(responseGetEvent.body).toEqual(response.body);
  });
});

describe('get event by invalid id', () => {
  it('should fail getting an event with an invalid id', async () => {
    const responseGetEvent = await request(app).get(
      `/api/event/${crypto.randomBytes(12).toString('hex')}`
    );
    expect(responseGetEvent.statusCode).toEqual(400);
  });
});

const addEvents = async (numberOfEvents: number) => {
  for (let i = 0; i < numberOfEvents; ++i) {
    await addEvent();
  }
};

const addEvent = async () => {
  return await request(app)
    .post('/api/event')
    .send({
      name: crypto.randomBytes(20).toString('hex'),
      date: Date.now(),
      location: crypto.randomBytes(20).toString('hex'),
      details: crypto.randomBytes(100).toString('hex'),
      directions: crypto.randomBytes(20).toString('hex'),
    });
};

describe('delete event after insertion', () => {
  it('should add event and remove it successfully', async () => {
    const responseAddEvent = await addEvent();
    const responseDeleteEvent = await request(app).delete(
      `/api/event/${responseAddEvent.body._id}`
    );
    expect(responseDeleteEvent.statusCode).toEqual(200);
  });
});
describe('do not delete event without insertion', () => {
  it('should get a 400 response code while trying to delete an inexistent event', async () => {
    const responseDeletEevent = await request(app).delete(
      `/api/event/${crypto.randomBytes(12).toString('hex')}`
    );
    expect(responseDeletEevent.statusCode).toEqual(400);
  });
});
