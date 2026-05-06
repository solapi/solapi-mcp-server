import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { execAsJsonTool } from '../base.js';
import { buildFlags, buildGlobalFlags } from '../argBuilder.js';

export class ListSenderIdsTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_senderids',
      description:
        'List registered sender phone numbers. Active only by default; pass `all: true` to include inactive numbers.',
      inputSchema: {
        type: 'object',
        properties: {
          all: { type: 'boolean', description: 'Include inactive sender numbers.' },
          profile: { type: 'string' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({ '--all': args.all });
    const profile = args.profile as string | undefined;
    return execAsJsonTool([...buildGlobalFlags({ profile }), 'senderid', 'list', ...flags]);
  }
}
