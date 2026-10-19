import fs from 'fs';
import path from 'path';
import { requestToYaml } from './parser.js';

/**
 * OpenTelemetry payload data type accepted for disk persistence.
 */
export type dataType = 'metrics' | 'logs' | 'traces';

/**
 * Serialization format used when writing received payloads to disk.
 */
export type fileType = 'json' | 'yaml';

/**
 * Output directory paths where captured payload logs are written.
 */
export interface OutputDirectories {
  /** Absolute or relative path to the directory storing JSON payload logs. */
  readonly jsonLogs: string;
  /** Absolute or relative path to the directory storing YAML payload logs. */
  readonly yamlLogs: string;
}

/**
 * Ensures the JSON and YAML output directories exist on disk under the given base path.
 *
 * @param base - Base filesystem directory where the logs structure should be created.
 * @returns The resolved directories for JSON and YAML output files.
 */
export function ensureDirs(base: string): OutputDirectories {
  const jsonLogs = path.join(base, 'metrics', 'json');
  const yamlLogs = path.join(base, 'metrics', 'yaml');
  fs.mkdirSync(jsonLogs, { recursive: true });
  fs.mkdirSync(yamlLogs, { recursive: true });
  return { jsonLogs, yamlLogs };
}

/**
 * Serializes and writes an incoming OTLP payload to both YAML and JSON log files on disk.
 *
 * @param type - The telemetry data type (metrics, logs, traces).
 * @param obj - The telemetry payload object to record.
 */
export function writeOutputs(type: dataType, obj: Record<string, unknown>): void {
  const yamlContent = requestToYaml({ request: obj } as any);
  const jsonContent = JSON.stringify(obj, null, 2);
  saveResult(type, 'yaml', yamlContent);
  saveResult(type, 'json', jsonContent);
}

function saveResult(type: dataType, fileType: fileType, content: string): void {
  const path = `./logs/${type}/${fileType}/${Date.now()}.${fileType}`;
  console.log(`Writing ${type} ${fileType} to ${path}`);
  fs.writeFileSync(path, content);
}
