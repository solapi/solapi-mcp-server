import type { DocumentData, SearchResult, ISearchEngine } from '../types';

/**
 * @class 검색 엔진
 * @description TF-IDF 알고리즘과 역 인덱스를 사용한 고성능 검색
 */
export class OptimizedSearchEngine implements ISearchEngine {
  private documents: DocumentData[] = [];
  private invertedIndex: Map<string, Set<number>> = new Map(); // 인덱스 맵핑: 키워드 -> 문서
  private tfidfScores: Map<number, Map<string, number>> = new Map(); // TF-IDF 점수 캐싱
  private isIndexed: boolean = false;

  constructor() {
    this.documents = [];
    this.invertedIndex = new Map();
    this.tfidfScores = new Map();
    this.isIndexed = false;
  }

  /**
   * 문서 추가 및 인덱싱
   * @param docs - 문서 배열
   */
  addDocuments(docs: DocumentData[]): void {
    this.documents = docs;
    this.buildInvertedIndex();
    this.calculateTFIDF();
    this.isIndexed = true;
  }

  /**
   * 역 인덱스 구축 - O(n*m) 시간 복잡도
   */
  private buildInvertedIndex(): void {
    this.invertedIndex.clear();

    this.documents.forEach((doc, docIndex) => {
      const allText = `${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`.toLowerCase();
      const terms = this.tokenize(allText);

      terms.forEach(term => {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, new Set());
        }
        this.invertedIndex.get(term)!.add(docIndex);
      });
    });
  }

  /**
   * TF-IDF 점수 계산
   */
  private calculateTFIDF(): void {
    this.tfidfScores.clear();
    const docCount = this.documents.length;

    this.documents.forEach((doc, docIndex) => {
      const allText = `${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`.toLowerCase();
      const terms = this.tokenize(allText);
      const termFreq = new Map<string, number>();

      // TF 계산
      terms.forEach(term => {
        termFreq.set(term, (termFreq.get(term) || 0) + 1);
      });

      const docScores = new Map<string, number>();

      // TF-IDF 계산
      termFreq.forEach((tf, term) => {
        const df = this.invertedIndex.get(term)?.size || 1;
        const idf = Math.log(docCount / df);
        const tfidf = (tf / terms.length) * idf;
        docScores.set(term, tfidf);
      });

      this.tfidfScores.set(docIndex, docScores);
    });
  }

  /**
   * 텍스트 토큰화
   * @param text - 토큰화할 텍스트
   * @returns 토큰 배열
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 1);
  }

  /**
   * 고급 검색 수행
   * @param query - 검색 쿼리
   * @param limit - 결과 제한 (기본값: 5)
   * @returns 정렬된 검색 결과
   */
  search(query: string, limit: number = 5): SearchResult[] {
    if (!this.isIndexed) {
      return [];
    }

    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) {
      return [];
    }

    const docScores = new Map<number, number>();

    // 각 쿼리 용어에 대해 일치하는 문서 찾기
    queryTerms.forEach(term => {
      const matchingDocs = this.invertedIndex.get(term);
      if (matchingDocs) {
        matchingDocs.forEach(docIndex => {
          const tfidfScore = this.tfidfScores.get(docIndex)?.get(term) || 0;

          // 가중치 계산 (제목에서 발견시 2배, 키워드에서 발견시 1.5배)
          let weight = 1;
          const doc = this.documents[docIndex];

          if (doc && doc.title.toLowerCase().includes(term)) {
            weight = 2;
          } else if (doc && doc.tags?.some(tag => tag.toLowerCase().includes(term))) {
            weight = 1.5;
          }

          const currentScore = docScores.get(docIndex) || 0;
          docScores.set(docIndex, currentScore + (tfidfScore * weight));
        });
      }
    });

    // 정확한 구문 매칭 보너스 점수
    const queryLower = query.toLowerCase();
    this.documents.forEach((doc, index) => {
      const titleMatch = doc.title.toLowerCase().includes(queryLower);
      const contentMatch = doc.content.toLowerCase().includes(queryLower);

      if (titleMatch || contentMatch) {
        const bonus = titleMatch ? 1.0 : 0.5;
        const currentScore = docScores.get(index) || 0;
        docScores.set(index, currentScore + bonus);
      }
    });

    // 결과 정렬 및 제한
    return Array.from(docScores.entries())
      .sort((a, b) => b[1] - a[1]) // 점수순 내림차순
      .slice(0, limit)
      .map(([docIndex, score]) => {
        const doc = this.documents[docIndex];
        if (!doc) {
          throw new Error(`Document at index ${docIndex} not found`);
        }
        return {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          url: doc.url,
          score: parseFloat(score.toFixed(3)),
          snippet: this.generateSnippet(doc.content, query),
          metadata: doc.metadata
        };
      });
  }

  /**
   * 검색 결과 스니펫 생성
   * @param content - 문서 내용
   * @param query - 검색 쿼리
   * @returns 스니펫 문자열
   */
  private generateSnippet(content: string, query: string): string {
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const index = contentLower.indexOf(queryLower);
    
    if (index === -1) {
      return content.substring(0, 200) + '...';
    }
    
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + query.length + 100);
    const snippet = content.substring(start, end);
    
    return (start > 0 ? '...' : '') + snippet + (end < content.length ? '...' : '');
  }
}
