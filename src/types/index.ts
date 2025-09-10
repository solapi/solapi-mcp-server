/**
 * SOLAPI MCP 서버 타입 정의
 */

// 문서 데이터 타입
export interface DocumentData {
  id: string;
  title: string;
  content: string;
  url?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// 검색 결과 타입
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string | undefined;
  score: number;
  snippet?: string;
  metadata?: Record<string, unknown> | undefined;
}

// 도구 정의 타입
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// 도구 실행 결과 타입
export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

// 도구 실행 함수 타입
export type ToolExecutor = (args: Record<string, unknown>) => Promise<ToolResult>;

// 도구 인터페이스
export interface Tool {
  getDefinition(): ToolDefinition;
  execute: ToolExecutor;
}

// 캐시 매니저 인터페이스
export interface ICacheManager {
  get(key: string): unknown | null;
  set(key: string, value: unknown, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
}

// 검색 엔진 인터페이스
export interface ISearchEngine {
  addDocuments(documents: DocumentData[]): void;
  search(query: string, limit?: number): SearchResult[];
}

// 문서 데이터 매니저 인터페이스
export interface IDocumentDataManager {
  getDocuments(): DocumentData[];
  validateDocuments(documents: DocumentData[]): boolean;
}

// MCP 서버 설정 타입
export interface ServerConfig {
  name: string;
  version: string;
  capabilities: {
    tools: Record<string, unknown>;
  };
}

// 검색 인수 타입
export interface SearchArgs {
  query: string;
  limit?: number;
}

// 예제 검색 인수 타입
export interface ExampleSearchArgs {
  query: string;
  category?: string;
  limit?: number;
}

// 예제 상세 조회 인수 타입
export interface ExampleDetailArgs {
  id: string;
}

// 성능 테스트 인수 타입
export interface PerformanceTestArgs {
  iterations?: number;
  query?: string;
}

// 메모리 분석 인수 타입
export interface MemoryAnalysisArgs {
  includeDetails?: boolean;
}

// 개요 조회 인수 타입
export interface OverviewArgs {
  category?: string;
}
