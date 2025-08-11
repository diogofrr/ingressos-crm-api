import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import routes from "./routes.js";

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 300,
  validate: {
    xForwardedForHeader: false, // Desabilita a verificação do cabeçalho X-Forwarded-For
  },
});

app.set("trust proxy", "loopback, linklocal, uniquelocal");
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.options("*", cors({ origin: allowedOrigin }));
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(limiter);
app.use(routes);

export default app;
