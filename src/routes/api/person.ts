import express from 'express';
import { handleErrors } from '../handlers/errors';
import { findPersonById } from '../handlers/person';
import { Request, Response } from 'express';
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

module.exports = router;
