import express from "express";
import { monitor } from "@telemetry-nexus/sdk";
const app = express();

const PORT = 3001;

app.use(
  monitor({
    apiKey: "tn_live_6cBOuEpuLU_2d1de2ebe34b490ba1c2048c031e47b3e8713c5da1652ea23a1370951dec17d6",
    endpoint: "http://localhost:3000/api/v1/logs",
  }),
);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get("/not-found", (_req, res) => {
  res.status(404).json({
    error: "Resource not found",
  });
});

app.get("/unauthorized", (_req, res) => {
  res.status(401).json({
    error: "Unauthorized",
  });
});

app.get("/forbidden", (_req, res) => {
  res.status(403).json({
    error: "Forbidden",
  });
});

app.get("/bad-request", (_req, res) => {
  res.status(400).json({
    error: "Bad request",
  });
});

app.get("/server-error", (_req, res) => {
  res.status(500).json({
    error: "Internal server error",
  });
});

app.get("/service-unavailable", (_req, res) => {
  res.status(503).json({
    error: "Service unavailable",
  });
});

app.get("/fast", (_req, res) => {
  res.json({ ok: true });
});

app.get("/slow", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.json({ ok: true });
});

app.get("/very-slow", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
