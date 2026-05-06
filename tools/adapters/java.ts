import type { Language, ManifestExample } from '../../src/types/manifest.js';
import { htmlUrl, rawUrl } from '../github.js';
import type { SdkAdapter } from './types.js';
import { IdAllocator, fileStem, kebab, titleCase } from './util.js';

const CONTROLLER_RE =
  /^(?<demo>gradle|kotlin|maven)-spring-demo\/src\/main\/(?:java|kotlin)\/.*\/(?:Kakao)?ExampleController\.(?<ext>java|kt)$/;

export const javaAdapter: SdkAdapter = {
  sdk: 'java',
  repo: { owner: 'solapi', name: 'solapi-java-examples' },

  build({ ref, tree }) {
    const ids = new IdAllocator();
    const out: ManifestExample[] = [];

    for (const entry of tree) {
      if (entry.type !== 'blob') continue;
      const m = CONTROLLER_RE.exec(entry.path);
      if (!m) continue;

      const demo = m.groups!.demo!;
      const stem = fileStem(entry.path);
      const language: Language = m.groups!.ext === 'kt' ? 'kotlin' : 'java';
      const category = stem.toLowerCase().includes('kakao') ? 'kakao' : 'general';
      const slug = `${demo}-${kebab(stem)}`;

      out.push({
        id: ids.allocate('java', slug, slug),
        sdk: 'java',
        repo: `${ref.owner}/${ref.name}`,
        ref: ref.sha,
        path: entry.path,
        rawUrl: rawUrl(ref, entry.path),
        htmlUrl: htmlUrl(ref, entry.path),
        language,
        category,
        title: `${titleCase(demo)} Spring Demo · ${titleCase(stem)}`,
      });
    }

    return out;
  },
};
