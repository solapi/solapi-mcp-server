/**
 * 발송·변경 도구의 안전 정책을 보관한다.
 *
 * 환경변수는 ceiling(상한) 역할을 한다 — MCP 도구로 정책을 동적으로 조정할 수
 * 있지만 환경변수가 설정한 한계를 넘을 수는 없다. 변경은 세션 한정이며 디스크에
 * 쓰지 않는다 (재시작 시 환경변수 기준으로 리셋).
 */

export interface MutablePolicy {
  sendEnabled: boolean;
  maxRecipients: number;
  allowedSenders: string[] | null; // null = 무제한
}

export interface PolicySnapshot extends MutablePolicy {
  sendHardLocked: boolean;
  maxRecipientsCeiling: number | null;
  allowedSendersCeiling: string[] | null;
}

const DEFAULT_MAX_RECIPIENTS = 10;

function parsePositiveInt(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function parseSenders(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return list.length === 0 ? null : list;
}

function parseBool(raw: string | undefined): boolean {
  if (!raw) return false;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

export class PolicyStore {
  private current: MutablePolicy;
  private readonly hardLockSend: boolean;
  private readonly maxRecipientsCeiling: number | null;
  private readonly allowedSendersCeiling: string[] | null;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.hardLockSend = parseBool(env.SOLAPI_MCP_DISABLE_SEND);
    this.maxRecipientsCeiling = parsePositiveInt(env.SOLAPI_MCP_MAX_RECIPIENTS);
    this.allowedSendersCeiling = parseSenders(env.SOLAPI_MCP_ALLOWED_SENDERS);

    const initialSendEnabled = !this.hardLockSend && parseBool(env.SOLAPI_MCP_ENABLE_SEND);
    const initialMaxRecipients = this.maxRecipientsCeiling ?? DEFAULT_MAX_RECIPIENTS;

    this.current = {
      sendEnabled: initialSendEnabled,
      maxRecipients: initialMaxRecipients,
      allowedSenders: this.allowedSendersCeiling ? [...this.allowedSendersCeiling] : null,
    };
  }

  snapshot(): PolicySnapshot {
    return {
      ...this.current,
      allowedSenders: this.current.allowedSenders ? [...this.current.allowedSenders] : null,
      sendHardLocked: this.hardLockSend,
      maxRecipientsCeiling: this.maxRecipientsCeiling,
      allowedSendersCeiling: this.allowedSendersCeiling ? [...this.allowedSendersCeiling] : null,
    };
  }

  /**
   * 정책을 변경한다. ceiling을 위반하면 throw한다.
   * 부분 업데이트 — undefined인 필드는 기존 값을 유지.
   */
  update(patch: Partial<MutablePolicy>): PolicySnapshot {
    if (patch.sendEnabled !== undefined) {
      if (patch.sendEnabled && this.hardLockSend) {
        throw new Error(
          'SOLAPI_MCP_DISABLE_SEND=true로 발송이 잠겨 있습니다. 환경변수를 해제 후 MCP 서버를 재시작하세요.',
        );
      }
      this.current.sendEnabled = patch.sendEnabled;
    }

    if (patch.maxRecipients !== undefined) {
      if (!Number.isInteger(patch.maxRecipients) || patch.maxRecipients <= 0) {
        throw new Error('maxRecipients는 양의 정수여야 합니다.');
      }
      if (this.maxRecipientsCeiling !== null && patch.maxRecipients > this.maxRecipientsCeiling) {
        throw new Error(
          `maxRecipients=${patch.maxRecipients}는 환경변수 ceiling(${this.maxRecipientsCeiling})을 초과합니다.`,
        );
      }
      this.current.maxRecipients = patch.maxRecipients;
    }

    if (patch.allowedSenders !== undefined) {
      if (patch.allowedSenders !== null) {
        if (this.allowedSendersCeiling !== null) {
          const bad = patch.allowedSenders.filter((s) => !this.allowedSendersCeiling!.includes(s));
          if (bad.length > 0) {
            throw new Error(
              `다음 발신번호는 환경변수 ceiling에 포함되지 않아 허용 목록에 추가할 수 없습니다: ${bad.join(', ')}`,
            );
          }
        }
        this.current.allowedSenders = [...patch.allowedSenders];
      } else {
        if (this.allowedSendersCeiling !== null) {
          throw new Error(
            'SOLAPI_MCP_ALLOWED_SENDERS가 설정되어 있어 allowedSenders를 null(무제한)로 변경할 수 없습니다.',
          );
        }
        this.current.allowedSenders = null;
      }
    }

    return this.snapshot();
  }
}
