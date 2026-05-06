import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { execAsJsonTool } from '../base.js';
import { buildFlags, buildGlobalFlags } from '../argBuilder.js';

export class ListMessagesTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_messages',
      description:
        'List recent SOLAPI message send history. Supports filtering by date range, type (SMS/LMS/MMS/ATA/RCS/...), and pagination via startKey returned in nextKey.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max entries (default 20).', minimum: 1, maximum: 500 },
          startDate: { type: 'string', description: 'YYYY-MM-DD inclusive lower bound.' },
          endDate: { type: 'string', description: 'YYYY-MM-DD inclusive upper bound.' },
          type: { type: 'string', description: 'Message type filter (SMS, LMS, MMS, ATA, CTA, RCS, ...).' },
          startKey: { type: 'string', description: 'Pagination cursor from a previous response.' },
          profile: { type: 'string' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--limit': args.limit,
      '--start-date': args.startDate,
      '--end-date': args.endDate,
      '--type': args.type,
      '--start-key': args.startKey,
    });
    const profile = args.profile as string | undefined;
    return execAsJsonTool([...buildGlobalFlags({ profile }), 'messages', 'list', ...flags]);
  }
}
