import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { errorResult } from '../base.js';
import { executeMutation, mutationCommonProps, type MutationCommonArgs } from '../mutationBase.js';

export class DeleteSenderIdTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'delete_senderid',
      description:
        'Delete a registered sender phone number. SAFETY: requires confirmed=true. solactl is invoked with --yes to skip its own interactive prompt.',
      inputSchema: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string', description: 'The sender phone number to delete.' },
          ...mutationCommonProps,
        },
        required: ['phoneNumber'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const phoneNumber = (args.phoneNumber as string | undefined)?.trim();
    if (!phoneNumber) return errorResult('phoneNumber가 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['senderid', 'delete', phoneNumber, '--yes'],
      { action: 'delete_senderid', details: { phoneNumber } },
      { jsonOutput: false },
    );
  }
}

export class UpdateSenderIdTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'update_senderid',
      description: 'Activate or deactivate a registered sender phone number. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string', description: 'The sender phone number.' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          ...mutationCommonProps,
        },
        required: ['phoneNumber', 'status'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const phoneNumber = (args.phoneNumber as string | undefined)?.trim();
    const status = (args.status as string | undefined)?.trim();
    if (!phoneNumber) return errorResult('phoneNumber가 비어 있습니다.');
    if (status !== 'ACTIVE' && status !== 'INACTIVE') {
      return errorResult('status는 ACTIVE 또는 INACTIVE 여야 합니다.');
    }
    return executeMutation(
      args as MutationCommonArgs,
      ['senderid', 'update', phoneNumber, '--status', status],
      { action: 'update_senderid', details: { phoneNumber, status } },
      { jsonOutput: false },
    );
  }
}
