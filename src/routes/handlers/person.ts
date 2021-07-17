import { Person, PersonModel } from '../../models/person';
import { Request } from 'express';

export const findPersonById = (id: any) => {
  return Person.findById(id);
};

export const createPerson = (req: Request<{}, {}, PersonModel>) => {
  const { name, email, phoneNumber, country, birthday } = req.body;
  const person = new Person({ name, email, phoneNumber, country, birthday });
  return person;
};

export const savePerson = (person: PersonModel) => {
  return person.save();
};
