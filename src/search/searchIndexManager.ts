/**
 * @file 검색 인덱스 관리자
 * @description 예제 데이터의 빠른 검색을 위한 인덱스를 생성하고 관리합니다.
 */
import type { Example } from '../types/index.js';

export interface SearchIndex {
  keywordIndex: Map<string, Set<string>>;
  categoryIndex: Map<string, Set<string>>;
  languageIndex: Map<string, Set<string>>;
  titleIndex: Map<string, Set<string>>;
  descriptionIndex: Map<string, Set<string>>;
}

export class SearchIndexManager {
  private static instance: SearchIndexManager;
  private index: SearchIndex;
  private examples: Map<string, Example> = new Map();

  private constructor() {
    this.index = {
      keywordIndex: new Map(),
      categoryIndex: new Map(),
      languageIndex: new Map(),
      titleIndex: new Map(),
      descriptionIndex: new Map()
    };
  }

  static getInstance(): SearchIndexManager {
    if (!SearchIndexManager.instance) {
      SearchIndexManager.instance = new SearchIndexManager();
    }
    return SearchIndexManager.instance;
  }

  /**
   * 모든 예제 데이터로 인덱스를 구축합니다.
   */
  buildIndex(examples: Example[]): void {
    // 기존 인덱스 초기화
    this.clearIndex();
    
    // 예제 데이터 저장
    examples.forEach(example => {
      this.examples.set(example.id, example);
      this.addToIndex(example);
    });
  }

  /**
   * 단일 예제를 인덱스에 추가합니다.
   */
  private addToIndex(example: Example): void {
    // 키워드 인덱스
    example.keywords.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase();
      if (!this.index.keywordIndex.has(normalizedKeyword)) {
        this.index.keywordIndex.set(normalizedKeyword, new Set());
      }
      this.index.keywordIndex.get(normalizedKeyword)!.add(example.id);
    });

    // 카테고리 인덱스
    const normalizedCategory = example.category.toLowerCase();
    if (!this.index.categoryIndex.has(normalizedCategory)) {
      this.index.categoryIndex.set(normalizedCategory, new Set());
    }
    this.index.categoryIndex.get(normalizedCategory)!.add(example.id);

    // 언어 인덱스 (키워드 기반으로 추론)
    const language = this.detectLanguage(example);
    if (!this.index.languageIndex.has(language)) {
      this.index.languageIndex.set(language, new Set());
    }
    this.index.languageIndex.get(language)!.add(example.id);

    // 제목 인덱스 (단어별로 분리)
    const titleWords = this.extractWords(example.title);
    titleWords.forEach(word => {
      if (!this.index.titleIndex.has(word)) {
        this.index.titleIndex.set(word, new Set());
      }
      this.index.titleIndex.get(word)!.add(example.id);
    });

    // 설명 인덱스 (단어별로 분리)
    const descriptionWords = this.extractWords(example.description);
    descriptionWords.forEach(word => {
      if (!this.index.descriptionIndex.has(word)) {
        this.index.descriptionIndex.set(word, new Set());
      }
      this.index.descriptionIndex.get(word)!.add(example.id);
    });
  }

  /**
   * 예제의 언어를 감지합니다.
   */
  private detectLanguage(example: Example): string {
    if (example.category && example.category.toLowerCase() === 'typescript') {
      return 'typescript';
    }
    
    if (example.keywords.some(k => k.toLowerCase().includes('javascript') || 
                                   k.toLowerCase().includes('nodejs') || 
                                   k.toLowerCase().includes('js') ||
                                   k.toLowerCase().includes('node'))) {
      return 'javascript';
    }
    
    if (example.keywords.some(k => k.toLowerCase().includes('java') || 
                                   k.toLowerCase().includes('kotlin'))) {
      return example.keywords.some(k => k.toLowerCase().includes('kotlin')) ? 'kotlin' : 'java';
    }
    
    if (example.keywords.some(k => k.toLowerCase().includes('python'))) {
      return 'python';
    }
    
    if (example.keywords.some(k => k.toLowerCase().includes('go') || 
                                   k.toLowerCase().includes('golang'))) {
      return 'go';
    }
    
    if (example.keywords.some(k => k.toLowerCase().includes('asp') || 
                                   k.toLowerCase().includes('vbscript'))) {
      return 'asp';
    }
    
    return 'javascript'; // 기본값
  }

  /**
   * 텍스트에서 검색 가능한 단어들을 추출합니다.
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거, 한글 포함
      .split(/\s+/)
      .filter(word => word.length > 1) // 1글자 단어 제외
      .filter(word => !this.isStopWord(word)); // 불용어 제거
  }

  /**
   * 불용어를 확인합니다.
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      '이', '그', '저', '의', '를', '을', '가', '은', '는', '에', '에서', '로', '으로', '와', '과'
    ]);
    return stopWords.has(word);
  }

  /**
   * 키워드로 예제 ID들을 검색합니다.
   */
  searchByKeyword(keyword: string): string[] {
    const normalizedKeyword = keyword.toLowerCase();
    const exactMatch = this.index.keywordIndex.get(normalizedKeyword);
    
    if (exactMatch) {
      return Array.from(exactMatch);
    }

    // 부분 매치 검색
    const partialMatches: string[] = [];
    for (const [indexedKeyword, exampleIds] of this.index.keywordIndex) {
      if (indexedKeyword.includes(normalizedKeyword)) {
        partialMatches.push(...Array.from(exampleIds));
      }
    }

    return [...new Set(partialMatches)]; // 중복 제거
  }

  /**
   * 카테고리로 예제 ID들을 검색합니다.
   */
  searchByCategory(category: string): string[] {
    const normalizedCategory = category.toLowerCase();
    const categorySet = this.index.categoryIndex.get(normalizedCategory);
    return categorySet ? Array.from(categorySet) : [];
  }

  /**
   * 언어로 예제 ID들을 검색합니다.
   */
  searchByLanguage(language: string): string[] {
    const normalizedLanguage = language.toLowerCase();
    const languageSet = this.index.languageIndex.get(normalizedLanguage);
    return languageSet ? Array.from(languageSet) : [];
  }

  /**
   * 제목에서 단어로 검색합니다.
   */
  searchByTitle(word: string): string[] {
    const normalizedWord = word.toLowerCase();
    const titleSet = this.index.titleIndex.get(normalizedWord);
    return titleSet ? Array.from(titleSet) : [];
  }

  /**
   * 설명에서 단어로 검색합니다.
   */
  searchByDescription(word: string): string[] {
    const normalizedWord = word.toLowerCase();
    const descriptionSet = this.index.descriptionIndex.get(normalizedWord);
    return descriptionSet ? Array.from(descriptionSet) : [];
  }

  /**
   * 복합 검색을 수행합니다.
   */
  searchComplex(query: string, category?: string, language?: string): string[] {
    const queryWords = this.extractWords(query);
    const resultSets: Set<string>[] = [];

    // 키워드 검색
    const keywordResults = this.searchByKeyword(query);
    if (keywordResults.length > 0) {
      resultSets.push(new Set(keywordResults));
    }

    // 제목 검색
    queryWords.forEach(word => {
      const titleResults = this.searchByTitle(word);
      if (titleResults.length > 0) {
        resultSets.push(new Set(titleResults));
      }
    });

    // 설명 검색
    queryWords.forEach(word => {
      const descriptionResults = this.searchByDescription(word);
      if (descriptionResults.length > 0) {
        resultSets.push(new Set(descriptionResults));
      }
    });

    // 결과 합치기
    let combinedResults = new Set<string>();
    if (resultSets.length > 0) {
      combinedResults = resultSets.reduce((acc, set) => {
        return new Set([...acc, ...set]);
      });
    }

    // 카테고리 필터 적용
    if (category) {
      const categoryResults = new Set(this.searchByCategory(category));
      combinedResults = new Set([...combinedResults].filter(id => categoryResults.has(id)));
    }

    // 언어 필터 적용
    if (language) {
      const languageResults = new Set(this.searchByLanguage(language));
      combinedResults = new Set([...combinedResults].filter(id => languageResults.has(id)));
    }

    return Array.from(combinedResults);
  }

  /**
   * 예제 ID로 실제 예제 객체를 반환합니다.
   */
  getExampleById(id: string): Example | undefined {
    return this.examples.get(id);
  }

  /**
   * 예제 ID 배열로 실제 예제 객체들을 반환합니다.
   */
  getExamplesByIds(ids: string[]): Example[] {
    return ids
      .map(id => this.examples.get(id))
      .filter((example): example is Example => example !== undefined);
  }

  /**
   * 인덱스 통계를 반환합니다.
   */
  getIndexStats(): {
    totalExamples: number;
    keywordCount: number;
    categoryCount: number;
    languageCount: number;
    titleWordCount: number;
    descriptionWordCount: number;
  } {
    return {
      totalExamples: this.examples.size,
      keywordCount: this.index.keywordIndex.size,
      categoryCount: this.index.categoryIndex.size,
      languageCount: this.index.languageIndex.size,
      titleWordCount: this.index.titleIndex.size,
      descriptionWordCount: this.index.descriptionIndex.size
    };
  }

  /**
   * 모든 인덱스를 초기화합니다.
   */
  clearIndex(): void {
    this.index.keywordIndex.clear();
    this.index.categoryIndex.clear();
    this.index.languageIndex.clear();
    this.index.titleIndex.clear();
    this.index.descriptionIndex.clear();
    this.examples.clear();
  }

  /**
   * 특정 예제를 인덱스에서 제거합니다.
   */
  removeFromIndex(exampleId: string): void {
    const example = this.examples.get(exampleId);
    if (!example) return;

    // 모든 인덱스에서 해당 예제 제거
    this.index.keywordIndex.forEach(set => set.delete(exampleId));
    this.index.categoryIndex.forEach(set => set.delete(exampleId));
    this.index.languageIndex.forEach(set => set.delete(exampleId));
    this.index.titleIndex.forEach(set => set.delete(exampleId));
    this.index.descriptionIndex.forEach(set => set.delete(exampleId));

    this.examples.delete(exampleId);
  }
}
