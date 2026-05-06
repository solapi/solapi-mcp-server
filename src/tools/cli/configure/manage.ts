import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { errorResult, execAsJsonTool, execAsTextTool, validateProfileName } from '../base.js';

export class ConfigureListTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'configure_list',
      description:
        'List all SOLAPI credential profiles saved in ~/.solactl/credentials.json. The active profile is marked with `*`. API secrets are masked.',
      inputSchema: { type: 'object', properties: {} },
    };
  }

  async execute(): Promise<ToolResult> {
    return execAsJsonTool(['configure', 'list']);
  }
}

export class ConfigureShowTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'configure_show',
      description:
        'Show the credentials of a single profile (active by default). API secret is masked.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'string', description: 'Profile name. Defaults to active profile.' },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const profile = (args.profile as string | undefined)?.trim();
    if (profile) {
      const err = validateProfileName(profile);
      if (err) return errorResult(err);
    }
    const cliArgs = profile ? ['--profile', profile, 'configure', 'show'] : ['configure', 'show'];
    return execAsJsonTool(cliArgs);
  }
}

export class ConfigureUseTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'configure_use',
      description: 'Switch the active SOLAPI credential profile.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'string', description: 'Profile name to activate.' },
        },
        required: ['profile'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const profile = (args.profile as string | undefined)?.trim();
    if (!profile) return errorResult('profile이 비어 있습니다.');
    const err = validateProfileName(profile);
    if (err) return errorResult(err);
    return execAsTextTool(['configure', 'use', profile]);
  }
}

export class ConfigureDeleteTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'configure_delete',
      description: 'Delete a saved SOLAPI credential profile.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'string', description: 'Profile name to delete.' },
        },
        required: ['profile'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const profile = (args.profile as string | undefined)?.trim();
    if (!profile) return errorResult('profile이 비어 있습니다.');
    const err = validateProfileName(profile);
    if (err) return errorResult(err);
    return execAsTextTool(['configure', 'delete', profile]);
  }
}
