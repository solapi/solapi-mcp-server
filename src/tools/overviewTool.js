/**
 * 개요 도구 클래스
 */
export class OverviewTool {
  constructor(cache) {
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
        properties: {},
      },
    };
  }

  /**
   * 개요 실행
   * @returns {Promise<Object>} 개요 결과
   */
  async execute() {
    const cacheKey = 'overview';
    let overview = this.cache.get(cacheKey);

    if (!overview) {
      overview = {
        content: [{
          type: 'text',
          text: `# 🚀 SOLAPI 개발자 문서 개요

**SOLAPI**는 15년 이상의 경험을 바탕으로 다양한 메시징 서비스를 REST API와 SDK로 제공하는 종합 플랫폼입니다.

## 🎯 주요 서비스
- **📱 SMS/LMS/MMS**: 단문/장문/멀티미디어 메시지 발송
- **💬 카카오톡**: 알림톡(ATA), 친구톡(CTA), 이미지 친구톡(CTI)
- **🔐 API 인증**: API Key, OAuth2 인증 지원
- **⚡ SDK**: Node.js, Java, PHP, Python, C#, Go, Ruby 지원

## 🛠️ 주요 기능
- ✅ 메시지 발송/조회/통계
- ⏰ 예약 발송, 대체 발송
- 🔔 웹훅 지원
- 📁 파일 업로드/관리
- 💰 잔액/한도 관리

## 🔍 검색 기능
이 MCP 서버는 **고급 검색 엔진**을 사용하여:
- 🎯 **TF-IDF 알고리즘** 기반 관련도 점수 계산
- ⚡ **인덱스 기반** 빠른 검색 (O(1) 접근)
- 🏆 **가중치 적용** (제목 2배, 키워드 1.5배)
- 💾 **캐싱 시스템**으로 반복 검색 최적화

💡 **사용법**: \`search-solapi-docs\` 도구로 특정 키워드를 검색해보세요!`
        }]
      };

      this.cache.set(cacheKey, overview);
    }

    return overview;
  }
}