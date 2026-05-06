import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';
import { errorResult } from '../base.js';

export class SendMmsTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_mms',
      description:
        'Send an MMS (image-attached) message via SOLAPI. Requires a local image file path. SAFETY: requires confirmed=true to actually send.',
      inputSchema: {
        type: 'object',
        properties: {
          ...commonSendInputProps(),
          image: { type: 'string', description: 'REQUIRED. Local image file path on the machine running the MCP server.' },
          subject: { type: 'string', description: 'Optional message subject.' },
        },
        required: ['to', 'text', 'image'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const image = (args.image as string | undefined)?.trim();
    if (!image) return errorResult('image(파일 경로)가 비어 있습니다.');
    const subject = args.subject as string | undefined;
    return executeSend(
      this.policy,
      args as unknown as CommonSendArgs,
      'mms',
      { type: 'MMS', details: { image, ...(subject ? { subject } : {}) } },
      { '--image': image, '--subject': subject },
    );
  }
}
