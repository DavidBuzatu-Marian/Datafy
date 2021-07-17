import { Response } from 'express';
import { NativeError } from 'mongoose';
export const handleErrors = (res: Response, err: NativeError) => {
  console.log(err);
  res.status(500).json({ msg: `Server error` });
};
