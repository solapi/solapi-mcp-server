import { runSolactlJson, runSolactl } from '../../exec/solactlRunner.js';
import type { ToolResult } from '../../types/index.js';
import { errorResult, jsonResult, textResult } from './base.js';
import { buildGlobalFlags } from './argBuilder.js';

export interface MutationCommonArgs {
  profile?: string | undefined;
  timeoutSec?: number | undefined;
  confirmed?: boolean | undefined;
}

export const mutationCommonProps: Record<string, unknown> = {
  profile: { type: 'string', description: 'Override active SOLAPI credential profile.' },
  timeoutSec: { type: 'number', description: 'Per-call timeout in seconds.', minimum: 1 },
  confirmed: {
    type: 'boolean',
    description:
      'REQUIRED safety gate. When false (or omitted), returns a dry-run preview WITHOUT calling SOLAPI. Set to true only after the user has explicitly approved the change.',
  },
};

/**
 * 변경(create/update/delete/inspect/...) 도구의 공통 흐름.
 * - confirmed=false → 인자 echo + 미리보기
 * - confirmed=true → solactl 호출
 *
 * 변경 도구는 발송과 달리 "수신자/발신번호" 같은 추가 정책 검증이 없으므로
 * confirmed 게이트만 통과하면 실행한다.
 */
export async function executeMutation(
  args: MutationCommonArgs,
  cliArgs: string[],
  preview: { action: string; details: Record<string, unknown> },
  opts: { jsonOutput?: boolean } = {},
): Promise<ToolResult> {
  if (!args.confirmed) {
    return jsonResult({
      dryRun: true,
      action: preview.action,
      details: preview.details,
      profile: args.profile ?? '(active)',
      note: '실제로 적용하려면 동일 인자에 confirmed: true 를 추가해서 다시 호출하세요.',
    });
  }

  const fullArgs = [
    ...buildGlobalFlags({ profile: args.profile, timeoutSec: args.timeoutSec }),
    ...cliArgs,
  ];

  try {
    if (opts.jsonOutput === false) {
      const result = await runSolactl({ args: fullArgs });
      if (result.exitCode !== 0) {
        const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.exitCode}`;
        return errorResult(`solactl ${cliArgs[0] ?? ''} 실패: ${detail}`);
      }
      return textResult(result.stdout.trim() || '완료되었습니다.');
    }
    const json = await runSolactlJson(fullArgs);
    return jsonResult(json);
  } catch (err) {
    return errorResult((err as Error).message);
  }
}
