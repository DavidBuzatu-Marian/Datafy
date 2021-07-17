import express from 'express';
import { connectToDatabase } from './database/connect';
import * as dotenv from 'dotenv';

dotenv.config();
connectToDatabase();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/person', require('./routes/api/person'));

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started on port:${port}`);
});
