import { Hono } from "hono";
import { cors } from "hono/cors";
import { lpAnalysisRoutes } from "./routes/lp-analysis/lp-analysis.js";
import { ENV_OPENAI_API_KEY } from "./config.js";

export interface Env {
  /** OpenAI の API キー（.dev.vars / wrangler secret のキーと揃えること） */
  [ENV_OPENAI_API_KEY]: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/", lpAnalysisRoutes);

app.get("/", (c) => c.json({ name: "kachi-banner-pro-api", version: "0.0.1" }));

export default app;
