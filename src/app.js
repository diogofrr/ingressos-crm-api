import express from 'express';
import routes from './routes.js';
import cors from 'cors'

const app = express();

app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(routes);

export default app;