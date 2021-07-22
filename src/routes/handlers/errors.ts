import { Request, Response } from 'express';
import { NativeError } from 'mongoose';
import { validationResult } from 'express-validator';
export const handleErrors = (res: Response, err: NativeError) => {
  console.log(err);
  res.status(500).json({ msg: `Server error` });
};

export const checkNotSucceeded = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
};
