import request from 'supertest';
import app from '../../../server/server';
import crypto from 'crypto';
import { connectToDatabase, destroyDatabase } from '../../../database/connect';
import { EventModel } from '../../../models/event';
import { assert } from 'console';

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
        start_date: Date.now(),
        end_date: Date.now(),
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
        start_date: Date.now(),
        end_date: Date.now(),
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
        start_date: Date.now(),
        end_date: Date.now(),
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
        start_date: '2020.20.20',
        end_date: '2020.20.20',
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

describe('delete event after insertion', () => {
  it('should add event and remove it successfully', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const responseDeleteEvent = await request(app).delete(
      `/api/event/${responseAddEvent.body._id}`
    );
    expect(responseDeleteEvent.statusCode).toEqual(200);
  });
});

describe('do not delete event without insertion', () => {
  it('should get a 400 response code while trying to delete an inexistent event', async () => {
    const responseDeleteEevent = await request(app).delete(
      `/api/event/${crypto.randomBytes(12).toString('hex')}`
    );
    expect(responseDeleteEevent.statusCode).toEqual(400);
  });
});

describe('add event and update name', () => {
  it('should add an event and update the name of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { name: 'Test name' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update start date', () => {
  it('should add an event and update the start date of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { start_date: new Date(Date.now()).toISOString() };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update end date', () => {
  it('should add an event and update the end date of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { end_date: new Date(Date.now()).toISOString() };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update location', () => {
  it('should add an event and update the location of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { location: 'Some test' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    expect(responseUpdateEvent.body).not.toBeNull();
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update name and location', () => {
  it('should add an event and update the name and location of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { location: 'Some test', name: 'test' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    expect(responseUpdateEvent.body).not.toBeNull();
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update name and start_date', () => {
  it('should add an event and update the name and start_date of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = {
      name: 'Some test',
      start_date: new Date(Date.now()).toISOString(),
    };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});
describe('add event and update name and end_date', () => {
  it('should add an event and update the name and end_date of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = {
      name: 'Some test',
      end_date: new Date(Date.now()).toISOString(),
    };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update start_date and location', () => {
  it('should add an event and update the start_date and location of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = {
      location: 'Some test',
      start_date: new Date(Date.now()).toISOString(),
    };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    expect(responseUpdateEvent.body).not.toBeNull();
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update end_date and location', () => {
  it('should add an event and update the end_date and location of it', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = {
      location: 'Some test',
      end_date: new Date(Date.now()).toISOString(),
    };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(200);
    expect(responseUpdateEvent.body).not.toBeNull();
    checkUpdatedFields(responseUpdateEvent.body, fields);
  });
});

describe('add event and update name with empty value', () => {
  it('should add an event and fail updating event with empty name', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { name: '' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(400);
  });
});

describe('add event and update location with empty value', () => {
  it('should add an event and fail updating event with empty location', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { location: '' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(400);
  });
});

describe('add event and update start_date with invalid value', () => {
  it('should add an event and fail updating event with invalid start_date', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { start_date: 'not a date' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(500);
  });
});

describe('add event and update end_date with invalid value', () => {
  it('should add an event and fail updating event with invalid end_date', async () => {
    const responseAddEvent = await addEvent();
    expect(responseAddEvent.statusCode).toEqual(200);
    const fields = { end_date: 'not a date' };
    const responseUpdateEvent = await updateEvent(
      responseAddEvent.body._id,
      fields
    );
    expect(responseUpdateEvent.statusCode).toEqual(500);
  });
});

const checkUpdatedFields = (event: EventModel, fields: {}) => {
  assert(event !== null);
  for (const [key, value] of Object.entries(fields)) {
    expect(event[key] as string).toEqual(value);
  }
};

const updateEvent = async (id: any, fields: {}) => {
  return await request(app).put(`/api/event/${id}`).send(fields);
};

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
      start_date: Date.now(),
      end_date: Date.now(),
      location: crypto.randomBytes(20).toString('hex'),
      details: crypto.randomBytes(100).toString('hex'),
      directions: crypto.randomBytes(20).toString('hex'),
    });
};
