# inspector-otlp-grpc - Wire-Level OTLP/gRPC Protobuf Metrics Receiver

[![TypeScript 5.x](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![gRPC](https://img.shields.io/badge/Protocol-gRPC_%2F_Protobuf-blue.svg)](https://grpc.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

A custom TypeScript packet analyzer and wire-level receiver implementing the official OpenTelemetry `MetricsService` gRPC specification:
- **Raw Protobuf Decoding**: Direct binary payload deserialization via `@grpc/grpc-js` and `@grpc/proto-loader`.
- **Exemplar Inspection**: Inspecting histogram bucket exemplars (`trace_id`, `span_id`, value, timestamp) directly from wire frames.
- **Network Handshake Debugging**: Diagnosing TLS vs plaintext negotiation errors and collector delivery issues without third-party black boxes.

---

## Why Build a Wire-Level Inspector?

In enterprise observability architectures, the OpenTelemetry Collector often acts as a black box. When metrics fail to appear in Prometheus or exemplars vanish, standard logs offer cryptic errors like `EOF` or `wrong version number`.

`inspector-otlp-grpc` acts as an **auditable gRPC wire-tap**:
1. Implements `opentelemetry.proto.collector.metrics.v1.MetricsService`.
2. Receives raw binary gRPC frames directly on port `4317` (or custom port `4020`).
3. Decodes the full Protobuf tree into human-readable JSON files saved under `captures/`.
4. Emits a concise summary showing received metric types, payload byte sizes, and all extracted exemplar trace IDs.

---

## Generated Documentation

- **Package Overview**: [`docs/generated/packages/otel-exemplars-lab-inspector-otlp-grpc/overview.md`](./docs/generated/packages/otel-exemplars-lab-inspector-otlp-grpc/overview.md) - Surface metrics, exports, and dependency graph.
- **API Reference**: [`docs/generated/packages/otel-exemplars-lab-inspector-otlp-grpc/api-reference.md`](./docs/generated/packages/otel-exemplars-lab-inspector-otlp-grpc/api-reference.md) - TypeScript declarations, types, and JSDoc evidence.

---

## Quickstart

```bash
# 1. Install dependencies & build
npm install
npm run build

# 2. Start the receiver
npm start

# 3. Direct any OTLP/gRPC producer to localhost:4020 (or :4317)
# Incoming payloads are decoded and saved to captures/*.json
```
