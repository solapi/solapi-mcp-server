import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';
import { errorResult } from '../base.js';

export class SendRcsTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_rcs',
      description:
        'Send an RCS message via SOLAPI. Requires a brandId. Optional templateId (with variables JSON), subject, image, mmsType, copyAllowed. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          ...commonSendInputProps(),
          brandId: { type: 'string', description: 'REQUIRED. RCS brand ID.' },
          templateId: { type: 'string', description: 'RCS template ID (optional).' },
          variables: { type: 'string', description: 'Variables as a JSON string (e.g. {"#{이름}":"홍길동"}).' },
          subject: { type: 'string' },
          image: { type: 'string', description: 'Local image file path.' },
          mmsType: { type: 'string', description: 'RCS MMS type.' },
          copyAllowed: { type: 'boolean', description: 'Allow message copy.' },
        },
        required: ['to', 'text', 'brandId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const brandId = (args.brandId as string | undefined)?.trim();
    if (!brandId) return errorResult('brandId가 비어 있습니다.');
    const details = {
      brandId,
      templateId: args.templateId,
      variables: args.variables,
      subject: args.subject,
      image: args.image,
      mmsType: args.mmsType,
      copyAllowed: args.copyAllowed,
    };
    return executeSend(
      this.policy,
      args as unknown as CommonSendArgs,
      'rcs',
      { type: 'RCS', details },
      {
        '--brand-id': brandId,
        '--template-id': args.templateId as string | undefined,
        '--variables': args.variables as string | undefined,
        '--subject': args.subject as string | undefined,
        '--image': args.image as string | undefined,
        '--mms-type': args.mmsType as string | undefined,
        '--copy-allowed': args.copyAllowed as boolean | undefined,
      },
    );
  }
}
