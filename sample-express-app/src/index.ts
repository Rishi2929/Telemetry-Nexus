import express from "express";
import { monitor } from "@telemetry-nexus/sdk";
const app = express();

app.use(
  monitor({
    apiKey: "tn_live_mojZTP16RH_51dbb743103b684a044e8e1d3b9d6e007117e2c9e96bfd825bd145539aa14f2d",
    endpoint: "http://localhost:3000/api/v1/logs",
  })
);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(3001);
