/**
 * @file SOLAPI 로컬 검색 도구
 * @description 로컬에 저장된 예제 코드 및 문서를 빠르게 검색
 */
import { NodejsExamplesLibrary } from '../data/nodejsExamples.js';
import { JavaExamplesLibrary } from '../data/javaExamples.js';
import type { ToolDefinition, ExampleSearchArgs, ExampleDetailArgs, ToolResult } from '../types';

export const localSearchTool: ToolDefinition = {
  name: 'search-solapi-local',
  description: '로컬에 저장된 SOLAPI 예제 코드와 문서를 검색합니다. 기본적으로 사용할 주요 검색 도구입니다. 코드 스니펫, 사용법, 카테고리별 검색이 가능합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '검색할 키워드 (예: SMS, 알림톡, TypeScript, 에러처리, Java, Kotlin)'
      },
      category: {
        type: 'string',
        description: '카테고리 필터 (SMS, LMS, 알림톡, 계정관리, 상태조회, 예약발송, 웹훅, 에러처리, TypeScript, 초기설정, 파일업로드, MMS, 음성메시지, 대량발송, 템플릿관리, Kotlin)',
        enum: ['SMS', 'LMS', '알림톡', '계정관리', '상태조회', '예약발송', '웹훅', '에러처리', 'TypeScript', '초기설정', '파일업로드', 'MMS', '음성메시지', '대량발송', '템플릿관리', 'Kotlin']
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

export async function handleLocalSearch(args: Record<string, unknown>): Promise<ToolResult> {
  const { query, category, limit = 5 } = args as unknown as ExampleSearchArgs;
  try {
    let results: any[] = [];
    const q = (query || '').toLowerCase();

    // 언어 자동 추론
    const languageIntent = (() => {
      if (/\b(ts|typescript)\b/.test(q)) return 'ts';
      if (/\b(nodejs|node|js|javascript)\b/.test(q)) return 'js';
      if (/\b(java|kotlin)\b/.test(q)) return 'java';
      return null;
    })();

    const isTsExample = (example: any): boolean =>
      (example.category && example.category.toLowerCase() === 'typescript') ||
      (example.id && example.id.toLowerCase().includes('typescript'));

    const isJavaExample = (example: any): boolean =>
      (example.keywords && example.keywords.some((k: string) => k.toLowerCase().includes('java') || k.toLowerCase().includes('kotlin'))) ||
      (example.id && example.id.toLowerCase().includes('java')) ||
      (example.id && example.id.toLowerCase().includes('kotlin'));

    // 언어별 라이브러리 선택
    let library = NodejsExamplesLibrary;
    if (languageIntent === 'java' || /\b(java|kotlin)\b/.test(q)) {
      library = JavaExamplesLibrary;
    }

    // 카테고리 필터가 있는 경우
    if (category) {
      const categoryExamples = library.getExamplesByCategory(category);
      results = categoryExamples.filter((example: any) => 
        example.title.toLowerCase().includes(query.toLowerCase()) ||
        example.description.toLowerCase().includes(query.toLowerCase()) ||
        example.keywords.some((k: string) => k.toLowerCase().includes(query.toLowerCase())) ||
        example.code.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // 전체 검색
      results = library.searchExamples(query);
    }

    // 언어 의도에 따른 필터 적용
    if (languageIntent === 'ts') {
      results = results.filter(isTsExample);
    } else if (languageIntent === 'js') {
      results = results.filter((ex: any) => !isTsExample(ex) && !isJavaExample(ex));
    } else if (languageIntent === 'java') {
      results = results.filter(isJavaExample);
    }

    // 결과 제한
    results = results.slice(0, limit);

    if (results.length === 0) {
      const allCategories = [...NodejsExamplesLibrary.getCategories(), ...JavaExamplesLibrary.getCategories()];
      const uniqueCategories = [...new Set(allCategories)];
      
      return {
        content: [{
          type: 'text',
          text: `"${query}"에 대한 예제 코드를 찾을 수 없습니다.\n\n제안사항:\n- SMS, LMS, 알림톡 등의 메시지 타입으로 검색해보세요\n- Java, Kotlin, TypeScript, 에러처리, 웹훅 등의 기능으로 검색해보세요\n- 사용 가능한 카테고리: ${uniqueCategories.join(', ')}`
        }]
      };
    }

    // 결과 포맷팅
    const formattedResults = results.map((example: any) => {
      let language = 'js';
      if (isTsExample(example)) language = 'ts';
      else if (isJavaExample(example)) {
        if (example.keywords.some((k: string) => k.toLowerCase().includes('kotlin'))) {
          language = 'kotlin';
        } else {
          language = 'java';
        }
      }

      return {
        id: example.id,
        title: example.title,
        description: example.description,
        category: example.category,
        language: language,
        usage: example.usage,
        keywords: example.keywords,
        codePreview: example.code.substring(0, 200) + (example.code.length > 200 ? '...' : ''),
        fullCode: example.code,
        url: example.url
      };
    });

    const languageFilterText = languageIntent ? 
      ` (언어 필터: ${languageIntent === 'ts' ? 'TypeScript' : languageIntent === 'java' ? 'Java/Kotlin' : 'JavaScript/Node.js'})` : '';

    return {
      content: [{
        type: 'text',
        text: `"${query}"에 대한 ${results.length}개의 예제 코드를 찾았습니다.${languageFilterText}\n\n${formattedResults.map((result: any) => 
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
  name: 'get-solapi-local-detail',
  description: '특정 로컬 예제 코드의 상세 정보를 조회합니다.',
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
    // 먼저 Node.js 예제에서 찾기
    let example = NodejsExamplesLibrary.getExampleById(id);
    let language = 'javascript';
    
    // Node.js 예제에서 찾지 못한 경우 Java 예제에서 찾기
    if (!example) {
      example = JavaExamplesLibrary.getExampleById(id);
      if (example) {
        // Java 예제인지 Kotlin 예제인지 판단
        if (example.keywords.some((k: string) => k.toLowerCase().includes('kotlin'))) {
          language = 'kotlin';
        } else {
          language = 'java';
        }
      }
    } else {
      // TypeScript 예제인지 확인
      if (example.category && example.category.toLowerCase() === 'typescript') {
        language = 'typescript';
      }
    }
    
    if (!example) {
      const allExamples = [...NodejsExamplesLibrary.getExamples(), ...JavaExamplesLibrary.getExamples()];
      return {
        content: [{
          type: 'text',
          text: `예제 ID "${id}"를 찾을 수 없습니다.\n\n사용 가능한 예제들:\n${allExamples.map((e: any) => 
            `- **${e.id}**: ${e.title} (${e.category})`
          ).join('\n')}`
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `## ${example.title}\n\n**설명**: ${example.description}\n**카테고리**: ${example.category}\n**사용법**: ${example.usage}\n\n**키워드**: ${example.keywords.join(', ')}\n\n**코드**:\n\`\`\`${language}\n${example.code}\n\`\`\`\n\n**URL**: ${example.url}`
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
