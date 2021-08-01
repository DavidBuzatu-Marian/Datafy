import request from 'supertest';
import app from '../../../server/server';
import crypto from 'crypto';
import { connectToDatabase, destroyDatabase } from '../../../database/connect';
import { Person, PersonModel } from '../../../models/person';

beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  destroyDatabase();
});

describe('get all persons', () => {
  it('should get all persons added in this method', async () => {
    await addPersons(10);
    const responseGetPersons = await request(app).get(`/api/person`);
    expect(responseGetPersons.statusCode).toEqual(200);
    expect(responseGetPersons.body.length).toEqual(10);
  });
});

describe('create person', () => {
  it('should create a new person given valid input', async () => {
    const response = await addPerson();
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
    const responseCreatePerson = await addPerson();
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

describe('delete person after insertion', () => {
  it('should add a person and remove it successfully', async () => {
    const responseAddPerson = await addPerson();
    const responseDeletePerson = await request(app).delete(
      `/api/person/${responseAddPerson.body._id}`
    );
    expect(responseDeletePerson.statusCode).toEqual(200);
  });
});

describe('do not delete person without insertion', () => {
  it('should get a 400 response code while trying to delete an inexistent user', async () => {
    const responseDeletePerson = await request(app).delete(
      `/api/person/${crypto.randomBytes(12).toString('hex')}`
    );
    expect(responseDeletePerson.statusCode).toEqual(400);
  });
});

describe('add person and update name', () => {
  it('should add a person and update the name with a given value', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = { name: 'Dave' };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdatePerson.body, fields);
  });
});

describe('add person and update email', () => {
  it('should add a person and update the email with a given value', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = { email: 'Dave@gmail.com' };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdatePerson.body, fields);
  });
});

describe('add person and update name with empty value', () => {
  it('should add a person and fail updating the name with an empty value', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = { name: '' };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(400);
  });
});

describe('add person and update email with bad format', () => {
  it('should add a person and fail updating the email with a badly formatted email', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = { email: 'not_an_email' };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(400);
  });
});

describe('add person and update country and birthday', () => {
  it('should add a person and update the country and birthday', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = {
      country: crypto.randomBytes(20).toString('hex'),
      birthday: '2021-07-12T22:26:12.111Z',
    };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(200);
    checkUpdatedFields(responseUpdatePerson.body, fields);
  });
});

describe('add person and update birthday with invalid type', () => {
  it('should add a person and get 400 response on updating birthday with invalid type', async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const fields = {
      birthday: '20.20.2020',
    };
    const responseUpdatePerson = await updatePerson(
      responseAddPerson.body._id,
      fields
    );
    expect(responseUpdatePerson.statusCode).toEqual(500);
  });
});

describe('add person with today birthday and get it', () => {
  it("should add a person with birthday (day and month) of this day and it should find it based on today's date", async () => {
    const responseAddPerson = await addPerson();
    expect(responseAddPerson.statusCode).toEqual(200);
    const todayDate = new Date();
    const responseBirthdays = await request(app)
      .get('/api/person/info/birthdays')
      .send({
        month: todayDate.getMonth() + 1,
        dayOfMonth: todayDate.getDate() + 1,
      });
    expect(responseBirthdays.statusCode).toEqual(200);
    expect(responseBirthdays.body.length).toEqual(1);
  });
});

const checkUpdatedFields = (person: PersonModel, fields: {}) => {
  for (const [key, value] of Object.entries(fields)) {
    expect(person[key] as string).toEqual(value);
  }
};

const updatePerson = (id: any, fields: {}) => {
  return request(app).put(`/api/person/${id}`).send(fields);
};

const addPersons = async (numberOfPersons: number) => {
  for (let i = 0; i < numberOfPersons; ++i) {
    await addPerson();
  }
};

const addPerson = async (birthday = new Date()) => {
  return await request(app)
    .post('/api/person')
    .send({
      name: crypto.randomBytes(20).toString('hex'),
      email: `${crypto.randomBytes(10).toString('hex')}@gmail.com`,
      phoneNumber: crypto.randomBytes(10).toString('hex'),
      country: crypto.randomBytes(20).toString('hex'),
      birthday,
    });
};
