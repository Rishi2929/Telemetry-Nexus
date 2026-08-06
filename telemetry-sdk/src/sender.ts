import axios from "axios";
import type { MonitorOptions, TelemetryPayload } from "./types";

export async function sendTelemetry(options: MonitorOptions, telemetry: TelemetryPayload) {
  await axios.post(options.endpoint, telemetry, {
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
    },
  });
  console.log("API Key:", options.apiKey);
}
