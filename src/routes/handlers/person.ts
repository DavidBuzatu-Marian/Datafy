import { Person } from '../../models/person';

export const findPersonById = (id: any) => {
  return Person.findById(id);
};
