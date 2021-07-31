import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import {
  createEvent,
  saveEvent,
  findEventById,
  findEvents,
  deleteEvent,
  updateEvent,
} from '../handlers/event';
import { Request, Response } from 'express';
import { check, body } from 'express-validator';
const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('start_date', 'Date is mandatory').not().isEmpty(),
    check('end_date', 'Date is mandatory').not().isEmpty(),
    check('location', 'Location is mandatory').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed');
      }
      const event = createEvent(req);
      await saveEvent(event);
      return res.status(200).json(event);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await findEventById(req.params.id);
    if (event == null) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).json(event);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await findEvents();
    if (events == null) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).json(events);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const event = await deleteEvent(req.params.id);
    if (event.deletedCount == 0) {
      return res.status(400).send('Bad Request');
    }
    res.status(200).send(`Deleted event with id: ${req.params.id}`);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.put(
  '/:id',
  [
    body('name').custom((name: string) => {
      if (name == '') {
        return false;
      }
      return true;
    }),
    body('location').custom((location: string) => {
      if (location == '') {
        return false;
      }
      return true;
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed');
      }
      const person = await updateEvent(req);

      res.status(200).json(person);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

module.exports = router;
