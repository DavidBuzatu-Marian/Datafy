import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/person', require('../routes/api/person'));
app.use('/api/event', require('../routes/api/event'));
app.use('/api/blog', require('../routes/api/blog'));

export default app;
