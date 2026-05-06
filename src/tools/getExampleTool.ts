import type { ExampleFetcher } from '../core/exampleFetcher.js';
import type { ManifestStore } from '../core/manifestLoader.js';
import type { Tool, ToolDefinition, ToolResult } from '../types/index.js';

export class GetExampleTool implements Tool {
  constructor(
    private store: ManifestStore,
    private fetcher: ExampleFetcher,
  ) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'get_example',
      description:
        'Fetch the full source code of a SOLAPI SDK example by id (as returned by list_examples). Returns the file contents along with metadata (sdk, language, category, htmlUrl). For Java/Kotlin Spring demos and Next.js/Laravel/Django integration entries, the id maps to a controller file or README; explore the htmlUrl directory for sibling files.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Example id from list_examples (e.g. "nodejs:send_sms").',
          },
        },
        required: ['id'],
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const id = args.id as string | undefined;
    if (!id) {
      return errorResult('Missing required argument: id');
    }
    const entry = this.store.get(id);
    if (!entry) {
      return errorResult(
        `Unknown example id: ${id}. Use list_examples to discover valid ids.`,
      );
    }

    try {
      const source = await this.fetcher.fetchText(entry.rawUrl);
      const header = [
        `# ${entry.title}`,
        `sdk: ${entry.sdk}${entry.version ? ` (${entry.version})` : ''}  language: ${entry.language}` +
          (entry.category ? `  category: ${entry.category}` : ''),
        `repo: ${entry.repo}@${entry.ref.slice(0, 7)}`,
        `path: ${entry.path}`,
        `view: ${entry.htmlUrl}`,
      ].join('\n');

      return {
        content: [
          { type: 'text', text: `${header}\n\n\`\`\`${entry.language}\n${source}\n\`\`\`` },
        ],
      };
    } catch (err) {
      return errorResult(`Failed to fetch example: ${(err as Error).message}`);
    }
  }
}

function errorResult(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
    isError: true,
  };
}
