import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { execAsJsonTool } from '../base.js';
import { buildGlobalFlags } from '../argBuilder.js';

export class GetBalanceTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_balance',
      description: 'Show the SOLAPI cash balance and points for the active profile.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'string', description: 'Override the active profile.' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const profile = args.profile as string | undefined;
    return execAsJsonTool([...buildGlobalFlags({ profile }), 'balance']);
  }
}
