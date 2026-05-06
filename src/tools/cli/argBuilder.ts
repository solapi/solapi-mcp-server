/**
 * MCP 도구 입력에서 solactl CLI 인자를 만든다.
 *
 * - undefined / null / 빈 문자열은 생략.
 * - boolean true는 플래그만, false는 생략.
 * - number는 문자열로.
 */
export function buildFlags(map: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [flag, raw] of Object.entries(map)) {
    if (raw === undefined || raw === null || raw === '') continue;
    if (typeof raw === 'boolean') {
      if (raw) out.push(flag);
      continue;
    }
    if (typeof raw === 'number') {
      out.push(flag, String(raw));
      continue;
    }
    if (typeof raw === 'string') {
      out.push(flag, raw);
      continue;
    }
    throw new Error(`buildFlags: unsupported value type for ${flag}: ${typeof raw}`);
  }
  return out;
}

/** profile / timeout 같은 글로벌 플래그를 명령 앞에 붙인다. */
export function buildGlobalFlags(args: { profile?: string | undefined; timeoutSec?: number | undefined }): string[] {
  return buildFlags({
    '--profile': args.profile,
    '--timeout': args.timeoutSec ? `${args.timeoutSec}s` : undefined,
  });
}
