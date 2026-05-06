import type { ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, titleCase } from './util.js';

const V1_PREFIX = '_examples/';
const V2_PREFIX = 'v2/_examples/';

const V1_CATEGORY_FIX: Record<string, string> = {
  cash: 'balance',
  group: 'groups',
  message: 'messages',
  stroage: 'storage',
  storage: 'storage',
};

export const goAdapter: SdkAdapter = {
  sdk: 'go',
  repo: { owner: 'solapi', name: 'solapi-go' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      if (!entry.path.endsWith('.go')) continue;

      if (entry.path.startsWith(V2_PREFIX)) {
        if (!entry.path.endsWith('/main.go')) continue;
        const rel = entry.path.slice(V2_PREFIX.length);
        const segments = rel.split('/');
        if (segments.length < 2) continue;
        const category = segments[0]!;
        const featureDir = segments[segments.length - 2]!;
        const fallback = `${category}-${featureDir}`;

        out.push({
          id: ids.allocate('go-v2', featureDir, fallback),
          sdk: 'go',
          version: 'v2',
          repo: `${ref.owner}/${ref.name}`,
          ref: ref.sha,
          path: entry.path,
          rawUrl: rawUrl(ref, entry.path),
          htmlUrl: htmlUrl(ref, entry.path),
          language: 'go',
          category,
          title: titleCase(featureDir),
        });
        continue;
      }

      if (entry.path.startsWith(V1_PREFIX)) {
        const rel = entry.path.slice(V1_PREFIX.length);
        const segments = rel.split('/');
        if (segments.length < 2) continue;
        const rawCategory = segments[0]!.toLowerCase();
        const category = V1_CATEGORY_FIX[rawCategory] ?? rawCategory;
        const stem = fileStem(rel);
        const fallback = `${category}-${stem}`;

        out.push({
          id: ids.allocate('go-v1', stem, fallback),
          sdk: 'go',
          version: 'v1',
          repo: `${ref.owner}/${ref.name}`,
          ref: ref.sha,
          path: entry.path,
          rawUrl: rawUrl(ref, entry.path),
          htmlUrl: htmlUrl(ref, entry.path),
          language: 'go',
          category,
          title: titleCase(stem),
        });
      }
    }

    return out;
  },
};
