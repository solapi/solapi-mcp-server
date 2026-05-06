import type { PolicyStore } from '../../../exec/policyStore.js';
import { checkSend } from '../../../exec/safetyGate.js';
import type { ToolResult } from '../../../types/index.js';
import { errorResult, jsonResult, textResult } from '../base.js';
import { buildFlags, buildGlobalFlags } from '../argBuilder.js';
import { runSolactlJson } from '../../../exec/solactlRunner.js';

export interface CommonSendArgs {
  to: string[] | string;
  from?: string | undefined;
  text: string;
  scheduled?: string | undefined;
  skipValidation?: boolean | undefined;
  strict?: boolean | undefined;
  profile?: string | undefined;
  timeoutSec?: number | undefined;
  confirmed?: boolean | undefined;
}

export function commonSendInputProps(textRequired = true): Record<string, unknown> {
  return {
    to: {
      anyOf: [
        { type: 'string', description: 'Single recipient phone number.' },
        { type: 'array', items: { type: 'string' }, description: 'Multiple recipient phone numbers.' },
      ],
      description: 'Recipient phone number(s). Use the format expected by SOLAPI (e.g. 01012345678).',
    },
    from: {
      type: 'string',
      description: 'Sender phone number. Optional — if omitted and exactly one active sender is registered, solactl auto-selects it.',
    },
    ...(textRequired ? { text: { type: 'string', description: 'Message body.' } } : {}),
    scheduled: { type: 'string', description: 'Scheduled send time, ISO 8601 (optional).' },
    skipValidation: { type: 'boolean', description: 'Skip client-side validation. Default false.' },
    strict: { type: 'boolean', description: 'Enable strict validation mode. Default false.' },
    profile: { type: 'string', description: 'Override active SOLAPI credential profile.' },
    timeoutSec: { type: 'number', description: 'Per-call timeout in seconds.', minimum: 1 },
    confirmed: {
      type: 'boolean',
      description:
        'REQUIRED safety gate. When false (or omitted), the tool returns a dry-run preview WITHOUT calling SOLAPI. Set to true only after the user has explicitly approved the message body and recipients.',
    },
  };
}

export function normalizeRecipients(raw: string[] | string | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((s) => s.trim()).filter((s) => s.length > 0);
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export interface PreviewExtras {
  /** "ATA", "RCS" 등 메시지 타입을 명시. */
  type: string;
  /** 도구별 추가 인자 (variables, brandId, templateId 등). */
  details?: Record<string, unknown>;
}

export function previewResult(
  args: CommonSendArgs,
  recipients: string[],
  extras: PreviewExtras,
): ToolResult {
  const preview = {
    dryRun: true,
    type: extras.type,
    from: args.from ?? '(자동 선택 — 활성 발신번호가 1개일 때만)',
    recipientCount: recipients.length,
    recipients,
    text: args.text,
    scheduled: args.scheduled ?? null,
    profile: args.profile ?? '(active)',
    ...(extras.details ?? {}),
    note: '실제 발송하려면 동일 인자에 confirmed: true 를 추가해서 다시 호출하세요. 이 호출은 SOLAPI를 호출하지 않았습니다.',
  };
  return jsonResult(preview);
}

/**
 * 발송 도구 공통 실행 흐름.
 * - confirmed=false → preview 반환
 * - confirmed=true → policy/gate 검증 → solactl 호출
 *
 * @param subcommand send 다음에 올 인자 ("sms", "lms", ...)
 * @param extraFlags 메시지 타입별 추가 플래그 (예: --subject, --image, --pfid 등)
 */
export async function executeSend(
  policy: PolicyStore,
  args: CommonSendArgs,
  subcommand: string,
  preview: PreviewExtras,
  extraFlags: Record<string, unknown> = {},
): Promise<ToolResult> {
  const recipients = normalizeRecipients(args.to);
  if (recipients.length === 0) return errorResult('to(수신자)가 비어 있습니다.');
  if (!args.text) return errorResult('text(메시지 본문)가 비어 있습니다.');

  if (!args.confirmed) {
    return previewResult(args, recipients, preview);
  }

  const gate = checkSend(policy, { recipients, from: args.from });
  if (!gate.ok) return errorResult(`발송 거부: ${gate.reason}`);

  const flags = buildFlags({
    '--to': recipients.join(','),
    '--from': args.from,
    '--text': args.text,
    '--scheduled': args.scheduled,
    '--skip-validation': args.skipValidation,
    '--strict': args.strict,
    ...extraFlags,
  });

  const cliArgs = [
    ...buildGlobalFlags({ profile: args.profile, timeoutSec: args.timeoutSec }),
    'send',
    subcommand,
    ...flags,
  ];

  try {
    const json = await runSolactlJson(cliArgs);
    return jsonResult(json);
  } catch (err) {
    return errorResult((err as Error).message);
  }
}

/** ATA/BMS는 text가 옵션(템플릿 본문 사용). 별도 실행기. */
export async function executeTemplateSend(
  policy: PolicyStore,
  args: Omit<CommonSendArgs, 'text'> & { text?: string | undefined },
  subcommand: string,
  preview: PreviewExtras,
  extraFlags: Record<string, unknown> = {},
): Promise<ToolResult> {
  const recipients = normalizeRecipients(args.to);
  if (recipients.length === 0) return errorResult('to(수신자)가 비어 있습니다.');

  if (!args.confirmed) {
    return previewResult(
      { ...args, text: args.text ?? '(템플릿 본문 사용)' } as CommonSendArgs,
      recipients,
      preview,
    );
  }

  const gate = checkSend(policy, { recipients, from: args.from });
  if (!gate.ok) return errorResult(`발송 거부: ${gate.reason}`);

  const flags = buildFlags({
    '--to': recipients.join(','),
    '--from': args.from,
    '--text': args.text,
    '--scheduled': args.scheduled,
    '--skip-validation': args.skipValidation,
    '--strict': args.strict,
    ...extraFlags,
  });

  const cliArgs = [
    ...buildGlobalFlags({ profile: args.profile, timeoutSec: args.timeoutSec }),
    'send',
    subcommand,
    ...flags,
  ];

  try {
    const json = await runSolactlJson(cliArgs);
    return jsonResult(json);
  } catch (err) {
    return errorResult((err as Error).message);
  }
}

// 미사용 import 경고 방지용 export.
export { textResult };
