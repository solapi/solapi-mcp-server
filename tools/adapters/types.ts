import type { ManifestExample } from '../../src/types/manifest.js';
import type { RepoRef, TreeEntry } from '../github.js';

export interface AdapterContext {
  ref: RepoRef;
  tree: TreeEntry[];
}

export interface SdkAdapter {
  sdk: string;
  repo: { owner: string; name: string };
  build(ctx: AdapterContext): ManifestExample[];
}
