---
type: "Package Overview"
title: "@otel-exemplars-lab/inspector-otlp-grpc — Package Overview"
description: "Generated package overview for @otel-exemplars-lab/inspector-otlp-grpc from snapshot snapshot:v1:project:v1:b34c28a49d6b2d4a:git:716ad9d553503d89b180c91c884ffc5beca80f06."
resource: "/packages/otel-exemplars-lab-inspector-otlp-grpc/overview.md"
tags: ["ts-codegraph", "generated", "package-overview"]
timestamp: "2026-07-03T00:00:00+02:00"
generated_by: "ts-codegraph generate"
schema_version: "ts-codegraph.package-overview@1"
source_snapshot: "snapshot:v1:project:v1:b34c28a49d6b2d4a:git:716ad9d553503d89b180c91c884ffc5beca80f06"
template_id: "package-overview"
template_version: "1.0.0"
dataset_schema_version: "ts-codegraph.dataset@1"
---

# @otel-exemplars-lab/inspector-otlp-grpc — Package Overview

## Objective

`@otel-exemplars-lab/inspector-otlp-grpc` is a package in project `@otel-exemplars-lab/inspector-otlp-grpc`. Custom OpenTelemetry OTLP/gRPC MetricsService receiver in TypeScript for inspecting Prometheus Exemplars, trace_id/span_id correlations, and raw Protobuf payloads.

## Architecture & Surface Metrics

| Metric | Value | Provenance |
| :--- | :---: | :--- |
| **Exported Surface** | `4` files | Verified package entry points |
| **Public Symbols** | `15` declarations | Syntax-first AST extraction |
| **Dependencies** | `8` packages | `package.json` manifest |
| **Evidence Records** | `15` JSDoc blocks | AST comment provenance |

```mermaid
flowchart TD
    PKG["@otel-exemplars-lab/inspector-otlp-grpc"]
    subgraph DEPS["Dependencies (8)"]
        D_0["@grpc/grpc-js (runtime)"]
        D_1["@grpc/proto-loader (runtime)"]
        D_2["@types/js-yaml (dev)"]
        D_3["js-yaml (runtime)"]
        D_4["protobufjs (runtime)"]
        D_5["ts-node (dev)"]
        D_6["tsx (dev)"]
        D_7["typescript (dev)"]
    end
    DEPS --> PKG
    subgraph EXPORTS["Exported Entry Points (4)"]
        E_0["src/io.ts"]
        E_1["src/parser.ts"]
        E_2["src/proto.ts"]
        E_3["src/server.ts"]
    end
    PKG --> EXPORTS
```

## Exports

- `src/io.ts`
- `src/parser.ts`
- `src/proto.ts`
- `src/server.ts`

## Dependencies

- `@grpc/grpc-js` (`^1.8.14`) — runtime
- `@grpc/proto-loader` (`^0.7.6`) — runtime
- `@types/js-yaml` (`^4.0.5`) — dev
- `js-yaml` (`^4.1.0`) — runtime
- `protobufjs` (`^7.2.5`) — runtime
- `ts-node` (`^10.9.1`) — dev
- `tsx` (`^3.12.7`) — dev
- `typescript` (`^5.1.6`) — dev

## Sources Used

- Package manifest `package.json` at snapshot `snapshot:v1:project:v1:b34c28a49d6b2d4a:git:716ad9d553503d89b180c91c884ffc5beca80f06`.
- `DEFAULT_METRICS_PROTO_REL_PATH` (constant) — documentation evidence.
- `ExemplarSample` (interface) — documentation evidence.
- `ExemplarSummary` (interface) — documentation evidence.
- `InspectorServerOptions` (interface) — documentation evidence.
- `MetricsServiceDefinition` (interface) — documentation evidence.
- `OutputDirectories` (interface) — documentation evidence.
- `dataType` (type-alias) — documentation evidence.
- `ensureDirs` (function) — documentation evidence.
- `extractExemplarSummaries` (function) — documentation evidence.
- `fileType` (type-alias) — documentation evidence.
- `loadMetricsService` (function) — documentation evidence.
- `requestToJson` (function) — documentation evidence.
- `requestToYaml` (function) — documentation evidence.
- `startServer` (function) — documentation evidence.
- `writeOutputs` (function) — documentation evidence.
