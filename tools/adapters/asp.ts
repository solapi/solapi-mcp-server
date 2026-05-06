import type { ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, titleCase } from './util.js';

const PREFIX = 'examples/';

export const aspAdapter: SdkAdapter = {
  sdk: 'asp',
  repo: { owner: 'solapi', name: 'solapi-asp' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      if (!entry.path.startsWith(PREFIX)) continue;
      if (!entry.path.endsWith('.asp')) continue;

      const stem = fileStem(entry.path);

      out.push({
        id: ids.allocate('asp', stem, stem),
        sdk: 'asp',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: entry.path,
        rawUrl: rawUrl(ref, entry.path),
        htmlUrl: htmlUrl(ref, entry.path),
        language: 'asp',
        title: titleCase(stem),
      });
    }

    return out;
  },
};
