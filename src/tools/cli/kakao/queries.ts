import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { execAsJsonTool } from '../base.js';
import { buildFlags, buildGlobalFlags } from '../argBuilder.js';

const profileProp = { profile: { type: 'string' as const } };

export class ListKakaoChannelsTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_channels',
      description: 'List Kakao channels (alimtalk/friendtalk senders). Filter by channelId, searchId, phoneNumber, categoryCode, or restrict to mine.',
      inputSchema: {
        type: 'object',
        properties: {
          channelId: { type: 'string' },
          searchId: { type: 'string' },
          phoneNumber: { type: 'string' },
          categoryCode: { type: 'string' },
          isMine: { type: 'boolean' },
          startKey: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 500 },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--channel-id': args.channelId,
      '--search-id': args.searchId,
      '--phone-number': args.phoneNumber,
      '--category-code': args.categoryCode,
      '--is-mine': args.isMine,
      '--start-key': args.startKey,
      '--limit': args.limit,
    });
    return execAsJsonTool([...buildGlobalFlags({ profile: args.profile as string | undefined }), 'kakao', 'channel', 'list', ...flags]);
  }
}

export class GetKakaoChannelTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_kakao_channel',
      description: 'Get a single Kakao channel by id.',
      inputSchema: {
        type: 'object',
        properties: { channelId: { type: 'string' }, ...profileProp },
        required: ['channelId'],
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'channel', 'get', String(args.channelId),
    ]);
  }
}

export class ListKakaoChannelCategoriesTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_channel_categories',
      description: 'List available Kakao channel categories.',
      inputSchema: { type: 'object', properties: profileProp },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'channel', 'categories',
    ]);
  }
}

export class ListKakaoChannelGroupsTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_channel_groups',
      description: 'List Kakao channel groups. Status values: PENDING, INSPECTING, APPROVED, REJECTED.',
      inputSchema: {
        type: 'object',
        properties: {
          channelGroupId: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'INSPECTING', 'APPROVED', 'REJECTED'] },
          isMine: { type: 'boolean' },
          startKey: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 500 },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--channel-group-id': args.channelGroupId,
      '--name': args.name,
      '--status': args.status,
      '--is-mine': args.isMine,
      '--start-key': args.startKey,
      '--limit': args.limit,
    });
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'channel-group', 'list', ...flags,
    ]);
  }
}

export class GetKakaoChannelGroupTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_kakao_channel_group',
      description: 'Get a single Kakao channel group by id.',
      inputSchema: {
        type: 'object',
        properties: { channelGroupId: { type: 'string' }, ...profileProp },
        required: ['channelGroupId'],
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'channel-group', 'get', String(args.channelGroupId),
    ]);
  }
}

export class ListKakaoTemplatesTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_templates',
      description: 'List Kakao alimtalk/brand templates. Status values: PENDING, INSPECTING, APPROVED, REJECTED.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          channelId: { type: 'string' },
          channelGroupId: { type: 'string' },
          templateId: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'INSPECTING', 'APPROVED', 'REJECTED'] },
          isHidden: { type: 'boolean' },
          isMine: { type: 'boolean' },
          startKey: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 500 },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--name': args.name,
      '--channel-id': args.channelId,
      '--channel-group-id': args.channelGroupId,
      '--template-id': args.templateId,
      '--status': args.status,
      '--is-hidden': args.isHidden,
      '--is-mine': args.isMine,
      '--start-key': args.startKey,
      '--limit': args.limit,
    });
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'template', 'list', ...flags,
    ]);
  }
}

export class GetKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_kakao_template',
      description: 'Get a single Kakao template by id.',
      inputSchema: {
        type: 'object',
        properties: { templateId: { type: 'string' }, ...profileProp },
        required: ['templateId'],
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'template', 'get', String(args.templateId),
    ]);
  }
}

export class ListKakaoTemplateCategoriesTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_template_categories',
      description: 'List available Kakao template categories.',
      inputSchema: { type: 'object', properties: profileProp },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'template', 'categories',
    ]);
  }
}

export class GetKakaoTemplateSendableTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_kakao_template_sendable',
      description: 'Check whether a Kakao template can be sent (filterable by channelId/templateId/senderKey/templateCode).',
      inputSchema: {
        type: 'object',
        properties: {
          channelId: { type: 'string' },
          templateId: { type: 'string' },
          senderKey: { type: 'string' },
          templateCode: { type: 'string' },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--channel-id': args.channelId,
      '--template-id': args.templateId,
      '--sender-key': args.senderKey,
      '--template-code': args.templateCode,
    });
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'template', 'sendable', ...flags,
    ]);
  }
}

export class ListKakaoBrandTemplatesTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'list_kakao_brand_templates',
      description: 'List Kakao brand templates. Status values: ACTIVE, INACTIVE, DELETED.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          channelId: { type: 'string' },
          channelGroupId: { type: 'string' },
          brandTemplateId: { type: 'string' },
          chatBubbleType: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DELETED'] },
          startKey: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 500 },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--name': args.name,
      '--channel-id': args.channelId,
      '--channel-group-id': args.channelGroupId,
      '--brand-template-id': args.brandTemplateId,
      '--chat-bubble-type': args.chatBubbleType,
      '--status': args.status,
      '--start-key': args.startKey,
      '--limit': args.limit,
    });
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'brand-template', 'list', ...flags,
    ]);
  }
}

export class GetKakaoBrandTemplateSendableTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'get_kakao_brand_template_sendable',
      description: 'Check whether a Kakao brand template can be sent.',
      inputSchema: {
        type: 'object',
        properties: {
          channelId: { type: 'string' },
          brandTemplateId: { type: 'string' },
          ...profileProp,
        },
      },
    };
  }
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const flags = buildFlags({
      '--channel-id': args.channelId,
      '--brand-template-id': args.brandTemplateId,
    });
    return execAsJsonTool([
      ...buildGlobalFlags({ profile: args.profile as string | undefined }),
      'kakao', 'brand-template', 'sendable', ...flags,
    ]);
  }
}
