#!/usr/bin/env node

/**
 * @fileoverview SOLAPI MCP 서버 메인 파일입니다.
 * MCP(Model Context Protocol) 기반의 SOLAPI 문서 검색 및 통합 서버를 구현합니다.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * @class SOLAPI MCP 서버를 구현하는 클래스입니다.
 */
class SolapiMcpServer {
  /**
   * SolapiMcpServer 클래스의 인스턴스를 생성합니다.
   * 서버 설정과 초기화를 담당합니다.
   */
  constructor () {
    this.server = new Server(
      {
        name: 'solapi-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.documents = [];
    this.setupTools();
  }

  /**
   * MCP 도구들을 설정하고 요청 핸들러를 등록합니다.
   */
  setupTools () {
    // 도구 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search-solapi-docs',
            description: 'SOLAPI 개발자 문서에서 키워드로 검색합니다',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: '검색할 키워드 (예: SMS, 알림톡, API 키)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get-solapi-overview',
            description: 'SOLAPI 서비스 전체 개요를 제공합니다',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // 도구 실행
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search-solapi-docs':
          return await this.searchDocs(args.query);
        case 'get-solapi-overview':
          return await this.getOverview();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  /**
   * 주어진 쿼리로 SOLAPI 문서를 검색합니다.
   * @param {string} query - 검색할 키워드
   * @returns {Promise<Object>} 검색 결과를 담은 객체
   */
  async searchDocs (query) {
    try {
      if (!this.documents.length) {
        await this.loadDocuments();
      }

      const results = this.performSearch(query);

      return {
        content: [
          {
            type: 'text',
            text: `SOLAPI 문서 검색 결과 (키워드: "${query}"):\n\n${results}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `검색 중 오류가 발생했습니다: ${error.message}`,
          },
        ],
      };
    }
  }

  /**
   * SOLAPI 서비스의 전체 개요를 제공합니다.
   * @returns {Promise<Object>} 서비스 개요 정보를 담은 객체
   */
  async getOverview () {
    return {
      content: [
        {
          type: 'text',
          text: `# SOLAPI 개발자 문서 개요

SOLAPI는 15년 이상의 경험을 바탕으로 SMS, LMS, MMS, 카카오톡, 음성, 팩스 서비스를 REST API와 다양한 SDK로 제공하는 종합 메시징 서비스 플랫폼입니다.

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

자세한 정보는 'search-solapi-docs' 도구로 특정 키워드를 검색해보세요.`,
        },
      ],
    };
  }

  /**
   * SOLAPI 문서를 로드합니다.
   * @throws {Error} 문서 로드 실패시 발생
   */
  async loadDocuments () {
    try {
      console.error('Loading SOLAPI documents...'); // stderr로 디버그 메시지

      // 실제로는 HTTP 요청으로 문서를 가져와야 하지만
      // 일단 하드코딩된 데이터 사용
      this.documents = this.parseDocuments();

      console.error(`Loaded ${this.documents.length} documents`);
    } catch (error) {
      console.error('Failed to load documents:', error);
      throw error;
    }
  }

  /**
   * 문서 데이터를 파싱하여 검색 가능한 형태로 변환합니다.
   * @returns {Array<Object>} 파싱된 문서 객체 배열
   */
  parseDocuments () {
    const docs = [
      {
        title: 'API Key 인증',
        content: 'HMAC-SHA256 또는 HMAC-MD5 알고리즘을 사용한 서명 기반 인증 방법을 설명합니다. API Key와 API Secret을 이용해 안전하게 API를 호출하는 방법을 다룹니다.',
        keywords: ['api', 'key', '인증', 'hmac', 'sha256', 'md5', 'authentication'],
        url: 'https://developers.solapi.com/references/authentication/api-key',
      },
      {
        title: 'SMS 발송',
        content: '단문 메시지 서비스로 90바이트(한글 45자, 영어 90자) 제한이 있습니다. 발신번호, 수신번호, 메시지 내용이 필수 필드입니다.',
        keywords: ['sms', '단문', '문자', '발송', '90바이트', '45자'],
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
      },
      {
        title: 'LMS 발송',
        content: '장문 메시지 서비스로 2000바이트(한글 1000자) 제한이 있습니다. 제목(40바이트)을 추가할 수 있으며, 수신자의 데이터 연결이 필요합니다.',
        keywords: ['lms', '장문', '문자', '발송', '2000바이트', '1000자'],
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
      },
      {
        title: '알림톡 (ATA)',
        content: '사전 승인된 템플릿을 사용하는 정보성 메시지입니다. 변수 치환, 버튼 추가, 강조 표기 등을 지원하며 1000자 제한이 있습니다. 실패 시 SMS/LMS로 대체 발송이 가능합니다.',
        keywords: ['알림톡', 'ata', '카카오톡', '템플릿', '1000자', '정보성'],
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
      },
      {
        title: '친구톡 (CTA)',
        content: '채널 친구에게만 발송 가능한 광고성 메시지입니다. 템플릿 승인 없이 자유로운 내용 작성이 가능하며 1000자 제한이 있습니다. adFlag로 광고 여부를 명시해야 합니다.',
        keywords: ['친구톡', 'cta', '카카오톡', '광고', '채널', '친구'],
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
      },
      {
        title: 'Node.js SDK',
        content: 'npm을 통한 설치 방법, 메시지 발송, 잔액 조회, 예약 발송 등의 예제 코드를 제공합니다. Promise와 async/await 패턴을 모두 지원합니다.',
        keywords: ['nodejs', 'node', 'sdk', 'npm', 'javascript', 'promise', 'async'],
        url: 'https://developers.solapi.com/category/nodejs',
      },
      {
        title: '메시지 상태 코드',
        content: '2000번대(정상), 3000번대(발송중), 4000번대(실패) 등 메시지 발송 상태를 나타내는 코드와 각 코드의 의미를 설명합니다.',
        keywords: ['상태코드', 'status', 'code', '2000', '3000', '4000'],
        url: 'https://developers.solapi.com/references/message-status-codes',
      },
      {
        title: '잔액 확인',
        content: '현재 계정의 충전 잔액(balance)과 보너스 포인트(point)를 실시간으로 조회합니다. 잔액 부족 시 메시지 발송이 실패합니다.',
        keywords: ['잔액', 'balance', 'point', '포인트', '충전'],
        url: 'https://developers.solapi.com/references/cash/getBalance',
      },
    ];

    return docs;
  }

  /**
   * 주어진 쿼리로 문서를 검색합니다.
   * @param {string} query - 검색할 키워드
   * @returns {string} 검색 결과 문자열
   */
  performSearch (query) {
    if (!query) return '검색어를 입력해주세요.';

    const queryLower = query.toLowerCase();
    const results = this.documents.filter(doc => {
      return (
        doc.title.toLowerCase().includes(queryLower) ||
        doc.content.toLowerCase().includes(queryLower) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
      );
    });

    if (results.length === 0) {
      return '검색 결과가 없습니다. 다른 키워드로 시도해보세요.';
    }

    return results
      .map((doc, index) => `## ${index + 1}. ${doc.title}\n${doc.content}\n📖 자세히 보기: ${doc.url}`)
      .join('\n\n');
  }

  /**
   * MCP 서버를 시작합니다.
   * @throws {Error} 서버 시작 실패시 발생
   */
  async start () {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SOLAPI MCP server started'); // stderr로 디버그 메시지
  }
}

// 서버 시작
const server = new SolapiMcpServer();
server.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { SolapiMcpServer };