import type { ICacheManager } from '../types/index.js';

export class ExampleFetcher {
  constructor(private cache: ICacheManager) {}

  async fetchText(rawUrl: string): Promise<string> {
    const cached = this.cache.get(`raw:${rawUrl}`);
    if (typeof cached === 'string') return cached;

    const res = await fetch(rawUrl);
    if (!res.ok) {
      throw new Error(`fetch ${rawUrl} → ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    this.cache.set(`raw:${rawUrl}`, text);
    return text;
  }
}
