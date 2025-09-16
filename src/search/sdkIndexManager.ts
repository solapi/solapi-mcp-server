/**
 * @file 검색 인덱스 관리자
 * @description 예제 데이터의 빠른 검색을 위한 인덱스를 생성하고 관리합니다.
 */
import type { Example } from '../types';

export interface SearchIndex {
  keywordIndex: Map<string, Set<string>>;
  categoryIndex: Map<string, Set<string>>;
  languageIndex: Map<string, Set<string>>;
  titleIndex: Map<string, Set<string>>;
  descriptionIndex: Map<string, Set<string>>;
}

export class SdkIndexManager {
  private static instance: SdkIndexManager;
  private index: SearchIndex;
  private examples: Map<string, Example> = new Map();
  private synonyms: Map<string, string[]> = new Map();

  private constructor() {
    this.index = {
      keywordIndex: new Map(),
      categoryIndex: new Map(),
      languageIndex: new Map(),
      titleIndex: new Map(),
      descriptionIndex: new Map()
    };
    this.initializeSynonyms();
  }

  static getInstance(): SdkIndexManager {
    if (!SdkIndexManager.instance) {
      SdkIndexManager.instance = new SdkIndexManager();
    }
    return SdkIndexManager.instance;
  }

  /**
   * 유사어 사전을 초기화합니다.
   */
  private initializeSynonyms(): void {
    // SMS 관련 유사어
    this.synonyms.set('sms', ['단문', '메시지', '문자', '단문메시지', '단문 메시지']);
    this.synonyms.set('단문', ['sms', '메시지', '문자', '단문메시지', '단문 메시지']);
    this.synonyms.set('메시지', ['sms', '단문', '문자', '메세지']);
    this.synonyms.set('문자', ['sms', '단문', '메시지', '메세지']);

    // LMS 관련 유사어
    this.synonyms.set('lms', ['장문', '장문메시지', '장문 메시지', '긴메시지', '긴 메시지']);
    this.synonyms.set('장문', ['lms', '장문메시지', '장문 메시지', '긴메시지', '긴 메시지']);
    this.synonyms.set('장문메시지', ['lms', '장문', '장문 메시지', '긴메시지', '긴 메시지']);

    // 알림톡 관련 유사어
    this.synonyms.set('알림톡', ['카카오톡', '카톡', '알림톡메시지', '알림톡 메시지']);
    this.synonyms.set('카카오톡', ['알림톡', '카톡', '알림톡메시지', '알림톡 메시지']);
    this.synonyms.set('카톡', ['알림톡', '카카오톡', '알림톡메시지', '알림톡 메시지']);

    // 대량발송 관련 유사어
    this.synonyms.set('대량발송', ['대량', '발송', '대량 발송', '대량메시지', '대량 메시지', '그룹발송', '그룹 발송']);
    this.synonyms.set('대량', ['대량발송', '발송', '대량 발송', '대량메시지', '대량 메시지', '그룹발송', '그룹 발송']);
    this.synonyms.set('발송', ['대량발송', '대량', '대량 발송', '전송', '보내기']);
    this.synonyms.set('그룹발송', ['대량발송', '대량', '그룹 발송', '대량 발송']);
    this.synonyms.set('그룹', ['그룹발송', '그룹 발송', '대량발송', '대량']);

    // 예약발송 관련 유사어
    this.synonyms.set('예약발송', ['예약', '예약 발송', '스케줄', '스케줄발송', '스케줄 발송', '지연발송', '지연 발송']);
    this.synonyms.set('예약', ['예약발송', '예약 발송', '스케줄', '스케줄발송', '스케줄 발송']);
    this.synonyms.set('스케줄', ['예약발송', '예약', '스케줄발송', '스케줄 발송']);

    // 웹훅 관련 유사어
    this.synonyms.set('웹훅', ['webhook', '콜백', 'callback', '웹훅처리', '웹훅 처리']);
    this.synonyms.set('webhook', ['웹훅', '콜백', 'callback', '웹훅처리', '웹훅 처리']);
    this.synonyms.set('콜백', ['웹훅', 'webhook', 'callback', '웹훅처리', '웹훅 처리']);

    // 에러처리 관련 유사어
    this.synonyms.set('에러처리', ['에러', '오류', '오류처리', '오류 처리', '예외처리', '예외 처리', '핸들링']);
    this.synonyms.set('에러', ['에러처리', '오류', '오류처리', '오류 처리', '예외처리', '예외 처리']);
    this.synonyms.set('오류', ['에러처리', '에러', '오류처리', '오류 처리', '예외처리', '예외 처리']);

    // 상태조회 관련 유사어
    this.synonyms.set('상태조회', ['상태', '조회', '상태 조회', '결과조회', '결과 조회', '발송결과', '발송 결과']);
    this.synonyms.set('상태', ['상태조회', '조회', '상태 조회', '결과조회', '결과 조회']);
    this.synonyms.set('조회', ['상태조회', '상태', '상태 조회', '결과조회', '결과 조회']);

    // 계정관리 관련 유사어
    this.synonyms.set('계정관리', ['계정', '관리', '계정 관리', '잔액', '포인트', '잔액조회', '잔액 조회']);
    this.synonyms.set('계정', ['계정관리', '관리', '계정 관리', '잔액', '포인트']);
    this.synonyms.set('잔액', ['계정관리', '계정', '포인트', '잔액조회', '잔액 조회', 'balance']);

    // 언어별 유사어
    this.synonyms.set('nodejs', ['node.js', 'node', 'javascript', 'js', '자바스크립트']);
    this.synonyms.set('node.js', ['nodejs', 'node', 'javascript', 'js', '자바스크립트']);
    this.synonyms.set('javascript', ['nodejs', 'node.js', 'node', 'js', '자바스크립트']);
    this.synonyms.set('js', ['nodejs', 'node.js', 'node', 'javascript', '자바스크립트']);
    this.synonyms.set('java', ['자바', '자바언어']);
    this.synonyms.set('python', ['파이썬', '파이선']);
    this.synonyms.set('go', ['golang', '고언어']);
    this.synonyms.set('golang', ['go', '고언어']);
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
   * 키워드로 예제 ID들을 검색합니다. (유사어 및 부분 매칭 지원)
   */
  searchByKeyword(keyword: string): string[] {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const results = new Set<string>();

    // 1. 정확한 매치
    const exactMatch = this.index.keywordIndex.get(normalizedKeyword);
    if (exactMatch) {
      exactMatch.forEach(id => results.add(id));
    }

    // 2. 유사어 매치
    const synonyms = this.synonyms.get(normalizedKeyword) || [];
    synonyms.forEach(synonym => {
      const synonymMatch = this.index.keywordIndex.get(synonym);
      if (synonymMatch) {
        synonymMatch.forEach(id => results.add(id));
      }
    });

    // 3. 부분 매치 (양방향)
    for (const [indexedKeyword, exampleIds] of this.index.keywordIndex) {
      // 검색어가 인덱스 키워드에 포함되는 경우
      if (indexedKeyword.includes(normalizedKeyword)) {
        exampleIds.forEach(id => results.add(id));
      }
      // 인덱스 키워드가 검색어에 포함되는 경우
      if (normalizedKeyword.includes(indexedKeyword)) {
        exampleIds.forEach(id => results.add(id));
      }
    }

    // 4. 유사어의 부분 매치도 검색
    synonyms.forEach(synonym => {
      for (const [indexedKeyword, exampleIds] of this.index.keywordIndex) {
        if (indexedKeyword.includes(synonym) || synonym.includes(indexedKeyword)) {
          exampleIds.forEach(id => results.add(id));
        }
      }
    });

    return Array.from(results);
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
   * 복합 검색을 수행합니다. (개선된 유사어 및 부분 매칭)
   */
  searchComplex(query: string, category?: string, language?: string): string[] {
    const queryWords = this.extractWords(query);
    const resultSets: Set<string>[] = [];

    // 1. 전체 쿼리로 키워드 검색
    const keywordResults = this.searchByKeyword(query);
    if (keywordResults.length > 0) {
      resultSets.push(new Set(keywordResults));
    }

    // 2. 쿼리 단어별 키워드 검색
    queryWords.forEach(word => {
      const wordResults = this.searchByKeyword(word);
      if (wordResults.length > 0) {
        resultSets.push(new Set(wordResults));
      }
    });

    // 3. 제목 검색 (개선된 부분 매칭)
    queryWords.forEach(word => {
      const titleResults = this.searchByTitle(word);
      if (titleResults.length > 0) {
        resultSets.push(new Set(titleResults));
      }
    });

    // 4. 설명 검색 (개선된 부분 매칭)
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
