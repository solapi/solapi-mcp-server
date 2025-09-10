import { OptimizedSolapiMcpServer } from './core/server.js';

// 서버 시작
const server = new OptimizedSolapiMcpServer();
server.start().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { OptimizedSolapiMcpServer };
