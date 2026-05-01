import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Server is live");
});

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// IMPORTANT for Vercel
export default app;