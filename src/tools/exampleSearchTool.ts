/**
 * @file SOLAPI 예제 코드 검색 도구
 * @description 실제 사용 가능한 코드 스니펫을 빠르게 검색
 */
import { SolapiExamplesLibrary } from '../data/solapiExamples.js';
import type { ToolDefinition, ExampleSearchArgs, ExampleDetailArgs, ToolResult } from '../types/index.js';

export const exampleSearchTool: ToolDefinition = {
  name: 'search-solapi-examples',
  description: 'SOLAPI Node.js SDK의 실제 예제 코드를 검색합니다. 코드 스니펫, 사용법, 카테고리별 검색이 가능합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '검색할 키워드 (예: SMS, 알림톡, TypeScript, 에러처리)'
      },
      category: {
        type: 'string',
        description: '카테고리 필터 (SMS, LMS, 알림톡, 계정관리, 상태조회, 예약발송, 웹훅, 에러처리, TypeScript)',
        enum: ['SMS', 'LMS', '알림톡', '계정관리', '상태조회', '예약발송', '웹훅', '에러처리', 'TypeScript']
      },
      limit: {
        type: 'number',
        description: '검색 결과 개수 제한 (기본값: 5, 최대: 10)',
        minimum: 1,
        maximum: 10,
        default: 5
      }
    },
    required: ['query']
  }
};

export async function handleExampleSearch(args: Record<string, unknown>): Promise<ToolResult> {
  const { query, category, limit = 5 } = args as unknown as ExampleSearchArgs;
  try {
    let results: any[] = [];
    const q = (query || '').toLowerCase();

    // 언어 자동 추론 (nodejs == js)
    const languageIntent = (() => {
      if (/\b(ts|typescript)\b/.test(q)) return 'ts';
      if (/\b(nodejs|node|js|javascript)\b/.test(q)) return 'js';
      return null;
    })();

    const isTsExample = (example: any): boolean =>
      (example.category && example.category.toLowerCase() === 'typescript') ||
      (example.id && example.id.toLowerCase().includes('typescript'));

    // 카테고리 필터가 있는 경우
    if (category) {
      const categoryExamples = SolapiExamplesLibrary.getExamplesByCategory(category);
      results = categoryExamples.filter((example: any) => 
        example.title.toLowerCase().includes(query.toLowerCase()) ||
        example.description.toLowerCase().includes(query.toLowerCase()) ||
        example.keywords.some((k: string) => k.toLowerCase().includes(query.toLowerCase())) ||
        example.code.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // 전체 검색
      results = SolapiExamplesLibrary.searchExamples(query);
    }

    // 언어 의도에 따른 필터 적용
    if (languageIntent === 'ts') {
      results = results.filter(isTsExample);
    } else if (languageIntent === 'js') {
      results = results.filter((ex: any) => !isTsExample(ex));
    }

    // 결과 제한
    results = results.slice(0, limit);

    if (results.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `"${query}"에 대한 예제 코드를 찾을 수 없습니다.\n\n제안사항:\n- SMS, LMS, 알림톡 등의 메시지 타입으로 검색해보세요\n- TypeScript, 에러처리, 웹훅 등의 기능으로 검색해보세요\n- 사용 가능한 카테고리: ${SolapiExamplesLibrary.getCategories().join(', ')}`
        }]
      };
    }

    // 결과 포맷팅
    const formattedResults = results.map((example: any) => ({
      id: example.id,
      title: example.title,
      description: example.description,
      category: example.category,
      language: isTsExample(example) ? 'ts' : 'js',
      usage: example.usage,
      keywords: example.keywords,
      codePreview: example.code.substring(0, 200) + (example.code.length > 200 ? '...' : ''),
      fullCode: example.code,
      url: example.url
    }));

    return {
      content: [{
        type: 'text',
        text: `"${query}"에 대한 ${results.length}개의 예제 코드를 찾았습니다.${languageIntent ? ` (언어 필터: ${languageIntent === 'ts' ? 'TypeScript' : 'JavaScript/Node.js'})` : ''}\n\n${formattedResults.map((result: any) => 
          `## ${result.title}\n**카테고리**: ${result.category}\n**언어**: ${result.language}\n**사용법**: ${result.usage}\n\n**코드 미리보기**:\n\`\`\`${result.language}\n${result.codePreview}\n\`\`\`\n\n**전체 코드**:\n\`\`\`${result.language}\n${result.fullCode}\n\`\`\`\n\n**URL**: ${result.url}\n`
        ).join('\n---\n\n')}`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `예제 코드 검색 중 오류가 발생했습니다: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}

/**
 * 예제 코드 상세 조회
 */
export const exampleDetailTool: ToolDefinition = {
  name: 'get-solapi-example-detail',
  description: '특정 예제 코드의 상세 정보를 조회합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '예제 ID (예: sms-send-basic, alimtalk-send, typescript-example)'
      }
    },
    required: ['id']
  }
};

export async function handleExampleDetail(args: Record<string, unknown>): Promise<ToolResult> {
  const { id } = args as unknown as ExampleDetailArgs;
  try {
    const example = SolapiExamplesLibrary.getExampleById(id);
    
    if (!example) {
      return {
        content: [{
          type: 'text',
          text: `예제 ID "${id}"를 찾을 수 없습니다.\n\n사용 가능한 예제들:\n${SolapiExamplesLibrary.getExamples().map((e: any) => 
            `- **${e.id}**: ${e.title} (${e.category})`
          ).join('\n')}`
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `## ${example.title}\n\n**설명**: ${example.description}\n**카테고리**: ${example.category}\n**사용법**: ${example.usage}\n\n**키워드**: ${example.keywords.join(', ')}\n\n**코드**:\n\`\`\`javascript\n${example.code}\n\`\`\`\n\n**URL**: ${example.url}`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `예제 상세 조회 중 오류가 발생했습니다: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}
