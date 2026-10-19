---
type: "API Reference"
title: "@otel-exemplars-lab/inspector-otlp-grpc — API Reference"
description: "Generated api reference for @otel-exemplars-lab/inspector-otlp-grpc from snapshot snapshot:v1:project:v1:b34c28a49d6b2d4a:git:716ad9d553503d89b180c91c884ffc5beca80f06."
resource: "/packages/otel-exemplars-lab-inspector-otlp-grpc/api-reference.md"
tags: ["ts-codegraph", "generated", "api-reference"]
timestamp: "2026-07-03T00:00:00+02:00"
generated_by: "ts-codegraph generate"
schema_version: "ts-codegraph.api-reference@1"
source_snapshot: "snapshot:v1:project:v1:b34c28a49d6b2d4a:git:716ad9d553503d89b180c91c884ffc5beca80f06"
template_id: "api-reference"
template_version: "1.0.0"
dataset_schema_version: "ts-codegraph.dataset@1"
---

# @otel-exemplars-lab/inspector-otlp-grpc — API Reference

## Objective

Public API surface for `@otel-exemplars-lab/inspector-otlp-grpc` in project `@otel-exemplars-lab/inspector-otlp-grpc`.

## API

### Quick Navigation

| Symbol | Kind | Source Location |
| :--- | :---: | :--- |
| [DEFAULT_METRICS_PROTO_REL_PATH](#DEFAULT_METRICS_PROTO_REL_PATH) | `constant` | `src/proto.ts:8` |
| [ExemplarSample](#ExemplarSample) | `interface` | `src/parser.ts:7` |
| [ExemplarSummary](#ExemplarSummary) | `interface` | `src/parser.ts:23` |
| [InspectorServerOptions](#InspectorServerOptions) | `interface` | `src/server.ts:9` |
| [MetricsServiceDefinition](#MetricsServiceDefinition) | `interface` | `src/proto.ts:20` |
| [OutputDirectories](#OutputDirectories) | `interface` | `src/io.ts:18` |
| [dataType](#dataType) | `type-alias` | `src/io.ts:8` |
| [ensureDirs](#ensureDirs) | `function` | `src/io.ts:31` |
| [extractExemplarSummaries](#extractExemplarSummaries) | `function` | `src/parser.ts:63` |
| [fileType](#fileType) | `type-alias` | `src/io.ts:13` |
| [loadMetricsService](#loadMetricsService) | `function` | `src/proto.ts:33` |
| [requestToJson](#requestToJson) | `function` | `src/parser.ts:49` |
| [requestToYaml](#requestToYaml) | `function` | `src/parser.ts:38` |
| [startServer](#startServer) | `function` | `src/server.ts:26` |
| [writeOutputs](#writeOutputs) | `function` | `src/io.ts:45` |

---

### DEFAULT_METRICS_PROTO_REL_PATH

- **Kind**: `constant`
- **Source**: `src/proto.ts:8`

```ts
export const DEFAULT_METRICS_PROTO_REL_PATH: any
```

Default relative path to the OpenTelemetry MetricsService protobuf definition from repository root.

### ExemplarSample

- **Kind**: `interface`
- **Source**: `src/parser.ts:7`

```ts
export interface ExemplarSample { /** Timestamp of the exemplar measurement in nanoseconds since Unix epoch. */ readonly timeUnixNano?: string; /** Trace identifier linking this metric measurement to a distributed trace. */ readonly traceId?: string; /** Span identifier linking this metric measurement to an active span. */ readonly spanId?: string; /** Numeric value recorded at the time of the exemplar measurement. */ readonly value?: number; /** Key-value attributes associated with the exemplar measurement. */ readonly filteredAttributes?: Record<string, unknown>; }
```

Individual OpenTelemetry exemplar sample extracted from a metric data point.

### ExemplarSummary

- **Kind**: `interface`
- **Source**: `src/parser.ts:23`

```ts
export interface ExemplarSummary { /** Name of the metric carrying the exemplar measurements. */ readonly metricName: string; /** Description of the metric if provided in the metric descriptor. */ readonly metricDescription?: string; /** List of exemplar samples captured for this metric. */ readonly exemplars: readonly ExemplarSample[]; }
```

Structured summary of exemplars collected across data points for a specific metric.

### InspectorServerOptions

- **Kind**: `interface`
- **Source**: `src/server.ts:9`

```ts
export interface InspectorServerOptions { /** Address and port to bind the gRPC server (e.g. '0.0.0.0:4020'). */ readonly bindAddr?: string; /** Base filesystem directory where received logs and metrics payloads will be stored. */ readonly logsBaseDir?: string; }
```

Configuration options for the OTLP inspector gRPC server.

### MetricsServiceDefinition

- **Kind**: `interface`
- **Source**: `src/proto.ts:20`

```ts
export interface MetricsServiceDefinition { /** Underlying gRPC service definition descriptor for registration on a Server. */ readonly service: ServiceDefinition; [key: string]: unknown; }
```

gRPC service definition wrapper loaded from OpenTelemetry MetricsService protobuf definitions.

### OutputDirectories

- **Kind**: `interface`
- **Source**: `src/io.ts:18`

```ts
export interface OutputDirectories { /** Absolute or relative path to the directory storing JSON payload logs. */ readonly jsonLogs: string; /** Absolute or relative path to the directory storing YAML payload logs. */ readonly yamlLogs: string; }
```

Output directory paths where captured payload logs are written.

### dataType

- **Kind**: `type-alias`
- **Source**: `src/io.ts:8`

```ts
export type dataType = 'metrics' | 'logs' | 'traces';
```

OpenTelemetry payload data type accepted for disk persistence.

### ensureDirs

- **Kind**: `function`
- **Source**: `src/io.ts:31`

```ts
export function ensureDirs(base: string): OutputDirectories
```

Ensures the JSON and YAML output directories exist on disk under the given base path.

@param base - Base filesystem directory where the logs structure should be created.
@returns The resolved directories for JSON and YAML output files.

### extractExemplarSummaries

- **Kind**: `function`
- **Source**: `src/parser.ts:63`

```ts
export function extractExemplarSummaries(request: Record<string, unknown>): readonly ExemplarSummary[]
```

Extracts exemplar summaries from an OTLP ExportMetricsServiceRequest payload.

Inspects all resource metrics, scope metrics, and data points (histograms, gauges, sums)
to extract exemplar samples with their trace/span IDs and values.

@param request - Decoded OTLP MetricsService request payload object.
@returns Array of exemplar summaries grouped by metric name.

### fileType

- **Kind**: `type-alias`
- **Source**: `src/io.ts:13`

```ts
export type fileType = 'json' | 'yaml';
```

Serialization format used when writing received payloads to disk.

### loadMetricsService

- **Kind**: `function`
- **Source**: `src/proto.ts:33`

```ts
export async function loadMetricsService(protoRootDir?: string): Promise<MetricsServiceDefinition>
```

Loads the OpenTelemetry MetricsService Protobuf definition using `@grpc/proto-loader`.

@param protoRootDir - Optional root directory for resolving proto imports. Defaults to `process.cwd()`.
@returns Promise resolving to the loaded MetricsService gRPC definition.
@throws Error if the protobuf file cannot be loaded or MetricsService is not found in the definition.

### requestToJson

- **Kind**: `function`
- **Source**: `src/parser.ts:49`

```ts
export function requestToJson(call: ServerUnaryCall<any, any>): string
```

Serializes a gRPC unary call payload into an indented JSON string.

@param call - The incoming gRPC ServerUnaryCall containing the request payload.
@returns Indented JSON representation of the request payload.

### requestToYaml

- **Kind**: `function`
- **Source**: `src/parser.ts:38`

```ts
export function requestToYaml(call: ServerUnaryCall<any, any>): string
```

Serializes a gRPC unary call payload into a formatted YAML string.

@param call - The incoming gRPC ServerUnaryCall containing the request payload.
@returns YAML representation of the request payload.

### startServer

- **Kind**: `function`
- **Source**: `src/server.ts:26`

```ts
export async function startServer(bindAddr: string | InspectorServerOptions = '0.0.0.0:4020'): Promise<Server>
```

Starts the OTLP gRPC inspector server and binds the MetricsService handler.

Registers the standard OpenTelemetry v1 MetricsService
(`opentelemetry.proto.collector.metrics.v1.MetricsService`) to accept and inspect
`ExportMetricsServiceRequest` payloads, persisting incoming metrics as YAML and JSON files.

@param bindAddr - TCP address and port to bind (default: '0.0.0.0:4020') or an options object.
@returns Promise resolving to the running gRPC Server instance once bound.

### writeOutputs

- **Kind**: `function`
- **Source**: `src/io.ts:45`

```ts
export function writeOutputs(type: dataType, obj: Record<string, unknown>): void
```

Serializes and writes an incoming OTLP payload to both YAML and JSON log files on disk.

@param type - The telemetry data type (metrics, logs, traces).
@param obj - The telemetry payload object to record.

## Sources Used

- `DEFAULT_METRICS_PROTO_REL_PATH` — `src/proto.ts:8`
- `ExemplarSample` — `src/parser.ts:7`
- `ExemplarSummary` — `src/parser.ts:23`
- `InspectorServerOptions` — `src/server.ts:9`
- `MetricsServiceDefinition` — `src/proto.ts:20`
- `OutputDirectories` — `src/io.ts:18`
- `dataType` — `src/io.ts:8`
- `ensureDirs` — `src/io.ts:31`
- `extractExemplarSummaries` — `src/parser.ts:63`
- `fileType` — `src/io.ts:13`
- `loadMetricsService` — `src/proto.ts:33`
- `requestToJson` — `src/parser.ts:49`
- `requestToYaml` — `src/parser.ts:38`
- `startServer` — `src/server.ts:26`
- `writeOutputs` — `src/io.ts:45`
