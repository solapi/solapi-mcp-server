import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Manifest, ManifestExample, Sdk } from '../types/manifest.js';

export interface ListFilter {
  sdk?: Sdk;
  category?: string;
  q?: string;
  limit?: number;
}

export class ManifestStore {
  private examples: Map<string, ManifestExample> = new Map();
  private generatedAt = '';

  load(): void {
    const path = resolveManifestPath();
    const raw = readFileSync(path, 'utf8');
    const data = JSON.parse(raw) as Manifest;
    if (data.schemaVersion !== 1) {
      throw new Error(`Unsupported manifest schemaVersion: ${data.schemaVersion}`);
    }
    this.examples.clear();
    for (const e of data.examples) this.examples.set(e.id, e);
    this.generatedAt = data.generatedAt;
  }

  size(): number {
    return this.examples.size;
  }

  meta(): { generatedAt: string; total: number } {
    return { generatedAt: this.generatedAt, total: this.examples.size };
  }

  get(id: string): ManifestExample | undefined {
    return this.examples.get(id);
  }

  list(filter: ListFilter = {}): ManifestExample[] {
    const q = filter.q?.trim().toLowerCase();
    const results: ManifestExample[] = [];
    for (const e of this.examples.values()) {
      if (filter.sdk && e.sdk !== filter.sdk) continue;
      if (filter.category && e.category !== filter.category) continue;
      if (q && !matchesQuery(e, q)) continue;
      results.push(e);
      if (filter.limit && results.length >= filter.limit) break;
    }
    return results;
  }

  categories(sdk?: Sdk): Map<string, number> {
    const counts = new Map<string, number>();
    for (const e of this.examples.values()) {
      if (sdk && e.sdk !== sdk) continue;
      const key = e.category ?? '(uncategorized)';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }
}

function matchesQuery(e: ManifestExample, q: string): boolean {
  if (e.title.toLowerCase().includes(q)) return true;
  if (e.path.toLowerCase().includes(q)) return true;
  if (e.id.toLowerCase().includes(q)) return true;
  if (e.category && e.category.toLowerCase().includes(q)) return true;
  return false;
}

function resolveManifestPath(): string {
  if (process.env.SOLAPI_MANIFEST_PATH) return process.env.SOLAPI_MANIFEST_PATH;

  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, 'manifest.json'),
    resolve(here, '../manifest.json'),
    resolve(here, '../../dist/manifest.json'),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(
    `manifest.json not found. Run \`npm run sync\` first. Searched: ${candidates.join(', ')}`,
  );
}
