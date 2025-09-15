import { SolapiMcpServer } from './core/server.js';

// 서버 시작
const server = new SolapiMcpServer();
server.start().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { SolapiMcpServer };
