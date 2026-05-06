import { spawn } from 'child_process';
import { ensureInstalled } from '../installers/solactlInstaller.js';

export interface RunOptions {
  args: string[];
  /** stdin으로 보낼 문자열. 미지정 시 stdin을 닫음. */
  stdin?: string | undefined;
  /** 추가 환경변수. 기본 process.env에 머지됨. */
  env?: Record<string, string> | undefined;
  /** 타임아웃(ms). 0 또는 미지정 시 무제한. */
  timeoutMs?: number | undefined;
}

export interface RunResult {
  /** 0이면 성공. */
  exitCode: number;
  stdout: string;
  stderr: string;
  /** stdout이 JSON으로 파싱되면 그 값, 아니면 null. --json 모드 호출에서만 의미 있음. */
  json: unknown | null;
}

let cachedBinary: string | null = null;

async function resolveBinary(): Promise<string> {
  if (cachedBinary) return cachedBinary;
  cachedBinary = await ensureInstalled();
  return cachedBinary;
}

function tryParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/**
 * solactl 바이너리를 실행한다.
 *
 * - 바이너리가 없으면 자동 다운로드.
 * - 항상 사용자 환경변수를 상속.
 * - timeoutMs 초과 시 SIGTERM.
 */
export async function runSolactl(opts: RunOptions): Promise<RunResult> {
  const binary = await resolveBinary();
  const env = { ...process.env, ...opts.env };

  return new Promise((resolve, reject) => {
    const child = spawn(binary, opts.args, { env, stdio: ['pipe', 'pipe', 'pipe'] });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let timedOut = false;

    const timer = opts.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
        }, opts.timeoutMs)
      : null;

    child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk));

    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });

    child.on('exit', (code) => {
      if (timer) clearTimeout(timer);
      const stdout = Buffer.concat(stdoutChunks).toString('utf8');
      const stderr = Buffer.concat(stderrChunks).toString('utf8');
      if (timedOut) {
        reject(new Error(`solactl 호출 타임아웃 (${opts.timeoutMs}ms): ${opts.args.join(' ')}`));
        return;
      }
      resolve({
        exitCode: code ?? -1,
        stdout,
        stderr,
        json: tryParseJson(stdout),
      });
    });

    if (opts.stdin !== undefined) {
      child.stdin.write(opts.stdin);
    }
    child.stdin.end();
  });
}

/**
 * --json을 항상 인자에 추가하고 결과를 파싱한다.
 * 비-제로 종료 코드 또는 JSON 파싱 실패 시 throw.
 */
export async function runSolactlJson(args: string[], opts: Omit<RunOptions, 'args'> = {}): Promise<unknown> {
  const result = await runSolactl({ ...opts, args: [...args, '--json'] });
  if (result.exitCode !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.exitCode}`;
    throw new Error(`solactl ${args[0]} 실패: ${detail}`);
  }
  if (result.json === null) {
    throw new Error(`solactl ${args[0]} 출력이 JSON이 아닙니다: ${result.stdout.slice(0, 200)}`);
  }
  return result.json;
}
