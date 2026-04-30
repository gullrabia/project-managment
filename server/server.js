import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ Fixed: correct param order (req, res), single braces
app.get("/", (req, res) => {
  res.send("server is live");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ KEY FIX: On Vercel, do NOT call app.listen()
// Only listen locally when running with `node server.js`
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}

// ✅ Export the app for Vercel to use as a serverless handler
export default app;