import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';

export class SendLmsTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_lms',
      description:
        'Send an LMS (long SMS, up to 2000 bytes) via SOLAPI. SAFETY: requires confirmed=true to actually send.',
      inputSchema: {
        type: 'object',
        properties: {
          ...commonSendInputProps(),
          subject: { type: 'string', description: 'Optional message subject (LMS supports a subject line).' },
        },
        required: ['to', 'text'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const subject = args.subject as string | undefined;
    return executeSend(
      this.policy,
      args as unknown as CommonSendArgs,
      'lms',
      { type: 'LMS', details: subject ? { subject } : {} },
      { '--subject': subject },
    );
  }
}
