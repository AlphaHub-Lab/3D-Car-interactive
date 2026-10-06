// ES Module entry wrapper for node server/mongodb-server.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const server = require('./mongodb-server.cjs');

export const app = server.app;
export const start = server.start;

if (process.argv[1] && process.argv[1].endsWith('mongodb-server.js')) {
  server.start();
}
