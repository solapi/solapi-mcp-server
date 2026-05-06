import { runSolactl, runSolactlJson } from '../../exec/solactlRunner.js';
import type { ToolResult } from '../../types/index.js';

export function jsonResult(payload: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
  };
}

export function textResult(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
  };
}

export function errorResult(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
    isError: true,
  };
}

/**
 * solactl을 호출하고 JSON 응답을 그대로 ToolResult로 감싼다.
 * 비-제로 종료 코드 시 isError로 반환.
 */
export async function execAsJsonTool(args: string[], opts: { timeoutMs?: number | undefined } = {}): Promise<ToolResult> {
  try {
    const json = await runSolactlJson(args, opts);
    return jsonResult(json);
  } catch (err) {
    return errorResult((err as Error).message);
  }
}

/**
 * solactl을 호출하고 stdout을 그대로 텍스트로 반환한다.
 * (JSON이 아닌 사람이 읽는 출력에 사용 — 대부분 도구는 execAsJsonTool 사용)
 */
export async function execAsTextTool(args: string[], opts: { timeoutMs?: number | undefined } = {}): Promise<ToolResult> {
  try {
    const result = await runSolactl({ args, timeoutMs: opts.timeoutMs });
    if (result.exitCode !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.exitCode}`;
      return errorResult(`solactl ${args[0]} 실패: ${detail}`);
    }
    return textResult(result.stdout);
  } catch (err) {
    return errorResult((err as Error).message);
  }
}

const PROFILE_NAME_RE = /^[a-zA-Z0-9_-]{1,64}$/;

export function validateProfileName(name: string): string | null {
  if (!PROFILE_NAME_RE.test(name)) {
    return '프로필 이름은 영숫자/_/- 만 허용되며 1~64자여야 합니다.';
  }
  return null;
}

/**
 * 글로벌 플래그(--profile, --timeout)를 args 앞에 추가한다.
 * solactl은 PersistentFlags라 위치 무관이지만 가독성을 위해 명령 앞에 둔다.
 */
export function withGlobalFlags(args: string[], opts: { profile?: string | undefined; timeoutSec?: number | undefined } = {}): string[] {
  const prefix: string[] = [];
  if (opts.profile) prefix.push('--profile', opts.profile);
  if (opts.timeoutSec) prefix.push('--timeout', `${opts.timeoutSec}s`);
  return [...prefix, ...args];
}
