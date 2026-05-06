import type { SdkAdapter } from './adapters/types.js';

export interface RepoRef {
  owner: string;
  name: string;
  defaultBranch: string;
  sha: string;
}

export interface TreeEntry {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
}

const API = 'https://api.github.com';

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'solapi-mcp-server-sync',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function resolveRepo(
  owner: string,
  name: string,
): Promise<RepoRef> {
  const repo = await gh<{ default_branch: string }>(`/repos/${owner}/${name}`);
  const branch = await gh<{ commit: { sha: string } }>(
    `/repos/${owner}/${name}/branches/${repo.default_branch}`,
  );
  return {
    owner,
    name,
    defaultBranch: repo.default_branch,
    sha: branch.commit.sha,
  };
}

export async function fetchTree(ref: RepoRef): Promise<TreeEntry[]> {
  const data = await gh<{ tree: TreeEntry[]; truncated: boolean }>(
    `/repos/${ref.owner}/${ref.name}/git/trees/${ref.sha}?recursive=1`,
  );
  if (data.truncated) {
    throw new Error(
      `Tree truncated for ${ref.owner}/${ref.name} — repo too large for single fetch`,
    );
  }
  return data.tree;
}

export function rawUrl(ref: RepoRef, path: string): string {
  return `https://raw.githubusercontent.com/${ref.owner}/${ref.name}/${ref.sha}/${path}`;
}

export function htmlUrl(ref: RepoRef, path: string): string {
  return `https://github.com/${ref.owner}/${ref.name}/blob/${ref.defaultBranch}/${path}`;
}

export type { SdkAdapter };
