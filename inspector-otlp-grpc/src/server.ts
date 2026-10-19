import path from 'path';
import { Server, ServerCredentials, sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { ensureDirs, writeOutputs } from './io.js';
import { loadMetricsService } from './proto.js';

/**
 * Configuration options for the OTLP inspector gRPC server.
 */
export interface InspectorServerOptions {
  /** Address and port to bind the gRPC server (e.g. '0.0.0.0:4020'). */
  readonly bindAddr?: string;
  /** Base filesystem directory where received logs and metrics payloads will be stored. */
  readonly logsBaseDir?: string;
}

/**
 * Starts the OTLP gRPC inspector server and binds the MetricsService handler.
 *
 * Registers the standard OpenTelemetry v1 MetricsService
 * (`opentelemetry.proto.collector.metrics.v1.MetricsService`) to accept and inspect
 * `ExportMetricsServiceRequest` payloads, persisting incoming metrics as YAML and JSON files.
 *
 * @param bindAddr - TCP address and port to bind (default: '0.0.0.0:4020') or an options object.
 * @returns Promise resolving to the running gRPC Server instance once bound.
 */
export async function startServer(bindAddr: string | InspectorServerOptions = '0.0.0.0:4020'): Promise<Server> {
  const options: InspectorServerOptions = typeof bindAddr === 'string'
    ? { bindAddr }
    : bindAddr;
  const targetAddr = options.bindAddr ?? '0.0.0.0:4020';
  const logsBaseDir = options.logsBaseDir ?? path.resolve(process.cwd(), 'logs');

  const MetricsService = await loadMetricsService();
  ensureDirs(logsBaseDir);

  const server = new Server();
  const impl = {
    Export: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
      try {
        console.log("call.request", call.request);
        const raw = call.request;
        if (call.request && typeof call.request === 'object' && call.request.resource_metrics) {
          writeOutputs('metrics', raw as Record<string, unknown>);
        }
        callback(null, {});
      } catch (err: unknown) {
        callback(err as any, null as any);
      }
    }
  };

  server.addService((MetricsService as any).service, impl);
  return new Promise<Server>((resolve, reject) => {
    server.bindAsync(targetAddr, ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`gRPC OTLP listener running on ${targetAddr} (port ${port})`);
      server.start();
      resolve(server);
    });
  });
}
