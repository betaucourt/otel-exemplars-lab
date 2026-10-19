# Contributing to otel-exemplars-lab

Thank you for contributing to `otel-exemplars-lab`! This project provides a production-grade reference architecture for OpenTelemetry Exemplars, Prometheus metrics, and wire-level OTLP/gRPC protocol decoding.

---

## Architecture Overview

The lab contains four integrated services:

1. **`producer-go-sql`**: Go 1.24+ service generating SQLite queries with OpenTelemetry trace and exemplar correlations.
2. **`producer-node-fastify`**: Fastify service instrumented with OpenTelemetry metrics and distributed trace headers.
3. **`collector`**: OpenTelemetry Collector configuration pipeline routing metrics and traces to Prometheus.
4. **`inspector-otlp-grpc`**: Wire-level Protobuf decoder and gRPC MetricsService receiver in TypeScript for inspecting raw Prometheus Exemplars.

---

## Local Development

### Prerequisites

- **Node.js**: `v20.x` or `v22.x`
- **Go**: `v1.24` or later
- **Docker & Docker Compose**: For end-to-end integration testing

### Running Services Locally

```bash
# Build inspector-otlp-grpc
cd inspector-otlp-grpc
npm ci
npm run build

# Start the full observability stack with Docker Compose
cd ..
docker compose up -d
```

---

## Testing & Verification

Before submitting a Pull Request:

1. **Inspector Service**:
   ```bash
   cd inspector-otlp-grpc
   npm run build
   ```
2. **Go Producer**:
   ```bash
   cd producer-go-sql
   go test ./...
   go build -v .
   ```
3. **Fastify Producer**:
   ```bash
   cd producer-node-fastify
   node --check src/server.js
   ```

---

## Commit Conventions

We adhere to [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope)`: New capability or exporter
- `fix(scope)`: Bug fix in protocol handling or telemetry emission
- `docs(scope)`: Documentation improvements
- `ci(scope)`: CI/CD configuration updates
- `refactor(scope)`: Internal structural improvements

---

## Pull Requests

1. Branch from `main`: `git checkout -b feat/my-enhancement`.
2. Ensure all service builds pass cleanly.
3. Submit a PR describing the telemetry scenario or bug fix.
