import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { errorResult } from '../base.js';
import { executeMutation, mutationCommonProps, type MutationCommonArgs } from '../mutationBase.js';

export class RequestQuotaTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'request_quota',
      description:
        'Submit a quota-increase request. To maximize approval speed, the `reason` should include: who you send to, the actual message body, schedule/volume, and the business reason. Range: target 50–10,000,000; reason ≤ 500 chars. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          target: { type: 'number', minimum: 50, maximum: 10000000, description: 'Requested new quota.' },
          reason: { type: 'string', description: 'Detailed justification (≤ 500 chars).' },
          ...mutationCommonProps,
        },
        required: ['target', 'reason'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const target = args.target as number | undefined;
    const reason = (args.reason as string | undefined)?.trim();
    if (typeof target !== 'number' || !Number.isInteger(target)) {
      return errorResult('target은 정수여야 합니다.');
    }
    if (!reason) return errorResult('reason이 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['quota', 'request', '--target', String(target), '--reason', reason],
      { action: 'request_quota', details: { target, reason } },
    );
  }
}
