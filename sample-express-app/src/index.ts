import express, { Request, Response, NextFunction } from "express";
import { monitor } from "@telemetry-nexus/sdk";

const app = express();
const PORT = 3001;

app.use(express.json());

// Telemetry Middleware
app.use(
  monitor({
    apiKey: "tn_live_ZgwHUz76El_811d1aceb259788df5ce07aa91155c34061e77dcbf8704c1776232e60b17e99b",
    endpoint: "http://localhost:3000/api/v1/logs",
  }),
);

// --- Standard Success Routes ---
app.get("/", (_req: Request, res: Response) => {
  res.json({ service: "TelemetryNexus-Test-API", status: "operational", v: "1.2.0" });
});

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

// --- Dynamic CRUD & Resource Routes ---
app.get("/api/v1/users", (_req: Request, res: Response) => {
  res.json({
    data: [
      { id: "usr_101", name: "Alice Vance", role: "admin" },
      { id: "usr_102", name: "Bob Smith", role: "developer" },
    ],
    page: 1,
    total: 2,
  });
});

app.get("/api/v1/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === "999" || id === "unknown") {
    return res.status(404).json({ error: "UserNotFound", message: `User ${id} does not exist` });
  }
  res.json({ id, name: "Alice Vance", role: "admin", createdAt: new Date().toISOString() });
});

app.post("/api/v1/users", (req: Request, res: Response) => {
  const { email, name } = req.body || {};
  if (!email || !name) {
    return res.status(422).json({
      error: "UnprocessableEntity",
      details: [{ field: "email", issue: "Required field missing" }],
    });
  }
  res.status(201).json({ id: `usr_${Math.floor(Math.random() * 1000)}`, email, name });
});

app.put("/api/v1/projects/:id", (req: Request, res: Response) => {
  res.json({ id: req.params.id, updated: true, timestamp: Date.now() });
});

app.patch("/api/v1/settings", (_req: Request, res: Response) => {
  res.json({ updatedFields: ["theme", "notifications"], status: "applied" });
});

app.delete("/api/v1/session", (_req: Request, res: Response) => {
  res.status(204).send();
});

// --- Latency Profiles ---
app.get("/api/v1/analytics/fast", (_req: Request, res: Response) => {
  res.json({ latency: "< 50ms", metrics: { activeUsers: 42 } });
});

app.get("/api/v1/analytics/slow", async (_req: Request, res: Response) => {
  const delay = Math.floor(Math.random() * 400) + 300; // 300ms - 700ms
  await new Promise((r) => setTimeout(r, delay));
  res.json({ latency: `${delay}ms`, metrics: { queryTime: delay } });
});

app.get("/api/v1/reports/heavy-export", async (_req: Request, res: Response) => {
  const delay = Math.floor(Math.random() * 1500) + 1500; // 1.5s - 3.0s
  await new Promise((r) => setTimeout(r, delay));
  res.json({ latency: `${delay}ms`, reportUrl: "https://storage.telemetrynexus.io/exports/r_882.pdf" });
});

// --- Errors (4xx Client Exceptions) ---
app.get("/api/v1/auth/login", (_req: Request, res: Response) => {
  res.status(401).json({ error: "Unauthorized", code: "TOKEN_EXPIRED" });
});

app.get("/api/v1/admin/vault", (_req: Request, res: Response) => {
  res.status(403).json({ error: "Forbidden", code: "INSUFFICIENT_PERMISSIONS" });
});

app.get("/api/v1/payments/checkout", (_req: Request, res: Response) => {
  res.status(402).json({ error: "PaymentRequired", message: "Subscription lapsed" });
});

app.get("/api/v1/rate-limit-test", (_req: Request, res: Response) => {
  res.status(429).json({ error: "TooManyRequests", retryAfter: 60 });
});

// --- Errors (5xx System Failures) ---
app.get("/api/v1/db/query-failure", (_req: Request, res: Response) => {
  res.status(500).json({ error: "InternalServerError", details: "Database deadlock detected" });
});

app.get("/api/v1/upstream/timeout", (_req: Request, res: Response) => {
  res.status(504).json({ error: "GatewayTimeout", upstreamService: "auth-provider-v2" });
});

app.get("/api/v1/services/payment-gateway", (_req: Request, res: Response) => {
  res.status(503).json({ error: "ServiceUnavailable", reason: "Scheduled Maintenance" });
});

app.listen(PORT, () => {
  console.log(`Telemetry test server running at http://localhost:${PORT}`);
});
