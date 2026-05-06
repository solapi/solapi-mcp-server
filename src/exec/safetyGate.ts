import type { PolicyStore } from './policyStore.js';

export interface SendCheckInput {
  recipients: string[];
  from?: string | undefined;
}

export interface SendCheckResult {
  ok: boolean;
  reason?: string;
}

/**
 * 발송 전 안전 검증.
 * - 발송 활성화 여부
 * - 수신자 수 상한
 * - 발신번호 화이트리스트 (from 미지정 시 검증 생략 — solactl이 자동 선택함)
 */
export function checkSend(policy: PolicyStore, input: SendCheckInput): SendCheckResult {
  const snap = policy.snapshot();

  if (!snap.sendEnabled) {
    return {
      ok: false,
      reason:
        '발송이 비활성화되어 있습니다. update_mcp_policy({sendEnabled: true})로 활성화하거나 SOLAPI_MCP_ENABLE_SEND=true 환경변수를 설정하세요.',
    };
  }

  if (input.recipients.length === 0) {
    return { ok: false, reason: '수신자가 없습니다.' };
  }

  if (input.recipients.length > snap.maxRecipients) {
    return {
      ok: false,
      reason: `수신자 수 ${input.recipients.length}명이 정책 상한 ${snap.maxRecipients}명을 초과합니다.`,
    };
  }

  if (input.from && snap.allowedSenders !== null && !snap.allowedSenders.includes(input.from)) {
    return {
      ok: false,
      reason: `발신번호 '${input.from}'은 화이트리스트에 없습니다. 허용된 발신번호: ${snap.allowedSenders.join(', ')}`,
    };
  }

  return { ok: true };
}
