import type { ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, titleCase } from './util.js';

const PREFIX = 'examples/';
const INTEGRATION_DIR = 'examples/webhook/django_example';

export const pythonAdapter: SdkAdapter = {
  sdk: 'python',
  repo: { owner: 'solapi', name: 'solapi-python' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];
    let djangoSeen = false;

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      if (!entry.path.startsWith(PREFIX)) continue;

      if (entry.path.startsWith(INTEGRATION_DIR + '/')) {
        if (djangoSeen) continue;
        djangoSeen = true;
        out.push({
          id: ids.allocate('python', 'django-webhook', 'webhook-django-example'),
          sdk: 'python',
          repo: `${ref.owner}/${ref.name}`,
          ref: ref.sha,
          path: INTEGRATION_DIR,
          rawUrl: rawUrl(ref, `${INTEGRATION_DIR}/README.md`),
          htmlUrl: htmlUrl(ref, INTEGRATION_DIR),
          language: 'python',
          category: 'webhook/integration',
          title: 'Django Webhook Integration Example',
        });
        continue;
      }

      if (!entry.path.endsWith('.py')) continue;

      const rel = entry.path.slice(PREFIX.length);
      const segments = rel.split('/');
      if (segments.length < 2) continue;

      const stem = fileStem(rel);
      const dirSegments = segments.slice(0, -1);
      const category = dirSegments.join('/');
      const fallback = `${dirSegments.join('-')}-${stem}`;

      out.push({
        id: ids.allocate('python', stem, fallback),
        sdk: 'python',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: entry.path,
        rawUrl: rawUrl(ref, entry.path),
        htmlUrl: htmlUrl(ref, entry.path),
        language: 'python',
        category,
        title: titleCase(stem),
      });
    }

    return out;
  },
};
