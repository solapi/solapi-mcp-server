import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Manifest, ManifestExample } from '../src/types/manifest.js';
import { fetchTree, resolveRepo } from './github.js';
import type { SdkAdapter } from './adapters/types.js';
import { aspAdapter } from './adapters/asp.js';
import { goAdapter } from './adapters/go.js';
import { javaAdapter } from './adapters/java.js';
import { nodejsAdapter } from './adapters/nodejs.js';
import { phpAdapter } from './adapters/php.js';
import { pythonAdapter } from './adapters/python.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../dist/manifest.json');

const adapters: SdkAdapter[] = [
  nodejsAdapter,
  pythonAdapter,
  goAdapter,
  phpAdapter,
  javaAdapter,
  aspAdapter,
];

async function main(): Promise<void> {
  const examples: ManifestExample[] = [];

  for (const adapter of adapters) {
    const { owner, name } = adapter.repo;
    process.stderr.write(`[sync] ${adapter.sdk}: ${owner}/${name} ... `);
    const ref = await resolveRepo(owner, name);
    const tree = await fetchTree(ref);
    const built = adapter.build({ ref, tree });
    examples.push(...built);
    process.stderr.write(`${built.length} examples (ref ${ref.sha.slice(0, 7)})\n`);
  }

  const manifest: Manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    examples,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(manifest, null, 2));
  process.stderr.write(`[sync] wrote ${examples.length} examples → ${OUT}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`[sync] failed: ${(err as Error).message}\n`);
  process.exit(1);
});
