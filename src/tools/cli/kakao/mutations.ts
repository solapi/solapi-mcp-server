import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { errorResult } from '../base.js';
import { buildFlags } from '../argBuilder.js';
import { executeMutation, mutationCommonProps, type MutationCommonArgs } from '../mutationBase.js';

const stringFields: Record<string, { type: 'string'; description?: string }> = {
  channelId: { type: 'string' },
  channelGroupId: { type: 'string' },
  name: { type: 'string' },
  content: { type: 'string' },
  categoryCode: { type: 'string' },
  buttons: { type: 'string', description: 'JSON array string.' },
  quickReplies: { type: 'string', description: 'JSON array string.' },
  messageType: { type: 'string', description: 'BA / EX / AD / MI' },
  emphasizeType: { type: 'string', description: 'NONE / TEXT / IMAGE / ITEM_LIST' },
  header: { type: 'string' },
  highlight: { type: 'string', description: 'JSON object string.' },
  item: { type: 'string', description: 'JSON object string.' },
  extra: { type: 'string' },
  ad: { type: 'string', description: 'Advertising notice text.' },
  emphasizeTitle: { type: 'string' },
  emphasizeSubtitle: { type: 'string' },
  imageId: { type: 'string' },
};

function templateFlags(args: Record<string, unknown>): Record<string, unknown> {
  return {
    '--channel-id': args.channelId,
    '--channel-group-id': args.channelGroupId,
    '--name': args.name,
    '--content': args.content,
    '--category-code': args.categoryCode,
    '--buttons': args.buttons,
    '--quick-replies': args.quickReplies,
    '--message-type': args.messageType,
    '--emphasize-type': args.emphasizeType,
    '--header': args.header,
    '--highlight': args.highlight,
    '--item': args.item,
    '--extra': args.extra,
    '--ad': args.ad,
    '--emphasize-title': args.emphasizeTitle,
    '--emphasize-subtitle': args.emphasizeSubtitle,
    '--security-flag': args.securityFlag,
    '--image-id': args.imageId,
  };
}

export class CreateKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'create_kakao_template',
      description:
        'Create a Kakao alimtalk template. Either channelId or channelGroupId is required. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          ...stringFields,
          securityFlag: { type: 'boolean' },
          ...mutationCommonProps,
        },
        required: ['name', 'content', 'categoryCode'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    if (!args.channelId && !args.channelGroupId) {
      return errorResult('channelId 또는 channelGroupId 중 하나는 지정해야 합니다.');
    }
    const flags = buildFlags(templateFlags(args));
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'create', ...flags],
      { action: 'create_kakao_template', details: { ...args, confirmed: undefined } },
    );
  }
}

export class UpdateKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'update_kakao_template',
      description: 'Update a Kakao alimtalk template by id. Only provided fields are changed. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          templateId: { type: 'string' },
          ...stringFields,
          securityFlag: { type: 'boolean' },
          ...mutationCommonProps,
        },
        required: ['templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    const flags = buildFlags(templateFlags(args));
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'update', templateId, ...flags],
      { action: 'update_kakao_template', details: { templateId, ...args, confirmed: undefined } },
    );
  }
}

export class DeleteKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'delete_kakao_template',
      description: 'Delete a Kakao alimtalk template by id. solactl is invoked with --yes. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          templateId: { type: 'string' },
          ...mutationCommonProps,
        },
        required: ['templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'delete', templateId, '--yes'],
      { action: 'delete_kakao_template', details: { templateId } },
      { jsonOutput: false },
    );
  }
}

export class InspectKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'inspect_kakao_template',
      description: 'Submit a Kakao alimtalk template for review. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          templateId: { type: 'string' },
          comment: { type: 'string' },
          ...mutationCommonProps,
        },
        required: ['templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    const flags = buildFlags({ '--comment': args.comment });
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'inspect', templateId, ...flags],
      { action: 'inspect_kakao_template', details: { templateId, comment: args.comment } },
    );
  }
}

export class CancelInspectKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'cancel_inspect_kakao_template',
      description: 'Cancel an in-progress Kakao alimtalk template review. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: { templateId: { type: 'string' }, ...mutationCommonProps },
        required: ['templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'cancel-inspect', templateId],
      { action: 'cancel_inspect_kakao_template', details: { templateId } },
    );
  }
}

export class ReleaseDormantKakaoTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'release_dormant_kakao_template',
      description: 'Release a dormant Kakao alimtalk template. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: { templateId: { type: 'string' }, ...mutationCommonProps },
        required: ['templateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const templateId = (args.templateId as string | undefined)?.trim();
    if (!templateId) return errorResult('templateId가 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'template', 'release-dormant', templateId],
      { action: 'release_dormant_kakao_template', details: { templateId } },
    );
  }
}

// ─── Brand Templates ────────────────────────────────────────────────

const brandStringFields: Record<string, { type: 'string'; description?: string }> = {
  channelId: { type: 'string' },
  channelGroupId: { type: 'string' },
  chatBubbleType: { type: 'string', description: 'TEXT/IMAGE/WIDE/WIDE_ITEM_LIST/CAROUSEL_FEED/PREMIUM_VIDEO/COMMERCE/CAROUSEL_COMMERCE' },
  name: { type: 'string' },
  content: { type: 'string' },
  header: { type: 'string' },
  imageId: { type: 'string' },
  imageLink: { type: 'string' },
  additionalContent: { type: 'string' },
  carousel: { type: 'string', description: 'JSON object string.' },
  mainWideItem: { type: 'string', description: 'JSON object string.' },
  subWideItemList: { type: 'string', description: 'JSON array string.' },
  video: { type: 'string', description: 'JSON object string.' },
  commerce: { type: 'string', description: 'JSON object string.' },
  buttons: { type: 'string', description: 'JSON array string.' },
  coupon: { type: 'string', description: 'JSON object string.' },
};

function brandTemplateFlags(args: Record<string, unknown>): Record<string, unknown> {
  return {
    '--channel-id': args.channelId,
    '--channel-group-id': args.channelGroupId,
    '--chat-bubble-type': args.chatBubbleType,
    '--name': args.name,
    '--content': args.content,
    '--adult': args.adult,
    '--header': args.header,
    '--image-id': args.imageId,
    '--image-link': args.imageLink,
    '--additional-content': args.additionalContent,
    '--carousel': args.carousel,
    '--main-wide-item': args.mainWideItem,
    '--sub-wide-item-list': args.subWideItemList,
    '--video': args.video,
    '--commerce': args.commerce,
    '--buttons': args.buttons,
    '--coupon': args.coupon,
  };
}

export class CreateKakaoBrandTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'create_kakao_brand_template',
      description: 'Create a Kakao brand template. Either channelId or channelGroupId is required. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          ...brandStringFields,
          adult: { type: 'boolean' },
          ...mutationCommonProps,
        },
        required: ['chatBubbleType'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    if (!args.channelId && !args.channelGroupId) {
      return errorResult('channelId 또는 channelGroupId 중 하나는 지정해야 합니다.');
    }
    const flags = buildFlags(brandTemplateFlags(args));
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'brand-template', 'create', ...flags],
      { action: 'create_kakao_brand_template', details: { ...args, confirmed: undefined } },
    );
  }
}

export class UpdateKakaoBrandTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'update_kakao_brand_template',
      description: 'Update a Kakao brand template by id. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: {
          brandTemplateId: { type: 'string' },
          ...brandStringFields,
          adult: { type: 'boolean' },
          ...mutationCommonProps,
        },
        required: ['brandTemplateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const brandTemplateId = (args.brandTemplateId as string | undefined)?.trim();
    if (!brandTemplateId) return errorResult('brandTemplateId가 비어 있습니다.');
    const flags = buildFlags(brandTemplateFlags(args));
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'brand-template', 'update', brandTemplateId, ...flags],
      { action: 'update_kakao_brand_template', details: { brandTemplateId, ...args, confirmed: undefined } },
    );
  }
}

export class DeleteKakaoBrandTemplateTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'delete_kakao_brand_template',
      description: 'Delete a Kakao brand template by id. solactl is invoked with --yes. SAFETY: requires confirmed=true.',
      inputSchema: {
        type: 'object',
        properties: { brandTemplateId: { type: 'string' }, ...mutationCommonProps },
        required: ['brandTemplateId'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const brandTemplateId = (args.brandTemplateId as string | undefined)?.trim();
    if (!brandTemplateId) return errorResult('brandTemplateId가 비어 있습니다.');
    return executeMutation(
      args as MutationCommonArgs,
      ['kakao', 'brand-template', 'delete', brandTemplateId, '--yes'],
      { action: 'delete_kakao_brand_template', details: { brandTemplateId } },
      { jsonOutput: false },
    );
  }
}
