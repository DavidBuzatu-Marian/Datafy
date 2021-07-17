import request from 'supertest';
import app from '../../../server/server';
import { connectToDatabase, destroyDatabase } from '../../../database/connect';

beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  destroyDatabase();
});

describe('create person', () => {
  it('should create a new person given valid input', async () => {
    const response = await request(app).post('/api/person').send({
      name: 'Dave',
      email: 'davidm.buz@gmail.com',
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '2021-07-12T22:26:12.111Z',
    });
    expect(response.statusCode).toEqual(200);
  });
});

describe('fail to create person without name', () => {
  it('should not create a new person without name', async () => {
    const response = await request(app).post('/api/person').send({
      email: 'davidm.buz@gmail.com',
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '2021-07-12T22:26:12.111Z',
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('fail to create person without valid email', () => {
  it('should not create a new person without a valid email', async () => {
    const response = await request(app).post('/api/person').send({
      name: 'Dave',
      email: 'davidm.buz',
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '2021-07-12T22:26:12.111Z',
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('fail to create person without email', () => {
  it('should not create a new person without an email', async () => {
    const response = await request(app).post('/api/person').send({
      name: 'Dave',
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '2021-07-12T22:26:12.111Z',
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('fail to create person without name and email', () => {
  it('should not create a new person without a name and email', async () => {
    const response = await request(app).post('/api/person').send({
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '2021-07-12T22:26:12.111Z',
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('fail to create person without valid birthday', () => {
  it('should not create a new person without a valid birthday', async () => {
    const response = await request(app).post('/api/person').send({
      name: 'Dave',
      email: 'davidm.buz@gmail.com',
      phoneNumber: '0726654132',
      country: 'Romania',
      birthday: '24.24.2020',
    });
    expect(response.statusCode).toEqual(500);
  });
});

describe('create person and get information', () => {
  it('should create a person and getting it by id should return its info', async () => {
    const responseCreatePerson = await request(app).post('/api/person').send({
      name: 'test',
      email: 'test@test.com',
      phoneNumber: '5453',
      country: 'Test',
      birthday: '10/10/2021',
    });
    expect(responseCreatePerson.statusCode).toEqual(200);
    const responseGetPerson = await request(app).get(
      `/api/person/${responseCreatePerson.body._id}`
    );
    expect(responseGetPerson.statusCode).toEqual(200);
    expect(responseGetPerson.body).toEqual(responseCreatePerson.body);
  });
});

describe('get person which does not exist', () => {
  it('should get a 400 response because id is not found in database', async () => {
    const responseGetPerson = await request(app).get(
      `/api/person/60f2ed5de08694482c3232e4`
    );
    expect(responseGetPerson.statusCode).toEqual(400);
  });
});

describe('get person with invalid id type', () => {
  it('should get a 500 response because id is not a valid format', async () => {
    const responseGetPerson = await request(app).get(
      `/api/person/invalididform`
    );
    expect(responseGetPerson.statusCode).toEqual(500);
  });
});
