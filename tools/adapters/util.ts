import { basename } from 'node:path';

export function fileStem(path: string): string {
  const b = basename(path);
  const dot = b.lastIndexOf('.');
  return dot > 0 ? b.slice(0, dot) : b;
}

export function kebab(slug: string): string {
  return slug
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

export function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export class IdAllocator {
  private taken = new Set<string>();

  allocate(prefix: string, basenameSlug: string, fallback: string): string {
    const primary = `${prefix}:${basenameSlug}`;
    if (!this.taken.has(primary)) {
      this.taken.add(primary);
      return primary;
    }
    const next = `${prefix}:${fallback}`;
    if (!this.taken.has(next)) {
      this.taken.add(next);
      return next;
    }
    let n = 2;
    while (this.taken.has(`${next}-${n}`)) n++;
    const final = `${next}-${n}`;
    this.taken.add(final);
    return final;
  }
}
