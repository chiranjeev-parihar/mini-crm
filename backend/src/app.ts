import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { routes } from './routes';

const app = express();

// Middleware
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

export default app;
