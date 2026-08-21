# TelemetryNexus

**API observability platform with a custom instrumentation SDK, persistent incident tracking, and a dual-trigger buffered ingestion pipeline.**

> Built as a research-backed engineering project. The core buffering architecture is published in two IEEE peer-reviewed papers.

**[Live Demo](#)**  
**[Paper 1 — API Performance Monitoring Middleware](https://ieeexplore.ieee.org/document/11620214)**  
**[Paper 2 — Deterministic lightweight observability](https://ieeexplore.ieee.org/document/11620228)**

---

## What it does

TelemetryNexus lets you instrument any Express.js application with a single middleware call. It captures real API telemetry — latency, status codes, error rates, request metadata — and surfaces it through a structured dashboard with analytics, configurable alert rules, and automatic incident creation.

```ts
// Instrument your Express app in one line
app.use(
  telemetryMiddleware({
    apiKey: process.env.TELEMETRY_API_KEY,
    endpoint: "https://your-telemetry-nexus.vercel.app/api/v1/logs",
  }),
);
```

From that point, every request is captured, stored, and visible in TelemetryNexus.

---

## Architecture

```
Client Application
        │
        │  Custom Telemetry SDK
        ▼
┌───────────────────┐
│  Ingestion API    │  ← API key validation, Zod payload validation
│  POST /api/v1/logs│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│    PostgreSQL     │  ← ApiLog, Project, AlertRule, Incident,
│                   │    IncidentOccurrence
└────────┬──────────┘
         │
    ┌────┴─────┐
    ▼          ▼
Analytics   AlertRule
Engine      Evaluation
    │          │
    ▼          ▼
Dashboard  Incident
           Engine
              │
              ▼
        Incident Detail
        Affected Routes
        Occurrence Timeline
```

**Planned next:** Redis Stream buffer between ingestion and PostgreSQL, replacing synchronous per-request writes with a dual-trigger flush worker (500-record capacity trigger or 2-second time trigger). This is the architecture validated in the published papers.

---

## Why the ingestion pipeline is designed this way

Writing telemetry directly to PostgreSQL on every request blocks the Node.js event loop under high concurrency — throughput collapses to ~493 req/s under synchronous persistence at 500 concurrent connections (benchmarked).

The solution is a dual-trigger in-memory buffer:

```
Incoming request
      │
      ▼
In-memory buffer
      │
      ├── Capacity trigger (500 records) ──→ Batch flush to PostgreSQL
      └── Time trigger (2 seconds)       ──→ Batch flush to PostgreSQL
```

This keeps instrumentation overhead at O(1) per request regardless of database write latency. Empirical results at 500 concurrent connections:

| Configuration      | Throughput (req/s) | Mean Latency (ms) |
| ------------------ | ------------------ | ----------------- |
| No instrumentation | 12,791             | 56.48             |
| **TelemetryNexus** | **12,487**         | **59.70**         |
| Morgan logging     | 8,241              | 79.94             |
| OpenTelemetry      | 7,047              | 90.58             |
| Synchronous writes | 493                | 488.03            |

Full methodology and results: [IEEE Paper 1](https://ieeexplore.ieee.org/document/11620214) · [IEEE Paper 2](https://ieeexplore.ieee.org/document/11620228)

---

## Features

### Telemetry SDK

- Express.js middleware — one line to instrument
- Captures method, endpoint, status code, latency, log level, IP, user agent, metadata
- Automatic log level classification: `2xx/3xx → INFO`, `4xx → WARN`, `5xx → ERROR`
- Non-blocking telemetry dispatch — does not affect request processing

### Logs

- Real-time log table with per-request detail
- Filter by log level, HTTP method, status code
- Summary stats: total requests, errors, average latency

### Analytics

- Total requests, errors, error rate, average latency
- Request and error trend charts
- Status code distribution
- HTTP method distribution
- Endpoint performance table with per-route latency and error breakdown
- Latency percentiles (p50, p95, p99)

### Alert Rules

- Configurable per-project rules
- Supported metrics: `ERROR_RATE`, `LATENCY`
- Custom thresholds, severity levels, enable/disable state
- Multiple rules per project

### Incident Engine

- Automatic incident creation when alert rules fire
- Open/resolved state with resolve and reopen actions
- Occurrence tracking — each violating request linked to its API log
- Affected-route analysis with per-route occurrence counts
- Incident deduplication — open incidents are not duplicated

```
Incident: High error rate
Occurrences: 93

Affected Routes:
/server-error           42
/service-unavailable    51
```

### Incident Data Model

```
Incident
   └── IncidentOccurrence[]
              └── ApiLog
```

Individual occurrences remain connected to the underlying telemetry record.

### Global Dashboard

- Aggregate metrics across all projects owned by the authenticated user
- Total requests, total errors, error rate, average latency

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Framework      | Next.js 14 (App Router)      |
| Language       | TypeScript                   |
| Styling        | Tailwind CSS + shadcn/ui     |
| Database       | PostgreSQL                   |
| ORM            | Prisma                       |
| Auth           | Better Auth                  |
| SDK target     | Express.js                   |
| Planned buffer | Redis Streams + flush worker |

---

## Database Schema

```
User
 └── Project
      ├── ApiKey
      ├── ApiLog
      ├── AlertRule
      └── Incident
             └── IncidentOccurrence
                    └── ApiLog
```

Every project-scoped resource enforces ownership through the authenticated session. No cross-user data access is possible.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Clone and install

```bash
git clone https://github.com/Rishi2929/Telemetry-Nexus.git
cd telemetry-nexus
npm install
```

### Configure environment

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/telemetry_nexus"
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### Start the application

```bash
npm run dev
```

Application runs at `http://localhost:3000`.

---

## Generating Test Traffic

TelemetryNexus ships with a sample Express application and a traffic generator.

The sample app exposes routes that produce varied telemetry:

| Route                      | Behaviour            |
| -------------------------- | -------------------- |
| `GET /`                    | 200, fast            |
| `GET /fast`                | 200, minimal latency |
| `GET /slow`                | 200, ~500ms latency  |
| `GET /very-slow`           | 200, ~1500ms latency |
| `GET /not-found`           | 404                  |
| `GET /unauthorized`        | 401                  |
| `GET /forbidden`           | 403                  |
| `GET /bad-request`         | 400                  |
| `GET /server-error`        | 500                  |
| `GET /service-unavailable` | 503                  |

Start the sample app and run the traffic generator to populate your dashboard with realistic logs, analytics, and incidents.

---

## Incident Lifecycle

```
         ┌─────────┐
         │  Open   │◄──── New alert condition detected
         └────┬────┘
              │
           Resolve
              │
              ▼
       ┌──────────────┐
       │   Resolved   │
       └──────┬───────┘
              │
            Reopen
              │
              ▼
         ┌─────────┐
         │  Open   │
         └─────────┘
```

Resolved incidents are not reused. A new alert condition after resolution creates a new incident record.

---

## Research

The buffering and instrumentation architecture implemented in TelemetryNexus is documented in two peer-reviewed IEEE publications:

**Paper 1 — Applied system:**

> R. K. Singh, P. Kumar, and P. K. Rai, "A Full-Stack API Performance Monitoring Middleware: Design and Implementation Using the MERN Stack," _2026 IEEE Global Symposium on Emerging and Communication Technologies (GSEACT)_, Hyderabad, India, 2026.
> DOI: [10.1109/GSEACT68539.2026.11620214](https://ieeexplore.ieee.org/document/11620214)

**Paper 2 — Formal model:**

> R. K. Singh, P. Kumar, and P. K. Rai, "Deterministic Lightweight Observability for Edge and Cloud-Native Applications," _2026 IEEE Global Symposium on Emerging and Communication Technologies (GSEACT)_, Hyderabad, India, 2026.
> DOI: [10.1109/GSEACT68539.2026.11620228](https://ieeexplore.ieee.org/document/11620228)

Paper 1 presents the applied middleware system with empirical benchmark evaluation.
Paper 2 formalises the architecture with a runtime decomposition model, proving O(1) instrumentation overhead and bounded memory growth under the dual-trigger buffering strategy.

---

## Roadmap

- [x] Custom telemetry SDK
- [x] Ingestion API with API key validation
- [x] PostgreSQL schema with Prisma
- [x] Logs dashboard with filtering
- [x] Analytics engine
- [x] Global dashboard
- [x] Alert rules (ERROR_RATE, LATENCY)
- [x] Incident engine with occurrence tracking
- [x] Affected-route analysis
- [ ] Redis Stream ingestion buffer
- [ ] Dual-trigger flush worker
- [ ] Real-time SSE dashboard
- [ ] Benchmark validation suite
- [ ] Docker + production deployment

---

## Development Principles

**Server-first rendering** — authenticated pages are server-rendered. Client components are isolated to interactive controls only.

**Layered separation of concerns:**

```
UI Components
      ↓
Server Actions
      ↓
Service Layer
      ↓
Database Layer (Prisma)
      ↓
PostgreSQL
```

**Persistent incidents** — incidents are stored as records, not reconstructed from raw logs on every request.

**Project-scoped security** — every operation against projects, API keys, alert rules, and incidents validates ownership against the authenticated session before executing.
