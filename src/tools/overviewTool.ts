import type { ManifestStore } from '../core/manifestLoader.js';
import type { Sdk } from '../types/manifest.js';
import type {
  ICacheManager,
  OverviewArgs,
  Tool,
  ToolDefinition,
  ToolResult,
} from '../types/index.js';

const SDKS: Sdk[] = ['nodejs', 'python', 'go', 'php', 'java', 'asp'];

export class OverviewTool implements Tool {
  constructor(
    private cache: ICacheManager,
    private store: ManifestStore,
  ) {}

  getDefinition(): ToolDefinition {
    return {
      name: 'get-solapi-overview',
      description: 'SOLAPI 서비스 전체 개요와 SDK별 예제 카탈로그 통계를 제공합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: '특정 카테고리 개요 (선택사항)',
            enum: ['messaging', 'authentication', 'sdk', 'integration'],
          },
        },
      },
    };
  }

  async execute(args: Record<string, unknown> = {}): Promise<ToolResult> {
    const { category } = args as OverviewArgs;
    const cacheKey = `overview:${category ?? 'all'}`;
    const cached = this.cache.get(cacheKey) as ToolResult | null;
    if (cached) return cached;

    const text = category
      ? this.getCategoryOverview(category)
      : this.getGeneralOverview();
    const result: ToolResult = {
      content: [{ type: 'text', text }],
    };
    this.cache.set(cacheKey, result);
    return result;
  }

  private getGeneralOverview(): string {
    const lines = [
      '# SOLAPI 개발자 문서 개요',
      '',
      'SOLAPI는 SMS/LMS/MMS, 카카오 알림톡·친구톡·BMS, 음성 메시지 등 메시징 채널을 REST API와 SDK로 제공하는 플랫폼입니다.',
      '',
      '## SDK 예제 카탈로그',
      '`list_examples`/`get_example` 도구로 공식 SDK 저장소의 예제를 조회할 수 있습니다.',
      '',
    ];
    const meta = this.store.meta();
    lines.push(`- 총 ${meta.total}개 예제 (manifest generated ${meta.generatedAt})`);
    for (const sdk of SDKS) {
      const cats = this.store.categories(sdk);
      const count = [...cats.values()].reduce((a, b) => a + b, 0);
      if (count === 0) continue;
      const top = [...cats.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k, v]) => `${k}(${v})`)
        .join(', ');
      lines.push(`- **${sdk}**: ${count} — ${top}`);
    }
    return lines.join('\n');
  }

  private getCategoryOverview(category: string): string {
    const map: Record<string, string> = {
      messaging:
        '# SOLAPI 메시징\n\n- SMS: 90바이트 단문\n- LMS: 2000바이트 장문\n- MMS: 이미지/동영상 첨부\n- 알림톡(ATA): 사전 승인 템플릿, 정보성\n- 친구톡(CTA/CTI): 채널 친구 대상 광고\n- BMS: 카카오 비즈메시지 (Carousel/Wide/Commerce 등)',
      authentication:
        '# SOLAPI 인증\n\n- API Key (HMAC-SHA256) — 헤더 Authorization\n- OAuth2 — Access/Refresh Token',
      sdk:
        '# SOLAPI SDK\n\n공식 SDK: Node.js, Java/Kotlin, PHP, Python, Go, ASP, C#, VB.NET, Ruby, Rust, Elixir.\n예제는 `list_examples` 도구로 조회.',
      integration:
        '# SOLAPI 연동\n\n- 웹훅: 발송 결과/상태 콜백\n- 파일 업로드: MMS 이미지, 카카오 BMS 미디어\n- 통합 데모: Next.js, Django, Laravel, Spring (gradle/maven/kotlin)',
    };
    return map[category] ?? this.getGeneralOverview();
  }
}
