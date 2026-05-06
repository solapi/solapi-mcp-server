import type { DocumentData } from '../types/index.js';

export class WebDocumentDataManager {
  static getDocuments(): DocumentData[] {
    const basicDocs: DocumentData[] = [
      {
        id: 'auth-api-key',
        title: 'API Key 인증',
        content: 'HMAC-SHA256 또는 HMAC-MD5 알고리즘을 사용한 서명 기반 인증 방법입니다. API Key와 API Secret을 이용해 안전하게 API를 호출할 수 있습니다. 요청 헤더에 Authorization 필드를 포함해야 합니다.',
        url: 'https://developers.solapi.com/references/authentication/api-key',
        category: 'authentication',
        tags: ['api', 'key', '인증', 'hmac', 'sha256', 'md5', 'authentication', 'authorization', '서명', '보안'],
        metadata: {
          keywords: ['api', 'key', '인증', 'hmac', 'sha256', 'md5', 'authentication', 'authorization', '서명', '보안']
        }
      },
      {
        id: 'sms-send',
        title: 'SMS 발송',
        content: '단문 메시지 서비스로 90바이트(한글 45자, 영어 90자) 제한이 있습니다. 발신번호, 수신번호, 메시지 내용이 필수 필드입니다. 비용은 건당 15원이며, 통신사별로 전송 속도가 다를 수 있습니다.',
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
        category: 'messaging',
        tags: ['sms', '단문', '문자', '발송', '90바이트', '45자', '메시지', '텍스트'],
        metadata: {
          keywords: ['sms', '단문', '문자', '발송', '90바이트', '45자', '메시지', '텍스트']
        }
      },
      {
        id: 'lms-send',
        title: 'LMS 발송',
        content: '장문 메시지 서비스로 2000바이트(한글 1000자) 제한이 있습니다. 제목(40바이트)을 추가할 수 있으며, 수신자의 데이터 연결이 필요합니다. SMS보다 비용이 높지만 더 많은 정보를 전달할 수 있습니다.',
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
        category: 'messaging',
        tags: ['lms', '장문', '문자', '발송', '2000바이트', '1000자', '제목', '데이터'],
        metadata: {
          keywords: ['lms', '장문', '문자', '발송', '2000바이트', '1000자', '제목', '데이터']
        }
      },
      {
        id: 'ata-send',
        title: '알림톡 (ATA)',
        content: '사전 승인된 템플릿을 사용하는 정보성 메시지입니다. 변수 치환, 버튼 추가, 강조 표기 등을 지원하며 1000자 제한이 있습니다. 실패 시 SMS/LMS로 대체 발송이 가능합니다. 높은 도달률과 무료 발송이 장점입니다.',
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
        category: 'messaging',
        tags: ['알림톡', 'ata', '카카오톡', '템플릿', '1000자', '정보성', '무료', '도달률'],
        metadata: {
          keywords: ['알림톡', 'ata', '카카오톡', '템플릿', '1000자', '정보성', '무료', '도달률']
        }
      },
      {
        id: 'cta-send',
        title: '친구톡 (CTA)',
        content: '채널 친구에게만 발송 가능한 광고성 메시지입니다. 템플릿 승인 없이 자유로운 내용 작성이 가능하며 1000자 제한이 있습니다. adFlag로 광고 여부를 명시해야 하며, 친구 관계가 필수 조건입니다.',
        url: 'https://developers.solapi.com/references/messages/sendManyDetail',
        category: 'messaging',
        tags: ['친구톡', 'cta', '카카오톡', '광고', '채널', '친구', '자유', 'adflag'],
        metadata: {
          keywords: ['친구톡', 'cta', '카카오톡', '광고', '채널', '친구', '자유', 'adflag']
        }
      },
      {
        id: 'nodejs-sdk',
        title: 'Node.js SDK',
        content: 'npm을 통한 설치 방법과 다양한 예제 코드를 제공합니다. 메시지 발송, 잔액 조회, 예약 발송 등의 기능을 지원하며 Promise와 async/await 패턴을 모두 사용할 수 있습니다.',
        url: 'https://developers.solapi.com/category/nodejs',
        category: 'sdk',
        tags: ['nodejs', 'node', 'sdk', 'npm', 'javascript', 'promise', 'async'],
        metadata: {
          keywords: ['nodejs', 'node', 'sdk', 'npm', 'javascript', 'promise', 'async']
        }
      },
      {
        id: 'status-codes',
        title: '메시지 상태 코드',
        content: '메시지 발송 상태를 나타내는 코드 체계입니다. 2000번대는 정상 발송, 3000번대는 발송 중, 4000번대는 실패를 의미합니다. 각 코드별로 상세한 설명과 대응 방법을 제공합니다.',
        url: 'https://developers.solapi.com/references/message-status-codes',
        category: 'reference',
        tags: ['상태코드', 'status', 'code', '2000', '3000', '4000', '발송상태', '에러'],
        metadata: {
          keywords: ['상태코드', 'status', 'code', '2000', '3000', '4000', '발송상태', '에러']
        }
      },
      {
        id: 'balance-check',
        title: '잔액 확인',
        content: '현재 계정의 충전 잔액(balance)과 보너스 포인트(point)를 실시간으로 조회합니다. 잔액 부족 시 메시지 발송이 실패하므로 정기적인 확인이 필요합니다. API를 통해 자동 충전도 가능합니다.',
        url: 'https://developers.solapi.com/references/cash/getBalance',
        category: 'account',
        tags: ['잔액', 'balance', 'point', '포인트', '충전', '계정', '실시간'],
        metadata: {
          keywords: ['잔액', 'balance', 'point', '포인트', '충전', '계정', '실시간']
        }
      },
      {
        id: 'oauth2-auth',
        title: 'OAuth2 인증',
        content: 'OAuth2.0 표준을 따르는 인증 방식입니다. Access Token과 Refresh Token을 사용하여 보안성을 높였습니다. 토큰 만료 시 자동 갱신이 가능하며, 사용자별 권한 관리도 지원합니다.',
        url: 'https://developers.solapi.com/references/authentication/oauth2',
        category: 'authentication',
        tags: ['oauth2', 'oauth', '토큰', 'token', 'access', 'refresh', '권한', '보안'],
        metadata: {
          keywords: ['oauth2', 'oauth', '토큰', 'token', 'access', 'refresh', '권한', '보안']
        }
      },
      {
        id: 'webhook-setup',
        title: '웹훅 설정',
        content: '메시지 발송 결과를 실시간으로 받아볼 수 있는 콜백 URL 설정 방법입니다. 발송 성공/실패, 수신 확인 등의 이벤트를 즉시 전달받을 수 있어 시스템 연동에 필수적입니다.',
        url: 'https://developers.solapi.com/references/webhooks',
        category: 'integration',
        tags: ['웹훅', 'webhook', '콜백', 'callback', '실시간', '이벤트', '연동'],
        metadata: {
          keywords: ['웹훅', 'webhook', '콜백', 'callback', '실시간', '이벤트', '연동']
        }
      }
    ];

    return basicDocs;
  }

  static validateDocuments(documents: DocumentData[]): boolean {
    if (!Array.isArray(documents)) return false;

    return documents.every(doc => {
      return doc.id &&
        doc.title &&
        doc.content &&
        Array.isArray(doc.tags) &&
        doc.url;
    });
  }
}
