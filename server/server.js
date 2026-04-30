import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ FIXED ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).send("Server is live 🚀");
});

// ✅ INNGEST ROUTE
app.use("/api/inngest", serve({ client: inngest, functions }));

// ❌ REMOVE app.listen()

// ✅ EXPORT FOR VERCEL
export default app;