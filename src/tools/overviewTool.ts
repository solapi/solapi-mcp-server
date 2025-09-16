import type { ICacheManager, Tool, ToolResult, OverviewArgs } from '../types/index.js';

/**
 * 개요 도구 클래스
 */
export class OverviewTool implements Tool {
  private cache: ICacheManager;

  constructor(cache: ICacheManager) {
    this.cache = cache;
  }

  /**
   * 도구 정의 반환
   */
  getDefinition() {
    return {
      name: 'get-solapi-overview',
      description: 'SOLAPI 서비스 전체 개요를 제공합니다',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: '특정 카테고리 개요 (선택사항)',
            enum: ['messaging', 'authentication', 'sdk', 'integration']
          }
        },
      },
    };
  }

  /**
   * 개요 실행
   * @param args - 도구 인수
   * @returns 개요 결과
   */
  async execute(args: Record<string, unknown> = {}): Promise<ToolResult> {
    const { category } = args as OverviewArgs;
    const cacheKey = `overview:${category || 'all'}`;
    let overview = this.cache.get(cacheKey) as ToolResult;

    if (!overview) {
      const overviewText = category 
        ? this.getCategoryOverview(category)
        : this.getGeneralOverview();

      overview = {
        content: [{
          type: 'text',
          text: overviewText
        }]
      };

      this.cache.set(cacheKey, overview);
    }

    return overview;
  }

  /**
   * 일반 개요 생성
   */
  private getGeneralOverview(): string {
    return `# SOLAPI 개발자 문서 개요

**SOLAPI**는 15년 이상의 경험을 바탕으로 다양한 메시징 서비스를 REST API와 SDK로 제공하는 종합 플랫폼입니다.

## 주요 서비스
- **SMS/LMS/MMS**: 단문/장문/멀티미디어 메시지 발송
- **카카오톡**: 알림톡(ATA), 친구톡(CTA), 이미지 친구톡(CTI)
- **API 인증**: API Key, OAuth2 인증 지원
- **SDK**: Node.js, Java, PHP, Python, C#, Go, Ruby 지원

## 주요 기능
- 메시지 발송/조회/통계
- 예약 발송, 대체 발송
- 웹훅 지원
- 파일 업로드/관리
- 잔액/한도 관리

## 검색 기능
이 MCP 서버는 **고급 검색 엔진**을 사용하여:
- **TF-IDF 알고리즘** 기반 관련도 점수 계산
- **인덱스 기반** 빠른 검색 (O(1) 접근)
- **가중치 적용** (제목 2배, 키워드 1.5배)
- **캐싱 시스템**으로 반복 검색 최적화

💡 **사용법**: \`search-solapi-docs\` 도구로 특정 키워드를 검색해보세요!`;
  }

  /**
   * 카테고리별 개요 생성
   */
  private getCategoryOverview(category: string): string {
    const categoryMap: Record<string, string> = {
      messaging: `# SOLAPI 메시징 서비스

## SMS/LMS/MMS
- **SMS**: 90바이트 제한, 건당 15원
- **LMS**: 2000바이트 제한, 제목 포함
- **MMS**: 이미지/동영상 첨부 가능

## 카카오톡 서비스
- **알림톡(ATA)**: 사전 승인 템플릿, 무료 발송
- **친구톡(CTA)**: 채널 친구 대상 광고 메시지
- **이미지 친구톡(CTI)**: 이미지 첨부 친구톡`,

      authentication: `# SOLAPI 인증 방식

## API Key 인증
- HMAC-SHA256/MD5 서명 기반
- API Key + API Secret 사용
- Authorization 헤더 필수

## OAuth2 인증
- Access Token + Refresh Token
- 토큰 자동 갱신 지원
- 사용자별 권한 관리`,

      sdk: `# SOLAPI SDK

## 지원 언어
- **Node.js**: npm 패키지, JavaScript 지원
- **Java**: Maven/Gradle 지원
- **PHP**: Composer 패키지
- **Python**: pip 패키지
- **C#**: NuGet 패키지
- **Go**: go get 지원
- **Ruby**: gem 패키지`,

      integration: `# SOLAPI 연동 기능

## 웹훅
- 실시간 발송 결과 수신
- 성공/실패 상태 전달
- 수신 확인 이벤트

## 파일 관리
- 이미지/동영상 업로드
- 템플릿 관리
- 대량 발송 지원`
    };

    return categoryMap[category] || this.getGeneralOverview();
  }
}
