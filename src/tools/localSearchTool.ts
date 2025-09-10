/**
 * @file SOLAPI 로컬 검색 도구
 * @description 로컬에 저장된 예제 코드 및 문서를 빠르게 검색
 */
import { NodejsExamplesLibrary } from '../data/nodejsExamples.js';
import { JavaExamplesLibrary } from '../data/javaExamples.js';
import { PythonExamplesLibrary } from '../data/pythonExamples.js';
import { GoExamplesLibrary } from '../data/goExamples.js';
import { AspExamplesLibrary } from '../data/aspExamples.js';
import { ExampleCache } from '../core/exampleCache.js';
import { WeightedSearchEngine } from '../search/weightedSearchEngine.js';
import { SearchIndexManager } from '../search/searchIndexManager.js';
import { WebSearchTool } from './webSearchTool.js';
import type { ToolDefinition, ExampleSearchArgs, ExampleDetailArgs, ToolResult, ISearchEngine, ICacheManager } from '../types';

export const localSearchTool: ToolDefinition = {
  name: 'search-local-examples',
  description: '로컬에 저장된 SOLAPI 예제 코드와 문서를 검색합니다. 기본적으로 사용할 주요 검색 도구입니다. 코드 스니펫, 사용법, 카테고리별 검색이 가능합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '검색할 키워드 (예: SMS, 알림톡, TypeScript, Node.js, JavaScript, 에러처리, Java, Kotlin, Python)'
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

// 캐시 인스턴스
const cache = ExampleCache.getInstance();

// 인덱스 매니저 인스턴스
const indexManager = SearchIndexManager.getInstance();

// 웹 검색 도구 인스턴스 (의존성 주입을 위해 나중에 설정)
let webSearchTool: WebSearchTool | null = null;

/**
 * 웹 검색 도구를 설정합니다.
 */
export function setWebSearchTool(searchEngine: ISearchEngine, cacheManager: ICacheManager): void {
  webSearchTool = new WebSearchTool(searchEngine, cacheManager);
}

// 언어 감지 함수들
const isTsExample = (example: any): boolean =>
  (example.category && example.category.toLowerCase() === 'typescript') ||
  (example.id && example.id.toLowerCase().includes('typescript'));

const isJavaExample = (example: any): boolean => {
  // JavaScript 예제는 Java 예제가 아님을 명확히 구분
  if (example.keywords && example.keywords.some((k: string) => 
    k.toLowerCase().includes('javascript') || 
    k.toLowerCase().includes('nodejs') || 
    k.toLowerCase().includes('js') ||
    k.toLowerCase().includes('node'))) {
    return false;
  }
  return (example.keywords && example.keywords.some((k: string) => k.toLowerCase().includes('java') || k.toLowerCase().includes('kotlin'))) ||
    (example.id && example.id.toLowerCase().includes('java')) ||
    (example.id && example.id.toLowerCase().includes('kotlin'));
};

const isPythonExample = (example: any): boolean =>
  (example.keywords && example.keywords.some((k: string) => k.toLowerCase().includes('python'))) ||
  (example.id && example.id.toLowerCase().includes('python'));

const isGoExample = (example: any): boolean =>
  (example.keywords && example.keywords.some((k: string) => k.toLowerCase().includes('go') || k.toLowerCase().includes('golang'))) ||
  (example.id && example.id.toLowerCase().includes('go'));

const isAspExample = (example: any): boolean =>
  (example.keywords && example.keywords.some((k: string) => k.toLowerCase().includes('asp') || k.toLowerCase().includes('vbscript'))) ||
  (example.id && example.id.toLowerCase().includes('asp-'));

const isJsExample = (example: any): boolean => {
  // TypeScript 예제는 JavaScript 예제가 아님
  if (isTsExample(example)) return false;
  
  // Java 예제는 JavaScript 예제가 아님
  if (isJavaExample(example)) return false;
  
  // Python, Go, ASP 예제는 JavaScript 예제가 아님
  if (isPythonExample(example) || isGoExample(example) || isAspExample(example)) return false;
  
  // Node.js 예제는 JavaScript 예제임
  return (example.keywords && example.keywords.some((k: string) => 
    k.toLowerCase().includes('javascript') || 
    k.toLowerCase().includes('nodejs') || 
    k.toLowerCase().includes('js') ||
    k.toLowerCase().includes('node'))) ||
    (example.id && example.id.toLowerCase().includes('nodejs')) ||
    (example.id && example.id.toLowerCase().includes('javascript'));
};

/**
 * 모든 라이브러리의 예제 데이터를 캐시에 로드하고 인덱스를 구축합니다.
 */
function initializeCache(): void {
  // 각 라이브러리의 예제 데이터를 캐시에 저장
  const nodeExamples = NodejsExamplesLibrary.getExamples();
  const javaExamples = JavaExamplesLibrary.getExamples();
  const pythonExamples = PythonExamplesLibrary.getExamples();
  const goExamples = GoExamplesLibrary.getExamples();
  const aspExamples = AspExamplesLibrary.getExamples();
  
  cache.setLibraryCache('nodejs', nodeExamples);
  cache.setLibraryCache('java', javaExamples);
  cache.setLibraryCache('python', pythonExamples);
  cache.setLibraryCache('go', goExamples);
  cache.setLibraryCache('asp', aspExamples);

  // 모든 예제를 합쳐서 인덱스 구축
  const allExamples = [...nodeExamples, ...javaExamples, ...pythonExamples, ...goExamples, ...aspExamples];
  indexManager.buildIndex(allExamples);
}

/**
 * 검색 결과를 포맷팅하여 반환합니다. 결과가 없으면 웹 검색을 시도합니다.
 */
async function formatSearchResults(results: any[], query: string, limit: number): Promise<ToolResult> {
  if (results.length === 0) {
    // 로컬 검색 결과가 없으면 웹 검색 시도
    if (webSearchTool) {
      try {
        console.warn(`로컬 검색 결과 없음. 웹 검색 시도: "${query}"`);
        const webResult = await webSearchTool.execute({ query, limit });
        
        // 웹 검색 결과가 있으면 반환
        if (webResult.content && webResult.content.length > 0 && webResult.content[0]) {
          return {
            content: [{
              type: 'text',
              text: `Web search results for "${query}":\n\n${webResult.content[0].text}`
            }]
          };
        }
      } catch (error) {
        console.error('웹 검색 실패:', error);
      }
    }

    // 웹 검색도 실패하거나 웹 검색 도구가 없는 경우 기본 메시지 반환
    const allCategories = [
      ...NodejsExamplesLibrary.getCategories(),
      ...JavaExamplesLibrary.getCategories(),
      ...PythonExamplesLibrary.getCategories(),
      ...GoExamplesLibrary.getCategories(),
      ...AspExamplesLibrary.getCategories()
    ];
    const uniqueCategories = [...new Set(allCategories)];
    
    return {
      content: [{
        type: 'text',
        text: `No examples found for "${query}".\n\nSuggestions:\n- Try searching by message types: SMS, LMS, 알림톡\n- Try searching by languages: Node.js, JavaScript, TypeScript, Java, Kotlin, Python\n- Try searching by features: error handling, webhook, status check\n- Available categories: ${uniqueCategories.join(', ')}`
      }]
    };
  }

  // 결과 포맷팅
  const formattedResults = results.map((example: any) => {
    let language = 'javascript';
    if (isTsExample(example)) {
      language = 'typescript';
    } else if (isJavaExample(example)) {
      if (example.keywords.some((k: string) => k.toLowerCase().includes('kotlin'))) {
        language = 'kotlin';
      } else {
        language = 'java';
      }
    } else if (isPythonExample(example)) {
      language = 'python';
    } else if (isGoExample(example)) {
      language = 'go';
    } else if (isAspExample(example)) {
      language = 'vbscript';
    } else if (isJsExample(example)) {
      language = 'javascript';
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

  return {
    content: [{
      type: 'text',
      text: `Found ${results.length} examples for "${query}":\n\n${formattedResults.map((result: any) => 
        `## ${result.title}\n**Category**: ${result.category}\n**Language**: ${result.language}\n**Usage**: ${result.usage}\n\n**Code Preview**:\n\`\`\`${result.language}\n${result.codePreview}\n\`\`\`\n\n**Full Code**:\n\`\`\`${result.language}\n${result.fullCode}\n\`\`\`\n\n**URL**: ${result.url}\n`
      ).join('\n---\n\n')}`
    }]
  };
}

export async function handleLocalSearch(args: Record<string, unknown>): Promise<ToolResult> {
  const { query, category, limit = 5 } = args as unknown as ExampleSearchArgs;
  try {
    // 캐시 초기화 (첫 실행 시에만)
    if (cache.getCacheStats().libraryCount === 0) {
      initializeCache();
    }

    // 검색 결과 캐시 확인
    const cacheKey = `${query}-${category || 'all'}-${limit}`;
    const cachedResults = cache.getSearchCache(cacheKey);
    if (cachedResults) {
      return await formatSearchResults(cachedResults, query, limit);
    }

    let results: any[] = [];
    const q = (query || '').toLowerCase();

    // 언어 자동 추론 - 더 정확한 패턴 매칭
    const languageIntent = (() => {
      if (/\b(ts|typescript)\b/.test(q)) return 'ts';
      if (/\b(nodejs|node\.js|nodejs|javascript|js)\b/.test(q)) return 'js';
      if (/\b(java|kotlin)\b/.test(q)) return 'java';
      if (/\b(python|py)\b/.test(q)) return 'python';
      if (/\b(go|golang)\b/.test(q)) return 'go';
      if (/\b(asp|vbscript|classic\s*asp)\b/.test(q)) return 'asp';
      return null;
    })();

    // 인덱스 기반 빠른 검색 수행
    const searchResultIds = indexManager.searchComplex(
      query as string, 
      category, 
      languageIntent || undefined
    );

    // 검색된 ID들로 실제 예제 객체들을 가져오기
    const searchResults = indexManager.getExamplesByIds(searchResultIds);

    // 가중치 기반 점수 계산 및 정렬
    const scoredResults = WeightedSearchEngine.sortByScore(searchResults, query as string);
    
    // 관련성 있는 결과만 필터링하고 제한
    const relevantResults = WeightedSearchEngine.filterRelevantResults(scoredResults);
    const limitedResults = WeightedSearchEngine.limitResults(relevantResults, limit as number);
    
    // 결과를 Example 형태로 변환
    results = limitedResults.map(scoredResult => scoredResult.example);

    // 검색 결과를 캐시에 저장
    cache.setSearchCache(cacheKey, results);

    return await formatSearchResults(results, query, limit);

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error occurred while searching examples: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}

/**
 * 예제 코드 상세 조회
 */
export const exampleDetailTool: ToolDefinition = {
  name: 'get-local-examples-detail',
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
    }
    
    // Java 예제에서도 찾지 못한 경우 Python 예제에서 찾기
    if (!example) {
      example = PythonExamplesLibrary.getExampleById(id);
      if (example) {
        language = 'python';
      }
    }

    // Python 예제에서도 찾지 못한 경우 Go 예제에서 찾기
    if (!example) {
      example = GoExamplesLibrary.getExampleById(id);
      if (example) {
        language = 'go';
      }
    }

    // Go 예제에서도 찾지 못한 경우 ASP 예제에서 찾기
    if (!example) {
      example = AspExamplesLibrary.getExampleById(id);
      if (example) {
        language = 'vbscript';
      }
    }
    
    // TypeScript 예제인지 확인 (Node.js 예제 중)
    if (example && !language.includes('java') && language !== 'python' && language !== 'go' && language !== 'vbscript') {
      if (example.category && example.category.toLowerCase() === 'typescript') {
        language = 'typescript';
      }
    }
    
    if (!example) {
      const allExamples = [
        ...NodejsExamplesLibrary.getExamples(),
        ...JavaExamplesLibrary.getExamples(),
        ...PythonExamplesLibrary.getExamples(),
        ...GoExamplesLibrary.getExamples(),
        ...AspExamplesLibrary.getExamples()
      ];
      return {
        content: [{
          type: 'text',
          text: `Example ID "${id}" not found.\n\nAvailable examples:\n${allExamples.map((e: any) => 
            `- **${e.id}**: ${e.title} (${e.category})`
          ).join('\n')}`
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `## ${example.title}\n\n**Description**: ${example.description}\n**Category**: ${example.category}\n**Usage**: ${example.usage}\n\n**Keywords**: ${example.keywords.join(', ')}\n\n**Code**:\n\`\`\`${language}\n${example.code}\n\`\`\`\n\n**URL**: ${example.url}`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error occurred while retrieving example details: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}
