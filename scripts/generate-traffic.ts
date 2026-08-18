const BASE_URL = "http://localhost:3001";

const TOTAL_REQUESTS = 500;

const ENDPOINTS = [
  { path: "/", method: "GET", weight: 30 },

  // Successful requests
  { path: "/fast", method: "GET", weight: 20 },
  { path: "/slow", method: "GET", weight: 10 },
  { path: "/very-slow", method: "GET", weight: 15 },

  // 4xx errors
  { path: "/not-found", method: "GET", weight: 8 },
  { path: "/unauthorized", method: "GET", weight: 5 },
  { path: "/forbidden", method: "GET", weight: 4 },
  { path: "/bad-request", method: "GET", weight: 3 },

  // 5xx errors
  { path: "/server-error", method: "GET", weight: 10 },
  { path: "/service-unavailable", method: "GET", weight: 10 },
];

function weightedSelect<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  let random = Math.random() * totalWeight;

  for (const item of items) {
    if (random < item.weight) {
      return item;
    }

    random -= item.weight;
  }

  return items[0];
}

async function sendRequest() {
  const endpoint = weightedSelect(ENDPOINTS);

  const url = `${BASE_URL}${endpoint.path}`;

  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: { "Content-Type": "application/json" },
      body: endpoint.method === "POST" ? JSON.stringify({ name: "Test User", email: "test@example.com" }) : undefined,
    });

    console.log(`${endpoint.method} ${endpoint.path} → ${response.status}`);
  } catch (error) {
    console.error(`Request failed: ${endpoint.method} ${endpoint.path}`, error);
  }
}

async function main() {
  console.log(`Generating ${TOTAL_REQUESTS} requests...`);

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    await sendRequest();

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Traffic generation complete.");
}

main();
