import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/person', require('../routes/api/person'));

export default app;
