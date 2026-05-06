import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import type { PolicyStore } from '../../../exec/policyStore.js';
import { executeTemplateSend, commonSendInputProps, type CommonSendArgs } from './sendBase.js';
import { errorResult } from '../base.js';

export class SendBmsTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'send_bms',
      description:
        'Send a Kakao friendtalk (BMS) message. Requires pfid. Either templateId (template mode) or free=true with bubbleType (free-form mode). SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          ...commonSendInputProps(false),
          text: { type: 'string', description: 'Required in free-form mode; optional override in template mode.' },
          pfid: { type: 'string', description: 'REQUIRED. Kakao channel ID (PFID).' },
          templateId: { type: 'string', description: 'BMS template ID (required unless free=true).' },
          variables: { type: 'string', description: 'Variables as JSON string.' },
          free: { type: 'boolean', description: 'Free-form mode (requires bubbleType).' },
          bubbleType: { type: 'string', description: 'Required in free-form mode. e.g. TEXT, IMAGE, WIDE.' },
          targeting: { type: 'string', enum: ['I', 'M', 'N'], description: 'I=individual, M=audience, N=new.' },
          ad: { type: 'boolean', description: 'Mark as advertising message.' },
          adult: { type: 'boolean', description: 'Mark as adult content.' },
          image: { type: 'string', description: 'Local image file path.' },
          buttonName: { type: 'string' },
          buttonType: { type: 'string', description: 'e.g. WL (web link), AL (app link).' },
          buttonURL: { type: 'string' },
          buttons: { type: 'string', description: 'Multiple buttons as JSON array string.' },
        },
        required: ['to', 'pfid'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const pfid = (args.pfid as string | undefined)?.trim();
    if (!pfid) return errorResult('pfid가 비어 있습니다.');
    if (!args.templateId && !args.free) {
      return errorResult('templateId 또는 free=true 중 하나는 지정해야 합니다.');
    }
    const details = {
      pfid,
      templateId: args.templateId,
      variables: args.variables,
      free: args.free,
      bubbleType: args.bubbleType,
      targeting: args.targeting,
      ad: args.ad,
      adult: args.adult,
      image: args.image,
      buttonName: args.buttonName,
      buttonType: args.buttonType,
      buttonURL: args.buttonURL,
      buttons: args.buttons,
    };
    return executeTemplateSend(
      this.policy,
      args as unknown as CommonSendArgs,
      'bms',
      { type: 'BMS', details },
      {
        '--pfid': pfid,
        '--template-id': args.templateId as string | undefined,
        '--variables': args.variables as string | undefined,
        '--free': args.free as boolean | undefined,
        '--bubble-type': args.bubbleType as string | undefined,
        '--targeting': args.targeting as string | undefined,
        '--ad': args.ad as boolean | undefined,
        '--adult': args.adult as boolean | undefined,
        '--image': args.image as string | undefined,
        '--button-name': args.buttonName as string | undefined,
        '--button-type': args.buttonType as string | undefined,
        '--button-url': args.buttonURL as string | undefined,
        '--buttons': args.buttons as string | undefined,
      },
    );
  }
}
