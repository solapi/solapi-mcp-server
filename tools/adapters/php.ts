import type { ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, titleCase } from './util.js';

const BASIC_PREFIX = 'basic-example/src/';
const LARAVEL_DIR = 'laravel-example';

export const phpAdapter: SdkAdapter = {
  sdk: 'php',
  repo: { owner: 'solapi', name: 'solapi-php-examples' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];

    const hasLaravel = tree.some(
      (e) => e.type === 'tree' && e.path === LARAVEL_DIR,
    );
    if (hasLaravel) {
      out.push({
        id: ids.allocate('php', 'laravel-integration', 'laravel-example'),
        sdk: 'php',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: LARAVEL_DIR,
        rawUrl: rawUrl(ref, `${LARAVEL_DIR}/README.md`),
        htmlUrl: htmlUrl(ref, LARAVEL_DIR),
        language: 'php',
        category: 'integration',
        title: 'Laravel Integration Example',
      });
    }

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      if (!entry.path.startsWith(BASIC_PREFIX)) continue;
      if (!entry.path.endsWith('.php')) continue;

      const rel = entry.path.slice(BASIC_PREFIX.length);
      const segments = rel.split('/');
      if (segments.length < 2) continue;

      const stem = fileStem(rel);
      const dirSegments = segments.slice(0, -1);
      const category = dirSegments.join('/');
      const fallback = `${dirSegments.join('-')}-${stem}`;

      out.push({
        id: ids.allocate('php', stem, fallback),
        sdk: 'php',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: entry.path,
        rawUrl: rawUrl(ref, entry.path),
        htmlUrl: htmlUrl(ref, entry.path),
        language: 'php',
        category,
        title: titleCase(stem),
      });
    }

    return out;
  },
};
