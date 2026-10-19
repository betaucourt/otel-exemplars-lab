import { startServer } from './src/server.js';

const port = process.env.OTLP_PORT ?? '4020';
const addr = `0.0.0.0:${port}`;

startServer(addr).catch((err) => {
  console.error('Failed to start OTLP listener:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, exiting');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, exiting');
  process.exit(0);
});
