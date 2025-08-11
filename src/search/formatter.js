/**
 * 검색 결과 포맷팅 유틸리티
 */
export class SearchResultFormatter {
  /**
   * 검색 결과 포맷팅
   * @param {string} query - 검색 쿼리
   * @param {Array} results - 검색 결과
   * @returns {string} 포맷된 결과 문자열
   */
  static formatResults(query, results) {
    const header = `🔍 **SOLAPI 문서 검색 결과** (키워드: "${query}")\n`;
    const stats = `📊 **${results.length}개 결과** | 관련도 점수 기준 정렬\n\n`;

    const formattedResults = results
      .map((doc, index) => {
        const rank = index + 1;
        const score = doc.relevanceScore;
        const scoreBar = this.getScoreBar(parseFloat(score));

        return [
          `## ${rank}. ${doc.title}`,
          `🎯 **관련도**: ${score} ${scoreBar}`,
          `📝 ${doc.content}`,
          `🔗 [자세히 보기](${doc.url})`,
          ''
        ].join('\n');
      })
      .join('\n');

    const footer = `\n💡 **검색 팁**: 더 정확한 결과를 원하면 구체적인 키워드를 사용하세요!`;

    return header + stats + formattedResults + footer;
  }

  /**
   * 점수 시각화 바 생성
   * @param {number} score - 관련도 점수
   * @returns {string} 시각화 바
   */
  static getScoreBar(score) {
    const maxBars = 5;
    const filledBars = Math.min(maxBars, Math.ceil(score * 2));
    const emptyBars = maxBars - filledBars;

    return '🟩'.repeat(filledBars) + '⬜'.repeat(emptyBars);
  }

  /**
   * 빈 결과 메시지 생성
   * @param {string} query - 검색 쿼리
   * @returns {string} 빈 결과 메시지
   */
  static formatEmptyResult(query) {
    return `"${query}"에 대한 검색 결과가 없습니다.\n\n💡 다른 키워드로 시도해보세요: SMS, 알림톡, API, Node.js, 잔액 등`;
  }
}