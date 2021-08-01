import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import {
  findPersonById,
  savePerson,
  createPerson,
  findPersons,
  deletePerson,
  updatePerson,
  findBirthdaysForDate,
} from '../handlers/person';
import { Request, Response } from 'express';
import { body, check } from 'express-validator';
import { time } from 'console';
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

router.get('/info/birthdays', async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const month = req.body.month ? req.body.month : currentDate.getMonth() + 1;
    const dayOfMonth = req.body.dayOfMonth
      ? req.body.dayOfMonth
      : currentDate.getDate();
    const birthdays = await findBirthdaysForDate(month, dayOfMonth);
    res.status(200).json(birthdays);
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

router.put(
  '/:id',
  [
    body('name').custom((name) => {
      if (name == '') {
        return false;
      }
      return true;
    }),
    body('email').custom((email) => {
      if (email) {
        return RFC2822EmailCheck(email);
      }
      return true;
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed');
      }
      const person = await updatePerson(req);

      res.status(200).json(person);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

const RFC2822EmailCheck = (email: string) => {
  const regex: RegExp = new RegExp(
    "^([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$"
  );
  return regex.test(email);
};

module.exports = router;
