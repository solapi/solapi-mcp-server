import type { ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, titleCase } from './util.js';

const PREFIX = 'examples/javascript/common/src/';
const NEXTJS_DIR = 'examples/nextjs';

export const nodejsAdapter: SdkAdapter = {
  sdk: 'nodejs',
  repo: { owner: 'solapi', name: 'solapi-nodejs' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];
    const hasNextjs = tree.some(
      (e) => e.type === 'tree' && e.path === NEXTJS_DIR,
    );

    if (hasNextjs) {
      out.push({
        id: ids.allocate('nodejs', 'nextjs-integration', 'nextjs-example'),
        sdk: 'nodejs',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: NEXTJS_DIR,
        rawUrl: rawUrl(ref, `${NEXTJS_DIR}/README.md`),
        htmlUrl: htmlUrl(ref, NEXTJS_DIR),
        language: 'javascript',
        category: 'integration',
        title: 'Next.js Integration Example',
      });
    }

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      if (!entry.path.startsWith(PREFIX)) continue;
      if (!entry.path.endsWith('.js')) continue;

      const rel = entry.path.slice(PREFIX.length);
      const segments = rel.split('/');
      if (segments.length < 2) continue;

      const stem = fileStem(rel);
      const dirSegments = segments.slice(0, -1);
      const category = dirSegments.join('/');
      const fallback = `${dirSegments.join('-')}-${stem}`;

      out.push({
        id: ids.allocate('nodejs', stem, fallback),
        sdk: 'nodejs',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: entry.path,
        rawUrl: rawUrl(ref, entry.path),
        htmlUrl: htmlUrl(ref, entry.path),
        language: 'javascript',
        category,
        title: titleCase(stem),
      });
    }

    return out;
  },
};
