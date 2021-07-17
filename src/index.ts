import app from './server/server';
import * as dotenv from 'dotenv';
import { connectToDatabase } from './database/connect';

connectToDatabase();
dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started on port:${port}`);
});
