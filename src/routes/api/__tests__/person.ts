import request from 'supertest';
import app from '../../../server/server';
import {
  connectToDatabase,
  disconnectFromDatabase,
} from '../../../database/connect';

beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  disconnectFromDatabase();
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
