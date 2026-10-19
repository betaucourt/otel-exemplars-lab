# collector/ - Local OpenTelemetry Telemetry Routing & Storage Stack

This directory contains the production-grade configurations and declarative provisioning for the local observability stack running via Docker Compose.

---

## Architecture & Data Flow

```mermaid
flowchart TD
    subgraph INGEST["Ingress Protocols"]
        GRPC[":4317 OTLP gRPC"]
        HTTP[":4318 OTLP HTTP"]
    end

    subgraph COLLECTOR["OpenTelemetry Collector Contrib (v0.114.0)"]
        RCV["Receivers: OTLP"]
        PROC["Processors: Batch (5s timeout)"]
        EXP_M["Metrics Exporter: Prometheus (:8889 OpenMetrics)"]
        EXP_T["Traces Exporter: OTLP/Tempo (tempo:4317)"]
        EXP_L["Logs Exporter: OTLP/Loki (loki:3100/otlp)"]
    end

    subgraph STORAGE["Storage Backends"]
        PROM["Prometheus (v2.55.1)<br/>--enable-feature=exemplar-storage"]
        TEMPO["Grafana Tempo (v2.6.1)<br/>Local Trace DB (:3200)"]
        LOKI["Grafana Loki (v3.2.0)<br/>Structured Log Store (:3100)"]
    end

    subgraph VIS["Visualization"]
        GRAF["Grafana (v11.3.0)<br/>Anonymous Admin (:3000)<br/>Pre-provisioned Exemplar Correlation"]
    end

    GRPC --> RCV
    HTTP --> RCV
    RCV --> PROC
    PROC --> EXP_M & EXP_T & EXP_L
    EXP_M -->|Scrape :8889| PROM
    EXP_T --> TEMPO
    EXP_L --> LOKI

    PROM -->|"Query Metrics + Exemplars"| GRAF
    TEMPO -->|"Query Traces by TraceID"| GRAF
    LOKI -->|"Query Logs by {trace_id=...}"| GRAF
```

---

## Directory Layout

```
collector/
|-- otel-collector-config.yaml    # Receivers (4317/4318), processors, exporters (Prometheus, Tempo, Loki)
|-- prometheus.yaml               # Scrape config (1s interval) targeting collector:8889
|-- tempo.yaml                    # Single-binary Tempo trace store with OTLP receiver
|-- loki.yaml                     # Single-process Loki log store with OTLP HTTP endpoint
`-- grafana/
    |-- provisioning/
    |   |-- datasources/
    |   |   `-- datasources.yaml  # Configures Tempo with tracesToLogsV2 (Loki) & Prometheus with exemplarTraceIdDestinations (Tempo)
    |   `-- dashboards/
    |       `-- dashboards.yaml   # Auto-loads JSON dashboards from /etc/grafana/dashboards
    `-- dashboards/
        `-- exemplars-overview.json # Ready-to-use Grafana dashboard with Exemplar overlays
```

---

## Key Configurations Explained

### 1. Prometheus Exemplar Storage (`prometheus.yaml` & `docker-compose.yaml`)
Prometheus requires explicit activation of exemplar storage:
```yaml
command:
  - "--enable-feature=exemplar-storage"
```
The scraper runs with a 1-second interval against `otel-collector:8889`, extracting histograms with active exemplars encoded in OpenMetrics format.

### 2. Bidirectional Correlation in Grafana (`datasources.yaml`)
Grafana links all three pillars automatically without manual query stitching:
1. **Prometheus -> Tempo**:
   ```yaml
   exemplarTraceIdDestinations:
     - datasourceUid: tempo
       name: trace_id
   ```
2. **Tempo -> Loki**:
   ```yaml
   tracesToLogsV2:
     datasourceUid: loki
     tags: ['service.name']
     filterByTrace: true
     customQuery: true
     query: '{service_name="$${__span.service.name}"} |= "$${__span.traceId}"'
   ```

---

## Usage

Start the stack from the repository root:
```bash
docker compose up -d
```
All datasources and dashboards are automatically loaded in Grafana at [http://localhost:3000](http://localhost:3000).
