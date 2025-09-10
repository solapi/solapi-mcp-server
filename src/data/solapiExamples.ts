/**
 * SOLAPI Node.js SDK 예제 코드 라이브러리
 * @description 실제 사용 가능한 코드 스니펫들을 내장하여 빠른 검색 제공
 */

interface Example {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  code: string;
  usage: string;
  url: string;
}

export class SolapiExamplesLibrary {
  /**
   * 모든 예제 코드 반환
   * @returns 예제 코드 배열
   */
  static getExamples(): Example[] {
    return [
      {
        id: 'sms-send-basic',
        title: 'SMS 기본 발송',
        description: '단문 메시지를 발송하는 기본적인 예제입니다.',
        category: 'SMS',
        keywords: ['sms', '발송', '기본', '단문', '메시지'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function sendSMS() {
  try {
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요! SOLAPI 테스트 메시지입니다.'
    });
    console.log('발송 성공:', result);
  } catch (error) {
    console.error('발송 실패:', error);
  }
}

sendSMS();`,
        usage: '기본적인 SMS 발송이 필요한 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'sms-send-many',
        title: 'SMS 대량 발송',
        description: '여러 수신자에게 동시에 SMS를 발송하는 예제입니다.',
        category: 'SMS',
        keywords: ['sms', '대량', '발송', '여러', '수신자', '배열', 'js', 'javascript', 'node', 'nodejs', 'sendMany'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function sendManySMS() {
  try {
    const result = await messageService.sendMany([
      {
        to: '01012345678',
        from: '01087654321',
        text: '안녕하세요! SOLAPI 테스트 메시지입니다.'
      },
      {
        to: '01011111111',
        from: '01087654321',
        text: '안녕하세요! SOLAPI 테스트 메시지입니다.'
      }
    ]);
    console.log('대량 발송 성공:', result);
  } catch (error) {
    console.error('대량 발송 실패:', error);
  }
}

sendManySMS();`,
        usage: '여러 명에게 동일하거나 다른 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'lms-send',
        title: 'LMS 발송',
        description: '장문 메시지 서비스(LMS)를 발송하는 예제입니다.',
        category: 'LMS',
        keywords: ['lms', '장문', '발송', '제목', '2000바이트'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function sendLMS() {
  try {
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요! SOLAPI LMS 테스트 메시지입니다.\\n\\n이 메시지는 장문 메시지 서비스(LMS)로 발송되었습니다.\\n\\nLMS는 최대 2000바이트까지 전송할 수 있으며, 제목을 포함할 수 있습니다.',
      subject: 'SOLAPI LMS 테스트'
    });
    console.log('LMS 발송 성공:', result);
  } catch (error) {
    console.error('LMS 발송 실패:', error);
  }
}

sendLMS();`,
        usage: '긴 내용의 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'alimtalk-send',
        title: '알림톡 발송',
        description: '카카오톡 알림톡을 발송하는 예제입니다.',
        category: '알림톡',
        keywords: ['알림톡', '카카오톡', '템플릿', '변수', '버튼'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function sendAlimtalk() {
  try {
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요! SOLAPI 알림톡 테스트입니다.',
      kakaoOptions: {
        pfId: 'YOUR_PF_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        variables: {
          '#{name}': '홍길동',
          '#{amount}': '10,000원'
        },
        buttons: [
          {
            name: '자세히 보기',
            type: 'WL',
            url: 'https://developers.solapi.com'
          }
        ]
      }
    });
    console.log('알림톡 발송 성공:', result);
  } catch (error) {
    console.error('알림톡 발송 실패:', error);
  }
}

sendAlimtalk();`,
        usage: '카카오톡 알림톡을 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'balance-check',
        title: '잔액 확인',
        description: '계정의 현재 잔액을 확인하는 예제입니다.',
        category: '계정관리',
        keywords: ['잔액', 'balance', '포인트', '확인', '조회'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function checkBalance() {
  try {
    const result = await messageService.getBalance();
    console.log('현재 잔액:', result.balance);
    console.log('포인트:', result.point);
  } catch (error) {
    console.error('잔액 조회 실패:', error);
  }
}

checkBalance();`,
        usage: '발송 전 잔액을 확인하거나 정기적인 잔액 체크가 필요한 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'message-status',
        title: '메시지 상태 조회',
        description: '발송한 메시지의 상태를 조회하는 예제입니다.',
        category: '상태조회',
        keywords: ['상태', '조회', '메시지', '발송', '결과'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function getMessageStatus() {
  try {
    const result = await messageService.getMessages({
      messageId: 'YOUR_MESSAGE_ID'
    });
    console.log('메시지 상태:', result);
  } catch (error) {
    console.error('상태 조회 실패:', error);
  }
}

getMessageStatus();`,
        usage: '발송한 메시지의 상태를 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'scheduled-send',
        title: '예약 발송',
        description: '특정 시간에 메시지를 발송하도록 예약하는 예제입니다.',
        category: '예약발송',
        keywords: ['예약', '발송', '스케줄', '시간', '지연'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function scheduleMessage() {
  try {
    // 현재 시간으로부터 1시간 후 발송
    const scheduledTime = new Date();
    scheduledTime.setHours(scheduledTime.getHours() + 1);
    
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '예약 발송된 메시지입니다.',
      scheduledDate: scheduledTime.toISOString()
    });
    console.log('예약 발송 성공:', result);
  } catch (error) {
    console.error('예약 발송 실패:', error);
  }
}

scheduleMessage();`,
        usage: '특정 시간에 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'webhook-handler',
        title: '웹훅 처리',
        description: '발송 결과를 받는 웹훅 핸들러 예제입니다.',
        category: '웹훅',
        keywords: ['웹훅', 'webhook', '콜백', '결과', '처리'],
        code: `const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { messageId, status, statusCode, statusMessage } = req.body;
  
  console.log('웹훅 수신:', {
    messageId,
    status,
    statusCode,
    statusMessage
  });
  
  // 발송 성공 처리
  if (status === 'COMPLETE') {
    console.log('메시지 발송 완료:', messageId);
  }
  
  // 발송 실패 처리
  if (status === 'FAILED') {
    console.log('메시지 발송 실패:', messageId, statusMessage);
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('웹훅 서버가 포트 3000에서 실행 중입니다.');
});`,
        usage: '발송 결과를 실시간으로 받아서 처리해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'error-handling',
        title: '에러 처리',
        description: 'SOLAPI 사용 시 발생할 수 있는 에러를 처리하는 예제입니다.',
        category: '에러처리',
        keywords: ['에러', '처리', '예외', '오류', '핸들링'],
        code: `const solapi = require('solapi').default;
const messageService = new solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

async function sendWithErrorHandling() {
  try {
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요! SOLAPI 테스트 메시지입니다.'
    });
    console.log('발송 성공:', result);
  } catch (error) {
    if (error.code === 'INVALID_RECIPIENT') {
      console.error('잘못된 수신자 번호:', error.message);
    } else if (error.code === 'INSUFFICIENT_BALANCE') {
      console.error('잔액 부족:', error.message);
    } else if (error.code === 'INVALID_SENDER') {
      console.error('잘못된 발신자 번호:', error.message);
    } else {
      console.error('알 수 없는 오류:', error.message);
    }
  }
}

sendWithErrorHandling();`,
        usage: '안정적인 메시지 발송을 위해 에러 처리가 필요한 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'typescript-example',
        title: 'TypeScript 사용 예제',
        description: 'TypeScript로 SOLAPI를 사용하는 예제입니다.',
        category: 'TypeScript',
        keywords: ['typescript', 'ts', '타입', '인터페이스', '제네릭'],
        code: `import Solapi from 'solapi';

type Message = {
  to: string;
  from: string;
  text: string;
  subject?: string;
};

async function sendManyTS() {
  const client = new Solapi('YOUR_API_KEY', 'YOUR_API_SECRET');

  const messages: Message[] = [
    {
      to: '01012345678',
      from: '01087654321',
      text: 'TypeScript로 발송된 메시지입니다.'
    }
  ];

  try {
    const result = await (client as any).sendMany(messages);
    console.log('대량 발송 성공:', result);
  } catch (error: any) {
    console.error('발송 실패:', error.message);
  }
}

sendManyTS();`,
        usage: 'TypeScript 프로젝트에서 SOLAPI를 사용하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      }
    ];
  }

  /**
   * 카테고리별 예제 코드 반환
   * @param category - 카테고리명
   * @returns 해당 카테고리의 예제 코드 배열
   */
  static getExamplesByCategory(category: string): Example[] {
    return this.getExamples().filter(example => 
      example.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * ID로 특정 예제 코드 반환
   * @param id - 예제 ID
   * @returns 해당 ID의 예제 코드 또는 null
   */
  static getExampleById(id: string): Example | null {
    return this.getExamples().find(example => example.id === id) || null;
  }

  /**
   * 키워드로 예제 코드 검색
   * @param keyword - 검색 키워드
   * @returns 검색된 예제 코드 배열
   */
  static searchExamples(keyword: string): Example[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getExamples().filter(example => 
      example.title.toLowerCase().includes(lowerKeyword) ||
      example.description.toLowerCase().includes(lowerKeyword) ||
      example.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
      example.code.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 사용 가능한 카테고리 목록 반환
   * @returns 카테고리 배열
   */
  static getCategories(): string[] {
    const categories = new Set(this.getExamples().map(example => example.category));
    return Array.from(categories);
  }
}