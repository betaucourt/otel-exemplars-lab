import path from 'path';
import protoLoader from '@grpc/proto-loader';
import type { ServiceDefinition } from '@grpc/grpc-js';

/**
 * Default relative path to the OpenTelemetry MetricsService protobuf definition from repository root.
 */
export const DEFAULT_METRICS_PROTO_REL_PATH = path.join(
  'opentelemetry',
  'proto',
  'collector',
  'metrics',
  'v1',
  'metrics_service.proto'
);

/**
 * gRPC service definition wrapper loaded from OpenTelemetry MetricsService protobuf definitions.
 */
export interface MetricsServiceDefinition {
  /** Underlying gRPC service definition descriptor for registration on a Server. */
  readonly service: ServiceDefinition;
  [key: string]: unknown;
}

/**
 * Loads the OpenTelemetry MetricsService Protobuf definition using `@grpc/proto-loader`.
 *
 * @param protoRootDir - Optional root directory for resolving proto imports. Defaults to `process.cwd()`.
 * @returns Promise resolving to the loaded MetricsService gRPC definition.
 * @throws Error if the protobuf file cannot be loaded or MetricsService is not found in the definition.
 */
export async function loadMetricsService(protoRootDir?: string): Promise<MetricsServiceDefinition> {
  const rootDir = protoRootDir ?? process.cwd();
  const protoPath = path.resolve(rootDir, DEFAULT_METRICS_PROTO_REL_PATH);
  const includeDir = path.resolve(rootDir);
  const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true, includeDirs: [includeDir] });
  const grpcPkg: any = (await import('@grpc/grpc-js')).loadPackageDefinition(packageDefinition);
  const svc = grpcPkg?.opentelemetry?.proto?.collector?.metrics?.v1?.MetricsService;
  if (!svc) throw new Error(`Loaded protos but couldn't resolve MetricsService from ${protoPath}`);
  return svc as MetricsServiceDefinition;
}
