import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './Inngest/index.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Test route
app.get('/', (req, res) => {
  res.send('Server is live');
});

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});