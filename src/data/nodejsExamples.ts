import type {Example} from "../types";

/**
 * SOLAPI Node.js SDK 예제 코드 라이브러리
 * @description Node.js/JavaScript/TypeScript용 실제 사용 가능한 코드 스니펫들을 내장하여 빠른 검색 제공
 */
export class NodejsExamplesLibrary {
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
        keywords: ['sms', '발송', '기본', '단문', '메시지', 'nodejs', 'node.js', 'node', 'javascript', 'js'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['sms', '대량', '발송', '여러', '수신자', '배열', 'js', 'javascript', 'node', 'nodejs', 'node.js', 'sendMany'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['lms', '장문', '발송', '제목', '2000바이트', 'nodejs', 'node.js', 'node', 'javascript', 'js'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['알림톡', '카카오톡', '템플릿', '변수', '버튼', 'nodejs', 'node.js', 'node', 'javascript', 'js'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['잔액', 'balance', '포인트', '확인', '조회', 'nodejs', 'javascript'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['상태', '조회', '메시지', '발송', '결과', 'nodejs', 'javascript'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['예약', '발송', '스케줄', '시간', '지연', 'nodejs', 'javascript'],
        code: `const {solapi} = require('solapi');
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
        keywords: ['웹훅', 'webhook', '콜백', '결과', '처리', 'nodejs', 'javascript', 'express'],
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
        keywords: ['에러', '처리', '예외', '오류', '핸들링', 'nodejs', 'javascript'],
        code: `const {solapi} = require('solapi');
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
        id: 'rcs-send',
        title: 'RCS 메시지 발송',
        description: 'RCS(Rich Communication Services) 메시지를 발송하는 예제입니다.',
        category: 'RCS',
        keywords: ['rcs', '브랜드', '버튼', '웹링크', '예약발송', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

// RCS 메시지 발송
async function sendRCS() {
  try {
    const result = await messageService.sendOne({
      to: '01012345678',
      from: '01087654321',
      text: 'RCS 메시지 테스트입니다.',
      rcsOptions: {
        brandId: 'YOUR_BRAND_ID',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://developers.solapi.com'
          }
        ]
      }
    });
    console.log('RCS 발송 성공:', result);
  } catch (error) {
    console.error('RCS 발송 실패:', error);
  }
}

sendRCS();`,
        usage: 'RCS를 지원하는 단말기에 브랜드 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'voice-send',
        title: '음성 메시지 발송',
        description: '음성으로 메시지를 전달하는 예제입니다.',
        category: '음성메시지',
        keywords: ['음성', 'voice', '전화', 'tts', '남성', '여성', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function sendVoiceMessage() {
  try {
    const result = await messageService.send({
      to: '01012345678',
      from: '01087654321',
      text: '음성 메시지 테스트입니다. 실제 수신자에게 들리는 내용입니다.',
      voiceOptions: {
        voiceType: 'FEMALE', // MALE 또는 FEMALE
        headerMessage: '보이스 메시지 테스트',
        tailMessage: '감사합니다.'
      }
    });
    console.log('음성 메시지 발송 성공:', result);
  } catch (error) {
    console.error('음성 메시지 발송 실패:', error);
  }
}

sendVoiceMessage();`,
        usage: '문자 대신 음성으로 메시지를 전달해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'mms-send',
        title: 'MMS(사진 문자) 발송',
        description: '이미지가 포함된 사진 문자를 발송하는 예제입니다.',
        category: 'MMS',
        keywords: ['mms', '사진', '이미지', '멀티미디어', '첨부파일', 'nodejs', 'javascript'],
        code: `const path = require('path');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function sendMMS() {
  try {
    // 이미지 파일 업로드
    const uploadResult = await messageService.uploadFile(
      path.join(__dirname, 'image.jpg'), 
      'MMS'
    );
    
    // MMS 발송
    const result = await messageService.sendOne({
      to: '01012345678',
      from: '01087654321',
      text: '사진 문자 테스트입니다.',
      subject: 'MMS 테스트',
      imageId: uploadResult.fileId
    });
    console.log('MMS 발송 성공:', result);
  } catch (error) {
    console.error('MMS 발송 실패:', error);
  }
}

sendMMS();`,
        usage: '이미지와 함께 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'friendtalk-send',
        title: '카카오 친구톡 발송',
        description: '카카오톡 친구톡을 발송하는 예제입니다.',
        category: '친구톡',
        keywords: ['친구톡', '카카오톡', 'pfid', '비즈니스채널', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function sendFriendtalk() {
  try {
    const result = await messageService.sendOne({
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요! 카카오 친구톡 테스트 메시지입니다.',
      kakaoOptions: {
        pfId: 'YOUR_PF_ID'
      }
    });
    console.log('친구톡 발송 성공:', result);
  } catch (error) {
    console.error('친구톡 발송 실패:', error);
  }
}

sendFriendtalk();`,
        usage: '카카오톡 친구톡을 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'get-blacks',
        title: '080 차단 목록 조회',
        description: '080 수신 거부 목록을 조회하는 예제입니다.',
        category: 'IAM',
        keywords: ['차단', '080', '수신거부', '블랙리스트', '조회', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function getBlackList() {
  try {
    const result = await messageService.getBlacks({
      // senderNumber: '029302266', // 특정 발신번호로 검색
      // startDate: '2023-01-01 00:00:00',
      // endDate: '2023-12-31 23:59:59'
    });
    
    console.log('차단 목록:', result.blackList);
    
    // 다음 페이지가 있을 경우
    if (result.nextKey) {
      const nextPage = await messageService.getBlacks({
        startKey: result.nextKey
      });
      console.log('다음 페이지:', nextPage.blackList);
    }
  } catch (error) {
    console.error('차단 목록 조회 실패:', error);
  }
}

getBlackList();`,
        usage: '발송 전 차단된 번호를 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'get-messages-detailed',
        title: '메시지 상세 조회',
        description: '발송한 메시지의 상세 정보를 조회하는 예제입니다.',
        category: '상태조회',
        keywords: ['메시지', '조회', '상태', '발송결과', '통계', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function getDetailedMessages() {
  try {
    // 전체 메시지 조회
    const result = await messageService.getMessages({
      limit: 10,
      // messageId: 'M4V...', // 특정 메시지 ID로 검색
      // from: '01087654321', // 발신번호로 검색
      // to: '01012345678', // 수신번호로 검색
      // type: 'SMS', // 메시지 타입으로 검색
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      endDate: new Date()
    });
    
    console.log('메시지 목록:', result.messageList);
    console.log('총 개수:', result.totalCount);
    
    // 페이징 처리
    if (result.nextKey) {
      const nextPage = await messageService.getMessages({
        startKey: result.nextKey
      });
      console.log('다음 페이지:', nextPage.messageList);
    }
  } catch (error) {
    console.error('메시지 조회 실패:', error);
  }
}

getDetailedMessages();`,
        usage: '발송한 메시지의 상태를 상세히 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'get-statistics',
        title: '발송 통계 조회',
        description: '메시지 발송 통계를 조회하는 예제입니다.',
        category: '통계',
        keywords: ['통계', 'statistics', '성공률', '발송량', '분석', 'nodejs', 'javascript'],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'YOUR_API_KEY',
  'YOUR_API_SECRET'
);

async function getStatistics() {
  try {
    const result = await messageService.getStatistics({
      startDate: '2023-01-01 00:00:00',
      endDate: '2023-12-31 23:59:59',
      // messageType: 'SMS', // SMS, LMS, MMS, ATA 등
      // groupBy: 'DATE' // DATE, HOUR, MONTH 등
    });
    
    console.log('발송 통계:', result);
    console.log('총 발송 건수:', result.totalCount);
    console.log('성공 건수:', result.successCount);
    console.log('실패 건수:', result.failCount);
    console.log('성공률:', (result.successCount / result.totalCount * 100).toFixed(2) + '%');
  } catch (error) {
    console.error('통계 조회 실패:', error);
  }
}

getStatistics();`,
        usage: '메시지 발송 성과를 분석해야 하는 경우',
        url: 'https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/common'
      },
      {
        id: 'typescript-example',
        title: 'TypeScript 사용 예제',
        description: 'TypeScript로 SOLAPI를 사용하는 예제입니다.',
        category: 'TypeScript',
        keywords: ['typescript', 'ts', '타입', '인터페이스', '제네릭', 'nodejs', 'node.js', 'node', 'javascript', 'js'],
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
        usage: 'TypeScript 프로젝트에서 SOLAPI를를 사용하는 경우',
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