# producer-node-fastify - Fastify OpenTelemetry Producer & Exemplar Sampler

[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-black.svg)](https://fastify.dev/)
[![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-SDK_%2B_Exemplars-indigo.svg)](https://opentelemetry.io/)

A reference Node.js HTTP service built with **Fastify** demonstrating production-grade OpenTelemetry instrumentation:
- **Custom Exemplar Sampler**: Attaching active `trace_id` and `span_id` directly to Prometheus metric histogram buckets.
- **Pino Structured Log Correlation**: Automatically injecting the active distributed trace ID into every log line via `mixin()`.
- **Wire-Level gRPC Export**: Pushing metrics and traces over OTLP/gRPC to port `4317` with robust plaintext/TLS negotiation.

---

## Key Technical Implementations

### 1. Custom Exemplar Sampler (`src/otel.js`)
Standard Node.js OpenTelemetry metric SDKs often lack straightforward documentation for exemplar sampling. This implementation provides a resilient `createTraceIdRatioExemplarSampler` that extracts the active `traceId` and `spanId` from `trace.getSpan(context.active())` and binds them to the `http_request_duration_seconds` histogram buckets.

### 2. Pino Log-to-Trace Correlation (`src/server.js`)
Rather than manually passing trace context to logger calls, Fastify's Pino instance uses a logger mixin:
```javascript
const logger = pino({
  mixin() {
    const activeSpan = trace.getSpan(context.active());
    if (!activeSpan) return {};
    const { traceId, spanId } = activeSpan.spanContext();
    return { trace_id: traceId, span_id: spanId };
  }
});
```
When an exemplar is clicked in Grafana, Tempo can query Loki for `{trace_id="<id>"}` and immediately reveal the exact correlated log entries.

### 3. Avoiding the Port 4317 TLS/Plaintext Pitfall
A common production failure in Node.js OTLP exporters is:
`SSL routines:ssl3_get_record:wrong version number`
This occurs when the exporter attempts to establish an SSL/TLS connection against a plaintext gRPC port. In `src/otel.js`, endpoints starting with `grpc://` explicitly configure `credentials: grpcCredentials.createInsecure()`.

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start the service (targets localhost:4317 by default)
npm start

# 3. Generate traffic
curl http://localhost:8080/test
curl http://localhost:8080/error
```

## Endpoints

| Method | Path | Description | Telemetry Emitted |
| :--- | :--- | :--- | :--- |
| `GET` | `/test` | Standard operation with synthetic 50-200ms delay | HTTP Span, `http_request_duration_seconds` with Exemplar, Pino log |
| `GET` | `/error` | Simulates internal server error (500) | Error Span (`status: error`), Metric failure count, Error log with stack |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint (fallback) | OpenMetrics text exposition format |
