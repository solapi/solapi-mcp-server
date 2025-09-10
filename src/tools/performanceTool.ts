/**
 * @file 성능 테스트 도구
 * @description MCP 서버의 검색 성능을 측정하고 웹 검색과 비교
 */
import { NodejsExamplesLibrary } from '../data/nodejsExamples.js';
import { WebSearchTool } from './webSearchTool.js';
import type { ToolDefinition, PerformanceTestArgs, MemoryAnalysisArgs, ToolResult, ISearchEngine, ICacheManager } from '../types';

export const performanceTool: ToolDefinition = {
  name: 'benchmark-solapi-search',
  description: 'SOLAPI MCP 서버의 검색 성능을 측정하고 웹 검색과 비교합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      iterations: {
        type: 'number',
        description: '각 쿼리당 반복 횟수 (기본값: 10)',
        minimum: 1,
        maximum: 100,
        default: 10
      },
      query: {
        type: 'string',
        description: '테스트할 검색 쿼리 (기본값: 자주 사용되는 쿼리들)',
        default: 'SMS 발송'
      },
      includeWebComparison: {
        type: 'boolean',
        description: '실제 웹 검색과 비교 측정 포함 (네트워크 필요, 기본값: false)',
        default: false
      }
    }
  }
};

export async function handlePerformanceTest(args: Record<string, unknown>, searchEngine?: ISearchEngine, cache?: ICacheManager): Promise<ToolResult> {
  const { iterations = 10, query = 'SMS 발송', includeWebComparison = false } = args as unknown as PerformanceTestArgs & { includeWebComparison?: boolean };
  try {
    const results: any[] = [];
    const totalStartTime = Date.now();

    const testQueries = [query, '알림톡', 'TypeScript', '에러 처리', '웹훅'];

    for (const testQuery of testQueries) {
      const queryResults: any[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        // MCP 내부 검색 수행
        const searchResults = NodejsExamplesLibrary.searchExamples(testQuery);
        
        const endTime = Date.now();
        const searchTime = endTime - startTime;
        
        queryResults.push({
          iteration: i + 1,
          searchTime,
          resultCount: searchResults.length
        });
      }

      // 통계 계산
      const searchTimes = queryResults.map((r: any) => r.searchTime);
      const avgTime = searchTimes.reduce((a: number, b: number) => a + b, 0) / searchTimes.length;
      const minTime = Math.min(...searchTimes);
      const maxTime = Math.max(...searchTimes);
      const medianTime = searchTimes.sort((a: number, b: number) => a - b)[Math.floor(searchTimes.length / 2)];

      results.push({
        query: testQuery,
        iterations,
        averageTime: Math.round(avgTime * 100) / 100,
        minTime,
        maxTime,
        medianTime,
        totalResults: queryResults[0].resultCount,
        details: queryResults
      });
    }

    const totalTime = Date.now() - totalStartTime;
    const totalSearches = testQueries.length * iterations;

    // 성능 분석
    const allTimes = results.flatMap((r: any) => r.details.map((d: any) => d.searchTime));
    const overallAvgTime = allTimes.reduce((a: number, b: number) => a + b, 0) / allTimes.length;
    const overallMinTime = Math.min(...allTimes);
    const overallMaxTime = Math.max(...allTimes);

    // 웹 검색과의 비교
    let webSearchTime = 2000; // 기본 추정치 (2초)
    let isActualWebTime = false;
    
    if (includeWebComparison && searchEngine && cache) {
      try {
        const webSearchTool = new WebSearchTool(searchEngine, cache);
        const webStartTime = Date.now();
        await webSearchTool.execute({ query: testQueries[0], limit: 5 });
        webSearchTime = Date.now() - webStartTime;
        isActualWebTime = true;
      } catch (error) {
        console.warn('웹 검색 측정 실패, 추정치 사용:', error);
      }
    }
    
    const speedImprovement = Math.round((webSearchTime / overallAvgTime) * 100) / 100;

    const advantages = [
      '네트워크 지연 없음',
      '인덱스 사전 구축으로 즉시 검색',
      '캐싱으로 반복 검색 최적화',
      '오프라인에서도 동작',
      'API 호출 제한 없음'
    ];

    return {
      content: [{
        type: 'text',
        text: `# SOLAPI MCP 서버 성능 테스트 결과\n\n## 요약\n- **총 쿼리 수**: ${testQueries.length}\n- **총 반복 횟수**: ${totalSearches}\n- **총 소요 시간**: ${totalTime}ms\n- **평균 검색 시간**: ${Math.round(overallAvgTime * 100) / 100}ms\n- **최소 시간**: ${overallMinTime}ms\n- **최대 시간**: ${overallMaxTime}ms\n- **웹 검색 시간**: ${webSearchTime}ms ${isActualWebTime ? '(실제 측정)' : '(추정치)'}\n- **속도 개선**: ${speedImprovement}x 빠름\n- **초당 검색 수**: ${Math.round((totalSearches / (totalTime / 1000)) * 100) / 100}\n\n## 분석\n- **성능 등급**: ${overallAvgTime < 10 ? '매우 빠름' : overallAvgTime < 50 ? '빠름' : '보통'}\n- **권장사항**: ${overallAvgTime < 10 ? 'MCP 내부 검색이 웹 검색보다 훨씬 빠릅니다. 실시간 응답에 적합합니다.' : '성능이 양호하지만 추가 최적화를 고려해보세요.'}\n${isActualWebTime ? '\n- **웹 비교**: 실제 웹 검색 시간을 측정했습니다.' : '\n- **웹 비교**: 추정치를 사용했습니다. includeWebComparison: true로 실제 측정 가능합니다.'}\n\n## 장점\n${advantages.map((advantage: string) => `- ${advantage}`).join('\n')}\n\n## 상세 결과\n${results.map((result: any) => 
          `### ${result.query}\n- 반복 횟수: ${result.iterations}\n- 평균 시간: ${result.averageTime}ms\n- 최소 시간: ${result.minTime}ms\n- 최대 시간: ${result.maxTime}ms\n- 중간값: ${result.medianTime}ms\n- 총 결과 수: ${result.totalResults}`
        ).join('\n\n')}`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `성능 테스트 중 오류가 발생했습니다: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}

/**
 * 메모리 사용량 분석 도구
 */
export const memoryAnalysisTool: ToolDefinition = {
  name: 'analyze-memory-usage',
  description: 'MCP 서버의 메모리 사용량을 분석합니다.',
  inputSchema: {
    type: 'object',
    properties: {
      includeDetails: {
        type: 'boolean',
        description: '상세 정보 포함 여부 (기본값: false)',
        default: false
      }
    }
  }
};

export async function handleMemoryAnalysis(args: Record<string, unknown> = {}): Promise<ToolResult> {
  const { includeDetails = false } = args as unknown as MemoryAnalysisArgs;
  try {
    const examples = NodejsExamplesLibrary.getExamples();
    
    // 메모리 사용량 추정
    const totalExamples = examples.length;
    const totalCodeSize = examples.reduce((sum: number, ex: any) => sum + ex.code.length, 0);
    const totalKeywords = examples.reduce((sum: number, ex: any) => sum + ex.keywords.length, 0);
    
    // 대략적인 메모리 사용량 계산 (바이트)
    const estimatedMemoryUsage = {
      examples: totalExamples,
      totalCodeSize,
      totalKeywords,
      estimatedMemoryBytes: (totalCodeSize * 2) + (totalKeywords * 20) + (totalExamples * 200), // UTF-16 + 메타데이터
      estimatedMemoryKB: Math.round(((totalCodeSize * 2) + (totalKeywords * 20) + (totalExamples * 200)) / 1024),
      estimatedMemoryMB: Math.round(((totalCodeSize * 2) + (totalKeywords * 20) + (totalExamples * 200)) / (1024 * 1024) * 100) / 100
    };

    const details = includeDetails ? {
      examplesByCategory: examples.reduce((acc: any, ex: any) => {
        acc[ex.category] = (acc[ex.category] || 0) + 1;
        return acc;
      }, {}),
      averageCodeSize: Math.round(totalCodeSize / totalExamples),
      averageKeywordsPerExample: Math.round(totalKeywords / totalExamples)
    } : null;

    return {
      content: [{
        type: 'text',
        text: `# 💾 SOLAPI MCP 서버 메모리 사용량 분석\n\n## 📊 메모리 사용량\n- **예제 수**: ${estimatedMemoryUsage.examples}개\n- **총 코드 크기**: ${estimatedMemoryUsage.totalCodeSize}바이트\n- **총 키워드 수**: ${estimatedMemoryUsage.totalKeywords}개\n- **추정 메모리 사용량**: ${estimatedMemoryUsage.estimatedMemoryMB}MB (${estimatedMemoryUsage.estimatedMemoryKB}KB)\n\n## 📈 분석\n- **효율성**: ${estimatedMemoryUsage.estimatedMemoryMB < 1 ? '매우 효율적' : estimatedMemoryUsage.estimatedMemoryMB < 5 ? '효율적' : '보통'}\n- **권장사항**: ${estimatedMemoryUsage.estimatedMemoryMB < 1 ? '메모리 사용량이 매우 적습니다. 추가 예제 코드를 더 포함할 수 있습니다.' : '메모리 사용량이 적절합니다.'}\n\n## 🔄 비교\n- **웹 검색 메모리**: 0MB (클라이언트 측)\n- **MCP 메모리**: ${estimatedMemoryUsage.estimatedMemoryMB}MB (서버 측)\n- **장점**: MCP는 한 번 로드 후 재사용 가능${includeDetails && details ? `\n\n## 📋 상세 정보\n- **카테고리별 예제 수**: ${Object.entries(details.examplesByCategory).map(([cat, count]) => `${cat}: ${count}개`).join(', ')}\n- **평균 코드 크기**: ${details.averageCodeSize}바이트\n- **예제당 평균 키워드 수**: ${details.averageKeywordsPerExample}개` : ''}`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `메모리 분석 중 오류가 발생했습니다: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}
