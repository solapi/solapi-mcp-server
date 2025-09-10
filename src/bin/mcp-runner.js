#!/usr/bin/env node
import { spawn, ChildProcess } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// ES6 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 실제 MCP 서버 경로 (TypeScript 컴파일된 파일)
const mainPath = join(__dirname, '../dist/index.js');
/**
 * SOLAPI MCP 서버 프로세스 생성
 */
const child = spawn('node', [mainPath], {
    stdio: ['inherit', 'inherit', 'inherit'], // stdin, stdout, stderr 연결
    env: {
        ...process.env,
        NODE_ENV: 'production',
    },
});
/**
 * MCP 서버 프로세스 종료 이벤트 핸들러
 * @param code - 프로세스 종료 코드
 */
child.on('exit', (code) => {
    process.exit(code || 0);
});
/**
 * MCP 서버 에러 이벤트 핸들러
 * @param err - 발생한 에러 객체
 */
child.on('error', (err) => {
    console.error('SOLAPI MCP server error:', err);
    process.exit(1);
});
/**
 * SIGINT 시그널 핸들러 (Ctrl+C)
 * 자식 프로세스에 SIGINT 시그널을 전달
 */
process.on('SIGINT', () => {
    child.kill('SIGINT');
});
/**
 * SIGTERM 시그널 핸들러
 * 자식 프로세스에 SIGTERM 시그널을 전달
 */
process.on('SIGTERM', () => {
    child.kill('SIGTERM');
});
//# sourceMappingURL=mcp-runner.js.map