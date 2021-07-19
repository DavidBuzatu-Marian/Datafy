import express from 'express';
import { handleErrors } from '../handlers/errors';
import {
  findPersonById,
  savePerson,
  createPerson,
  findPersons,
  deletePerson,
} from '../handlers/person';
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const person = await findPersonById(req.params.id);
    if (person == null) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).json(person);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const persons = await findPersons();
    if (persons == null) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).json(persons);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const person = await deletePerson(req.params.id);
    if (person.deletedCount == 0) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).send(`Deleted person with id: ${req.params.id}`);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.post(
  '/',
  [
    check('name', 'Name is mandatory').not().isEmpty().trim().escape(),
    check('email', 'Email is invalid').isEmail(),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed');
      }
      const person = createPerson(req);
      await savePerson(person);
      return res.status(200).json(person);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

const checkNotSucceeded = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
};

module.exports = router;
