import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import { createEvent, saveEvent, findEventById } from '../handlers/event';
import { Request, Response } from 'express';
import { check } from 'express-validator';
const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('date', 'Date is mandatory').not().isEmpty(),
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
module.exports = router;
