import type { Tool, ToolDefinition, ToolResult } from '../../types/index.js';
import { upgradeSolactl } from '../../installers/solactlInstaller.js';
import { errorResult, jsonResult } from './base.js';

export class UpgradeSolactlTool implements Tool {
  getDefinition(): ToolDefinition {
    return {
      name: 'upgrade_solactl',
      description:
        'Upgrade the bundled solactl binary to the latest GitHub release (or a specific version). Skipped if already up-to-date. Disabled when SOLAPI_MCP_SOLACTL_BIN is set.',
      inputSchema: {
        type: 'object',
        properties: {
          targetVersion: {
            type: 'string',
            description: 'Specific version to install (e.g. "0.1.6"). Omit for the latest GitHub release.',
          },
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const targetVersion = (args.targetVersion as string | undefined)?.trim().replace(/^v/, '');
    try {
      const result = await upgradeSolactl({
        ...(targetVersion ? { targetVersion } : {}),
        logger: (msg) => console.error(msg),
      });
      return jsonResult({
        ...result,
        message: result.changed
          ? `solactl을 ${result.fromVersion ?? '(미설치)'} → ${result.toVersion}로 업그레이드했습니다.`
          : `solactl이 이미 최신(${result.toVersion})입니다.`,
      });
    } catch (err) {
      return errorResult((err as Error).message);
    }
  }
}
