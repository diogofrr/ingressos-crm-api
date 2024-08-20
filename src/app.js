import express from 'express';
import routes from './routes.js';
import cors from 'cors'
import rateLimit from 'express-rate-limit';

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  validate: {
    xForwardedForHeader: false, // Desabilita a verificação do cabeçalho X-Forwarded-For
  },
});

app.set('trust proxy', 'loopback, linklocal, uniquelocal');
app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(limiter)
app.use(routes);

export default app;