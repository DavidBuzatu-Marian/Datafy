import { Person, PersonModel } from '../../models/person';
import { Request } from 'express';
import { Model } from 'mongoose';

export const findPersonById = (id: any) => {
  return Person.findById(id);
};

export const deletePerson = (id: any) => {
  return Person.deleteOne({ _id: id });
};

export const findPersons = () => {
  return Person.find({});
};

export const updatePerson = async (req: Request): Promise<PersonModel> => {
  return Person.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true }
  );
};

export const createPerson = (req: Request<{}, {}, PersonModel>) => {
  const { name, email, phoneNumber, country, birthday } = req.body;
  const person = new Person({ name, email, phoneNumber, country, birthday });
  return person;
};

export const savePerson = (person: PersonModel): Promise<PersonModel> => {
  return person.save();
};
