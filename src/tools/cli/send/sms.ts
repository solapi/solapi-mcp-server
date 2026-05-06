import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';

export class SendSmsTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_sms',
      description:
        'Send an SMS message via SOLAPI. SAFETY: requires confirmed=true to actually send. Without confirmed=true, returns a dry-run preview only.',
      inputSchema: {
        type: 'object',
        properties: commonSendInputProps(),
        required: ['to', 'text'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return executeSend(this.policy, args as unknown as CommonSendArgs, 'sms', { type: 'SMS' });
  }
}
