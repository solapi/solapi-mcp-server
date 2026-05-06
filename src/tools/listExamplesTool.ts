import type { ManifestStore } from '../core/manifestLoader.js';
import type { Sdk } from '../types/manifest.js';
import type { Tool, ToolDefinition, ToolResult } from '../types/index.js';

const SDKS: Sdk[] = ['nodejs', 'python', 'go', 'php', 'java', 'asp'];

export class ListExamplesTool implements Tool {
  constructor(private store: ManifestStore) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'list_examples',
      description:
        'List SOLAPI SDK examples synced from official SDK repositories. Returns lightweight catalog entries (id, sdk, language, category, title, htmlUrl). Use the returned id with get_example to fetch full source code. Filter by sdk and/or category, or pass q for substring match against title/path/category.',
      inputSchema: {
        type: 'object',
        properties: {
          sdk: {
            type: 'string',
            enum: SDKS,
            description: 'Filter by SDK (nodejs, python, go, php, java, asp).',
          },
          category: {
            type: 'string',
            description:
              'Filter by category key (e.g. "sms", "kakao/send", "voice", "webhook"). Use list_examples without filters first to see available categories.',
          },
          q: {
            type: 'string',
            description: 'Substring match against title, path, id, or category (case-insensitive).',
          },
          limit: {
            type: 'number',
            description: 'Max number of entries to return (default: 50).',
            minimum: 1,
            maximum: 500,
            default: 50,
          },
        },
      },
    };
  }

  async execute(args: Record<string, unknown> = {}): Promise<ToolResult> {
    const sdk = args.sdk as Sdk | undefined;
    const category = args.category as string | undefined;
    const q = args.q as string | undefined;
    const limit = (args.limit as number | undefined) ?? 50;

    const filter: Parameters<ManifestStore['list']>[0] = { limit };
    if (sdk) filter.sdk = sdk;
    if (category) filter.category = category;
    if (q) filter.q = q;
    const items = this.store.list(filter);

    const summary = {
      total: items.length,
      manifest: this.store.meta(),
      examples: items.map((e) => ({
        id: e.id,
        sdk: e.sdk,
        version: e.version,
        language: e.language,
        category: e.category,
        title: e.title,
        path: e.path,
        htmlUrl: e.htmlUrl,
      })),
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  }
}
