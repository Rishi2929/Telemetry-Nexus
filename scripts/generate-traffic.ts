const BASE_URL = "http://localhost:3001";

const TOTAL_REQUESTS = 5_00;
const CONCURRENCY = 10;

const ENDPOINTS = [
  // Normal traffic
  { path: "/", method: "GET", weight: 20 },
  { path: "/api/v1/health", method: "GET", weight: 15 },
  { path: "/api/v1/users", method: "GET", weight: 10 },
  { path: "/api/v1/analytics/fast", method: "GET", weight: 10 },

  // Dynamic routes
  {
    path: () => `/api/v1/users/${Math.floor(Math.random() * 5) + 100}`,
    method: "GET",
    weight: 8,
  },

  {
    path: () => `/api/v1/users/${Math.random() > 0.5 ? "999" : "unknown"}`,
    method: "GET",
    weight: 5,
  },

  // POST / PUT / PATCH / DELETE
  {
    path: "/api/v1/users",
    method: "POST",
    weight: 8,
    body: () => ({
      name: `User_${Math.floor(Math.random() * 1000)}`,
      email: `user${Date.now()}@example.com`,
    }),
  },

  {
    path: "/api/v1/users",
    method: "POST",
    weight: 4,
    body: () => ({
      name: "Invalid Payload",
    }),
  },

  {
    path: () => `/api/v1/projects/prj_${Math.floor(Math.random() * 50)}`,
    method: "PUT",
    weight: 5,
    body: () => ({
      active: true,
    }),
  },

  {
    path: "/api/v1/settings",
    method: "PATCH",
    weight: 4,
    body: () => ({
      theme: "dark",
    }),
  },

  {
    path: "/api/v1/session",
    method: "DELETE",
    weight: 3,
  },

  // Latency
  {
    path: "/api/v1/analytics/slow",
    method: "GET",
    weight: 8,
  },

  {
    path: "/api/v1/reports/heavy-export",
    method: "GET",
    weight: 4,
  },

  // 4xx
  {
    path: "/api/v1/auth/login",
    method: "GET",
    weight: 5,
  },

  {
    path: "/api/v1/admin/vault",
    method: "GET",
    weight: 4,
  },

  {
    path: "/api/v1/payments/checkout",
    method: "GET",
    weight: 3,
  },

  {
    path: "/api/v1/rate-limit-test",
    method: "GET",
    weight: 3,
  },

  // 5xx
  {
    path: "/api/v1/db/query-failure",
    method: "GET",
    weight: 5,
  },

  {
    path: "/api/v1/upstream/timeout",
    method: "GET",
    weight: 3,
  },

  {
    path: "/api/v1/services/payment-gateway",
    method: "GET",
    weight: 3,
  },
];

type EndpointConfig = {
  path: string | (() => string);
  method: string;
  weight: number;
  body?: () => Record<string, unknown>;
};

function weightedSelect<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  let random = Math.random() * totalWeight;

  for (const item of items) {
    if (random < item.weight) {
      return item;
    }

    random -= item.weight;
  }

  return items[items.length - 1];
}

const statusCounts = new Map<number, number>();

let completedRequests = 0;
let failedRequests = 0;
let totalLatency = 0;
let minLatency = Infinity;
let maxLatency = 0;

async function sendSingleRequest() {
  const config = weightedSelect(ENDPOINTS as EndpointConfig[]);

  const path = typeof config.path === "function" ? config.path() : config.path;

  const url = `${BASE_URL}${path}`;

  const options: RequestInit = {
    method: config.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (config.body) {
    options.body = JSON.stringify(config.body());
  }

  const start = performance.now();

  try {
    const response = await fetch(url, options);

    const latency = performance.now() - start;

    completedRequests++;
    totalLatency += latency;
    minLatency = Math.min(minLatency, latency);
    maxLatency = Math.max(maxLatency, latency);

    statusCounts.set(response.status, (statusCounts.get(response.status) ?? 0) + 1);
  } catch (error) {
    failedRequests++;

    console.error(`[REQUEST ERROR] ${config.method} ${path}`, error instanceof Error ? error.message : error);
  }
}

async function runSimulation() {
  console.log("========================================");
  console.log("TelemetryNexus Redis Pipeline Test");
  console.log("========================================");
  console.log(`Target requests : ${TOTAL_REQUESTS}`);
  console.log(`Concurrency     : ${CONCURRENCY}`);
  console.log(`Target API      : ${BASE_URL}`);
  console.log("----------------------------------------");
  console.log("Starting traffic...\n");

  const start = performance.now();

  while (completedRequests + failedRequests < TOTAL_REQUESTS) {
    const remaining = TOTAL_REQUESTS - completedRequests - failedRequests;

    const currentConcurrency = Math.min(CONCURRENCY, remaining);

    const requests = Array.from({ length: currentConcurrency }, () => sendSingleRequest());

    await Promise.all(requests);

    const processed = completedRequests + failedRequests;

    console.log(`Progress: ${processed}/${TOTAL_REQUESTS}`);
  }

  const totalDuration = performance.now() - start;

  console.log("\n========================================");
  console.log("Traffic Test Complete");
  console.log("========================================");

  console.log(`Total requests : ${TOTAL_REQUESTS}`);

  console.log(`Successful     : ${completedRequests}`);

  console.log(`Failed         : ${failedRequests}`);

  console.log(`Duration       : ${(totalDuration / 1000).toFixed(2)}s`);

  console.log(`Request rate   : ${(TOTAL_REQUESTS / (totalDuration / 1000)).toFixed(2)} req/s`);

  if (completedRequests > 0) {
    console.log(`Avg latency    : ${(totalLatency / completedRequests).toFixed(2)}ms`);

    console.log(`Min latency    : ${minLatency.toFixed(2)}ms`);

    console.log(`Max latency    : ${maxLatency.toFixed(2)}ms`);
  }

  console.log("\nStatus codes:");

  for (const [status, count] of [...statusCounts.entries()].sort(([a], [b]) => a - b)) {
    console.log(`  ${status}: ${count}`);
  }

  console.log("========================================");
}

runSimulation().catch((error) => {
  console.error("Traffic generator failed:", error);
  process.exit(1);
});
