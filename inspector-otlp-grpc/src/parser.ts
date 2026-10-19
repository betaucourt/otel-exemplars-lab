import { ServerUnaryCall } from "@grpc/grpc-js";
import yaml from 'js-yaml';

/**
 * Individual OpenTelemetry exemplar sample extracted from a metric data point.
 */
export interface ExemplarSample {
  /** Timestamp of the exemplar measurement in nanoseconds since Unix epoch. */
  readonly timeUnixNano?: string;
  /** Trace identifier linking this metric measurement to a distributed trace. */
  readonly traceId?: string;
  /** Span identifier linking this metric measurement to an active span. */
  readonly spanId?: string;
  /** Numeric value recorded at the time of the exemplar measurement. */
  readonly value?: number;
  /** Key-value attributes associated with the exemplar measurement. */
  readonly filteredAttributes?: Record<string, unknown>;
}

/**
 * Structured summary of exemplars collected across data points for a specific metric.
 */
export interface ExemplarSummary {
  /** Name of the metric carrying the exemplar measurements. */
  readonly metricName: string;
  /** Description of the metric if provided in the metric descriptor. */
  readonly metricDescription?: string;
  /** List of exemplar samples captured for this metric. */
  readonly exemplars: readonly ExemplarSample[];
}

/**
 * Serializes a gRPC unary call payload into a formatted YAML string.
 *
 * @param call - The incoming gRPC ServerUnaryCall containing the request payload.
 * @returns YAML representation of the request payload.
 */
export function requestToYaml(call: ServerUnaryCall<any, any>): string {
  const obj = call.request;
  return yaml.dump(obj, { noRefs: true }); 
}

/**
 * Serializes a gRPC unary call payload into an indented JSON string.
 *
 * @param call - The incoming gRPC ServerUnaryCall containing the request payload.
 * @returns Indented JSON representation of the request payload.
 */
export function requestToJson(call: ServerUnaryCall<any, any>): string {
  const obj = call.request;
  return JSON.stringify(obj, null, 2);
}

/**
 * Extracts exemplar summaries from an OTLP ExportMetricsServiceRequest payload.
 *
 * Inspects all resource metrics, scope metrics, and data points (histograms, gauges, sums)
 * to extract exemplar samples with their trace/span IDs and values.
 *
 * @param request - Decoded OTLP MetricsService request payload object.
 * @returns Array of exemplar summaries grouped by metric name.
 */
export function extractExemplarSummaries(request: Record<string, unknown>): readonly ExemplarSummary[] {
  const summaries: ExemplarSummary[] = [];
  const resourceMetrics = (request['resource_metrics'] ?? request['resourceMetrics']) as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(resourceMetrics)) {
    return summaries;
  }

  for (const rm of resourceMetrics) {
    const scopeMetrics = (rm['scope_metrics'] ?? rm['scopeMetrics']) as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(scopeMetrics)) continue;

    for (const sm of scopeMetrics) {
      const metrics = sm['metrics'] as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(metrics)) continue;

      for (const metric of metrics) {
        const metricName = typeof metric['name'] === 'string' ? metric['name'] : 'unknown_metric';
        const metricDescription = typeof metric['description'] === 'string' ? metric['description'] : undefined;
        const samples: ExemplarSample[] = [];

        const containers = [
          metric['gauge'],
          metric['sum'],
          metric['histogram'],
          metric['exponential_histogram'],
          metric['exponentialHistogram'],
          metric['summary'],
        ];

        for (const container of containers) {
          if (!container || typeof container !== 'object') continue;
          const dataPoints = (container as Record<string, unknown>)['data_points'] ?? (container as Record<string, unknown>)['dataPoints'];
          if (!Array.isArray(dataPoints)) continue;

          for (const dp of dataPoints) {
            if (!dp || typeof dp !== 'object') continue;
            const exemplars = (dp as Record<string, unknown>)['exemplars'];
            if (!Array.isArray(exemplars)) continue;

            for (const ex of exemplars) {
              if (!ex || typeof ex !== 'object') continue;
              const rawEx = ex as Record<string, unknown>;
              const traceId = typeof rawEx['trace_id'] === 'string'
                ? rawEx['trace_id']
                : rawEx['traceId'] ? String(rawEx['traceId']) : undefined;
              const spanId = typeof rawEx['span_id'] === 'string'
                ? rawEx['span_id']
                : rawEx['spanId'] ? String(rawEx['spanId']) : undefined;
              const timeUnixNano = rawEx['time_unix_nano'] !== undefined
                ? String(rawEx['time_unix_nano'])
                : rawEx['timeUnixNano'] !== undefined ? String(rawEx['timeUnixNano']) : undefined;
              const val = typeof rawEx['as_double'] === 'number'
                ? rawEx['as_double']
                : typeof rawEx['as_int'] === 'number'
                  ? rawEx['as_int']
                  : typeof rawEx['value'] === 'number' ? rawEx['value'] : undefined;

              samples.push({
                timeUnixNano,
                traceId,
                spanId,
                value: val,
                filteredAttributes: typeof rawEx['filtered_attributes'] === 'object'
                  ? rawEx['filtered_attributes'] as Record<string, unknown>
                  : undefined,
              });
            }
          }
        }

        if (samples.length > 0) {
          summaries.push({
            metricName,
            metricDescription,
            exemplars: samples,
          });
        }
      }
    }
  }

  return summaries;
}
