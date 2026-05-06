import type { PolicyStore, MutablePolicy } from '../../exec/policyStore.js';
import type { Tool, ToolDefinition, ToolResult } from '../../types/index.js';
import { errorResult, jsonResult } from '../cli/base.js';

export class GetMcpPolicyTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'get_mcp_policy',
      description:
        'Show the current send-safety policy: whether sending is enabled, the per-call recipient cap, the allowed-sender whitelist, and the corresponding env-var ceilings.',
      inputSchema: { type: 'object', properties: {} },
    };
  }

  async execute(): Promise<ToolResult> {
    return jsonResult(this.policy.snapshot());
  }
}

export class UpdateMcpPolicyTool implements Tool {
  constructor(private policy: PolicyStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'update_mcp_policy',
      description:
        'Update the send-safety policy for the current MCP session. Changes are NOT persisted — the server resets to env-var defaults on restart. Env vars act as ceilings; values exceeding them are rejected. Hard lock via SOLAPI_MCP_DISABLE_SEND=true cannot be unlocked here.',
      inputSchema: {
        type: 'object',
        properties: {
          sendEnabled: { type: 'boolean', description: 'Enable or disable send_* tools.' },
          maxRecipients: { type: 'number', minimum: 1, description: 'Per-call recipient cap.' },
          allowedSenders: {
            anyOf: [
              { type: 'array', items: { type: 'string' } },
              { type: 'null' },
            ],
            description: 'Sender phone whitelist. null = unrestricted (only allowed when no env-var ceiling).',
          },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const patch: Partial<MutablePolicy> = {};
    if (args.sendEnabled !== undefined) {
      if (typeof args.sendEnabled !== 'boolean') return errorResult('sendEnabled는 boolean이어야 합니다.');
      patch.sendEnabled = args.sendEnabled;
    }
    if (args.maxRecipients !== undefined) {
      if (typeof args.maxRecipients !== 'number') return errorResult('maxRecipients는 number여야 합니다.');
      patch.maxRecipients = args.maxRecipients;
    }
    if (args.allowedSenders !== undefined) {
      if (args.allowedSenders === null) {
        patch.allowedSenders = null;
      } else if (Array.isArray(args.allowedSenders) && args.allowedSenders.every((s) => typeof s === 'string')) {
        patch.allowedSenders = args.allowedSenders as string[];
      } else {
        return errorResult('allowedSenders는 string[] 또는 null이어야 합니다.');
      }
    }

    try {
      const next = this.policy.update(patch);
      console.error(`[policy] updated: ${JSON.stringify(patch)} → snapshot: ${JSON.stringify(next)}`);
      return jsonResult(next);
    } catch (err) {
      return errorResult((err as Error).message);
    }
  }
}
