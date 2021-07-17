import express from 'express';
import { connectToDatabase } from './database/connect';
const app = express();
const port = 8080;

connectToDatabase();

app.get('/', (_, res) => {
  res.send('Hello22');
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started on port:${port}`);
});
