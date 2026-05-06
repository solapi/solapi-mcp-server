import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeTemplateSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';
import { errorResult } from '../base.js';

export class SendAtaTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_ata',
      description:
        'Send a Kakao alimtalk (ATA) message. Requires pfid (Kakao channel ID) and templateId. The text body is filled by the template — pass `text` only if you need to override. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          ...commonSendInputProps(false),
          text: { type: 'string', description: 'Optional override for the template body.' },
          pfid: { type: 'string', description: 'REQUIRED. Kakao channel ID (PFID).' },
          templateId: { type: 'string', description: 'REQUIRED. Alimtalk template ID.' },
          variables: { type: 'string', description: 'Variables as JSON string. Example: {"#{이름}":"홍길동"}' },
          title: { type: 'string', description: 'Highlight title.' },
          disableSms: { type: 'boolean', description: 'Disable SMS fallback. Default false.' },
          buttons: { type: 'string', description: 'Buttons as JSON array string.' },
        },
        required: ['to', 'pfid', 'templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const pfid = (args.pfid as string | undefined)?.trim();
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!pfid) return errorResult('pfid가 비어 있습니다.');
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    const details = {
      pfid,
      templateId,
      variables: args.variables,
      title: args.title,
      disableSms: args.disableSms,
      buttons: args.buttons,
    };
    return executeTemplateSend(
      this.policy,
      args as unknown as CommonSendArgs,
      'ata',
      { type: 'ATA', details },
      {
        '--pfid': pfid,
        '--template-id': templateId,
        '--variables': args.variables as string | undefined,
        '--title': args.title as string | undefined,
        '--disable-sms': args.disableSms as boolean | undefined,
        '--buttons': args.buttons as string | undefined,
      },
    );
  }
}
