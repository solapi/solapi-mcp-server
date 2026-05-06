import type { Tool, ToolDefinition, ToolResult } from '../../../types/index.js';
import { runSolactl } from '../../../exec/solactlRunner.js';
import { errorResult, textResult, validateProfileName } from '../base.js';

export class ConfigureSetupTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'configure_setup',
      description:
        'Save SOLAPI API credentials by running `solactl configure` non-interactively. Creates or overwrites a profile in ~/.solactl/credentials.json. The profile becomes available for subsequent send_*/list_* tools via the optional `profile` argument.',
      inputSchema: {
        type: 'object',
        properties: {
          apiKey: {
            type: 'string',
            description: 'SOLAPI API Key from https://console.solapi.com',
          },
          apiSecret: {
            type: 'string',
            description: 'SOLAPI API Secret.',
          },
          profile: {
            type: 'string',
            description: 'Profile name (alphanumeric, underscore, hyphen; max 64 chars). Defaults to "default".',
          },
        },
        required: ['apiKey', 'apiSecret'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const apiKey = (args.apiKey as string | undefined)?.trim();
    const apiSecret = (args.apiSecret as string | undefined)?.trim();
    const profile = (args.profile as string | undefined)?.trim();

    if (!apiKey) return errorResult('apiKey가 비어 있습니다.');
    if (!apiSecret) return errorResult('apiSecret이 비어 있습니다.');
    if (profile) {
      const err = validateProfileName(profile);
      if (err) return errorResult(err);
    }

    const cliArgs = ['configure', '--api-key', apiKey, '--api-secret', apiSecret];
    if (profile) cliArgs.push('--profile', profile);

    const result = await runSolactl({ args: cliArgs });
    if (result.exitCode !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.exitCode}`;
      return errorResult(`configure 실패: ${detail}`);
    }
    return textResult(result.stdout.trim() || `프로필 '${profile ?? 'default'}'이 저장되었습니다.`);
  }
}
