import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { execAsJsonTool } from '../base.js';
import { buildFlags, buildGlobalFlags } from '../argBuilder.js';

export class GetQuotaTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_quota',
      description:
        'Show current sending quota: current limit, min/max bounds, auto-adjustment flag, and overseas quota.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'string' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const profile = args.profile as string | undefined;
    return execAsJsonTool([...buildGlobalFlags({ profile }), 'quota', 'get']);
  }
}

export class ListQuotaRequestsTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_quota_requests',
      description:
        'List previously submitted quota-increase requests. Status values: PENDING, APPROVED, REJECTED.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          startKey: { type: 'string', description: 'Pagination cursor.' },
          limit: { type: 'number', minimum: 1, maximum: 500 },
          profile: { type: 'string' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--status': args.status,
      '--start-key': args.startKey,
      '--limit': args.limit,
    });
    const profile = args.profile as string | undefined;
    return execAsJsonTool([...buildGlobalFlags({ profile }), 'quota', 'list-requests', ...flags]);
  }
}
