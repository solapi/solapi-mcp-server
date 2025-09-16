import type { Example } from "../types";

/**
 * SOLAPI Node.js SDK 예제 코드 라이브러리
 * @description Node.js/JavaScript용 실제 사용 가능한 코드 스니펫들을 내장하여 빠른 검색 제공
 */
export class NodejsExamplesLibrary {
  /**
   * 모든 예제 코드 반환
   * @returns 예제 코드 배열
   */
  static getExamples(): Example[] {
    return [
      {
        id: "get-blacks",
        title: "080 수신 거부 목록 조회",
        description: "080 수신 거부 목록을 조회하는 예제입니다.",
        category: "IAM",
        keywords: [
          "080",
          "수신거부",
          "차단",
          "블랙리스트",
          "조회",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getBlacks({
    // 차단 당한 발신번호를 검색하는 경우
    // senderNumber: '029302266',
    // 날짜로 검색하는 경우
    // startDate: '2022-12-01 00:00:00', // Date 객체로도 요청 가능
    // endDate: '2022-12-31 23:59:59' // Date 객체로도 요청 가능
  })
  .then(res => {
    // 목록
    console.log('#page1', res.blackList);

    // 응답에 nextKey가 있을 경우 다음 페이지도 조회 가능
    messageService
      .getBlacks({
        startKey: res.nextKey,
      })
      .then(res => {
        console.log('#page2', res.blackList);
      });
  });`,
        usage: "080 수신 거부 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/iam",
      },
      {
        id: "get-block-groups",
        title: "080 수신 거부 그룹 조회",
        description: "080 수신 거부 그룹 목록을 조회하는 예제입니다.",
        category: "IAM",
        keywords: [
          "080",
          "수신거부",
          "그룹",
          "차단그룹",
          "조회",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getBlockGroups({
    // 해당 그룹이 켜져있는지 아닌지 확인하고 싶을 경우
    // status: 'ACTIVE' // 'ACTIVE' 혹은 'INACTIVE',
    // 해당 그룹의 대한 이름을 검색해보고 싶을 경우
    // name: '070번호그룹' (부분 검색 가능)
  })
  .then(res => {
    // 목록
    console.log('#page1', res.blockGroups);

    // 응답에 nextKey가 있을 경우 다음 페이지도 조회 가능
    messageService
      .getBlockGroups({
        startKey: res.nextKey,
      })
      .then(res => {
        console.log('#page2', res.blockGroups);
      });
  });`,
        usage: "080 수신 거부 그룹 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/iam",
      },
      {
        id: "get-block-numbers",
        title: "080 수신 거부 번호 조회",
        description: "080 수신 거부 번호 목록을 조회하는 예제입니다.",
        category: "IAM",
        keywords: [
          "080",
          "수신거부",
          "번호",
          "차단번호",
          "조회",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getBlockNumbers({
    // 수신 차단한 수신번호를 검색해보고 싶을 경우
    // phoneNumber: '01000000000',
    // 차단할 때 남긴 메모를 검색해보고 싶을 경우
    // memo: '이벤트 발송' (부분 검색 가능)
  })
  .then(res => {
    // 목록
    console.log('#page1', res.blockNumbers);

    // 응답에 nextKey가 있을 경우 다음 페이지도 조회 가능
    messageService
      .getBlockNumbers({
        startKey: res.nextKey,
      })
      .then(res => {
        console.log('#page2', res.blockNumbers);
      });
  });`,
        usage: "080 수신 거부 번호 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/iam",
      },
      {
        id: "get-balance",
        title: "잔액 조회",
        description: "계정의 현재 잔액과 포인트를 조회하는 예제입니다.",
        category: "계정관리",
        keywords: [
          "잔액",
          "balance",
          "포인트",
          "조회",
          "계정",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getBalance().then(res => {
  // 잔액 조회
  console.log(res.balance);

  // 포인트 조회
  console.log(res.point);
});`,
        usage: "발송 전 잔액을 확인하거나 정기적인 잔액 체크가 필요한 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/inquiry",
      },
      {
        id: "get-messages",
        title: "메시지 조회",
        description: "발송한 메시지들의 상태와 정보를 조회하는 예제입니다.",
        category: "상태조회",
        keywords: [
          "메시지",
          "조회",
          "상태",
          "발송결과",
          "페이징",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getMessages({
    // 불러올 메시지 갯수 제한
    // limit: 5, // 5를 입력하면 5건이 조회됩니다, 미 입력시 20개로 지정
    // 메시지 ID로 검색
    // messageId: '메시지 ID 입력', // 메시지 ID는 대개 M4V로 시작합니다
    // 여러 메시지 ID로 검색
    /*messageIds: [
      '메시지 ID 입력', // 메시지 ID는 대개 M4V로 시작합니다
    ],*/
    // 그룹 ID로 검색
    // groupId: '그룹 ID 입력', // 그룹 ID는 대개 G4V로 시작합니다
    // 발신번호로 검색
    // from: '01012345678',
    // 수신번호로 검색
    // to: '01012345678',
    /**
     * 메시지 타입으로 검색
     * SMS: 단문 문자, LMS: 장문 문자, MMS: 사진 문자, ATA: 알림톡, CTA: 친구톡, CTI: 이미지(1장) 친구톡
     */
    // type: "SMS",
    // 날짜로 검색하는 경우
    // startDate: '2022-12-01 00:00:00', // Date 객체로도 요청 가능
    // endDate: '2022-12-31 23:59:59', // Date 객체로도 요청 가능
  })
  .then(res => console.log(res));

/**
 * 페이징 예제
 * */
messageService.getMessages().then(res => {
  messageService
    .getMessages({
      // startKey 부분에 nextKey를 입력할 경우 초기 20건 다음의 데이터를 표시하게 됩니다.
      startKey: res.nextKey,
    })
    .then(res2 => {
      console.log(res2);
    });
});`,
        usage:
          "발송한 메시지의 상태를 확인하거나 메시지 이력을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/inquiry",
      },
      {
        id: "get-statistics",
        title: "통계 조회",
        description: "메시지 발송 통계를 조회하는 예제입니다.",
        category: "통계",
        keywords: [
          "통계",
          "statistics",
          "성공률",
          "발송량",
          "분석",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getStatistics({
    // 날짜로 검색하는 경우
    // startDate: '2022-12-01 00:00:00', // Date 객체로도 요청 가능
    // endDate: '2022-12-31 23:59:59' // Date 객체로도 요청 가능
  })
  .then(res => console.log(res));`,
        usage: "메시지 발송 성과를 분석하거나 통계 데이터가 필요한 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/inquiry",
      },
      {
        id: "send-alimtalk",
        title: "카카오 알림톡 발송",
        description:
          "카카오 알림톡을 발송하는 예제입니다. 단일/대량/예약 발송을 모두 지원합니다.",
        category: "알림톡",
        keywords: [
          "알림톡",
          "카카오톡",
          "템플릿",
          "변수",
          "pfId",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      templateId: '등록한 알림톡 템플릿의 ID',
      variables: {},
      // 치환문구가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
      /*
      variables: {
        "#{변수명}": "임의의 값"
      }
      */
      // disbaleSms 값을 true로 줄 경우 문자로의 대체발송이 비활성화 됩니다.
      // disableSms: true,
    },
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        templateId: '등록한 알림톡 템플릿의 ID',
        variables: {},
      },
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        templateId: '등록한 알림톡 템플릿의 ID',
        variables: {},
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        templateId: '등록한 알림톡 템플릿의 ID',
        variables: {},
      },
    },
  ])
  .then(res => console.log(res));`,
        usage: "카카오 알림톡을 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-friendtalk-plain",
        title: "카카오 친구톡 발송",
        description:
          "카카오 친구톡을 발송하는 예제입니다. 단일/대량/예약 발송을 모두 지원합니다.",
        category: "친구톡",
        keywords: [
          "친구톡",
          "카카오톡",
          "pfId",
          "비즈니스채널",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '2,000byte 이내의 메시지 입력',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
    },
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
      },
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
      },
    },
  ])
  .then(res => console.log(res));`,
        usage: "카카오 친구톡을 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-friendtalk-with-buttons",
        title: "버튼이 포함된 카카오 친구톡 발송",
        description:
          "버튼이 포함된 카카오 친구톡을 발송하는 예제입니다. 최대 5개까지 버튼 추가 가능합니다.",
        category: "친구톡",
        keywords: [
          "친구톡",
          "카카오톡",
          "버튼",
          "웹링크",
          "앱링크",
          "봇키워드",
          "상담요청",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '2,000byte 이내의 메시지 입력',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      buttons: [
        {
          buttonType: 'WL', // 웹링크
          buttonName: '버튼 이름',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com', // 생략 가능
        },
        {
          buttonType: 'AL', // 앱링크
          buttonName: '실행 버튼',
          linkAnd: 'examplescheme://',
          linkIos: 'examplescheme://',
        },
        {
          buttonType: 'BK', // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
          buttonName: '봇키워드',
        },
        {
          buttonType: 'MD', // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
          buttonName: '상담요청하기',
        },
        {
          buttonType: 'BT', // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
          buttonName: '챗봇 문의',
        },
      ],
    },
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        buttons: [
          {
            buttonType: 'WL', // 웹링크
            buttonName: '버튼 이름',
            linkMo: 'https://m.example.com',
            linkPc: 'https://example.com',
          },
          {
            buttonType: 'AL', // 앱링크
            buttonName: '실행 버튼',
            linkAnd: 'examplescheme://',
            linkIos: 'examplescheme://',
          },
        ],
      },
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));`,
        usage: "버튼이 포함된 카카오 친구톡을 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-alimtalk-bulk",
        title: "카카오 알림톡 대량 발송",
        description:
          "카카오 알림톡을 대량으로 발송하는 예제입니다. 그룹을 생성하여 최대 100만 건까지 발송 가능합니다.",
        category: "알림톡",
        keywords: [
          "알림톡",
          "카카오톡",
          "대량발송",
          "그룹",
          "템플릿",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.createGroup().then(async groupId => {
  // 10,000건 씩 끊어서 반복하여 그룹에 메시지를 적재할 수 있음, 한 요청 당 10,000건이 가능하며 그룹 당 최대 100만 건 까지 가능
  await messageService.addMessagesToGroup(groupId, [
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        templateId: '등록한 알림톡 템플릿의 ID',
        variables: {},
        // 치환문구가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
        /*
        variables: {
          "#{변수명}": "임의의 값"
        }
        */
        // disbaleSms 값을 true로 줄 경우 문자로의 대체발송이 비활성화 됩니다.
        // disableSms: true,
      },
    },
  ]);

  // 실제 적재된 그룹에 대한 전체 발송 접수 요청
  await messageService.sendGroup(groupId);
});`,
        usage: "카카오 알림톡을 대량으로 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-bms",
        title: "카카오 브랜드 메시지 발송",
        description:
          "카카오 브랜드 메시지(BMS)를 발송하는 예제입니다. targeting 타입을 설정할 수 있습니다.",
        category: "브랜드메시지",
        keywords: [
          "브랜드메시지",
          "BMS",
          "카카오톡",
          "targeting",
          "템플릿",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .send({
    to: '수신번호',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      templateId: '등록한 브랜드 메시지 템플릿의 ID',
      variables: {},
      // 템플릿 내 치환문구(변수)가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
      /*
      variables: {
        "변수명": "임의의 값"
      }
      */
      // 현재 BMS(브랜드 메시지)는 문자로의 대체발송이 비활성화 됩니다.
      bms: {
        targeting: 'I',
      },
    },
  })
  .then(res => console.log(res));`,
        usage: "카카오 브랜드 메시지를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-friendtalk-with-image",
        title: "이미지가 포함된 카카오 친구톡 발송",
        description:
          "이미지가 포함된 카카오 친구톡을 발송하는 예제입니다. 사진 1장만 첨부 가능합니다.",
        category: "친구톡",
        keywords: [
          "친구톡",
          "카카오톡",
          "이미지",
          "사진",
          "파일업로드",
          "nodejs",
          "javascript",
        ],
        code: `const path = require('path');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'KAKAO')
  .then(res => res.fileId)
  .then(fileId => {
    // 단일 발송 예제
    messageService
      .sendOne({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          imageId: fileId,
        },
      })
      .then(res => console.log(res));

    // 단일 예약 발송 예제
    messageService
      .sendOneFuture(
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            imageId: fileId,
          },
        },
        '2022-02-26 00:00:00',
      )
      .then(res => console.log(res));

    // 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    messageService
      .send([
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            imageId: fileId,
          },
        },
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            imageId: fileId,
          },
        },
      ])
      .then(res => console.log(res));
  });`,
        usage: "이미지가 포함된 카카오 친구톡을 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "send-friendtalk-with-image-and-buttons",
        title: "이미지와 버튼이 포함된 카카오 친구톡 발송",
        description:
          "이미지와 버튼이 모두 포함된 카카오 친구톡을 발송하는 예제입니다. 최대 5개까지 버튼 추가 가능합니다.",
        category: "친구톡",
        keywords: [
          "친구톡",
          "카카오톡",
          "이미지",
          "버튼",
          "웹링크",
          "앱링크",
          "파일업로드",
          "nodejs",
          "javascript",
        ],
        code: `const path = require('path');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'KAKAO')
  .then(res => res.fileId)
  .then(fileId => {
    // 단일 발송 예제
    messageService
      .sendOne({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          imageId: fileId,
          buttons: [
            {
              buttonType: 'WL', // 웹링크
              buttonName: '버튼 이름',
              linkMo: 'https://m.example.com',
              linkPc: 'https://example.com', // 생략 가능
            },
            {
              buttonType: 'AL', // 앱링크
              buttonName: '실행 버튼',
              linkAnd: 'examplescheme://',
              linkIos: 'examplescheme://',
            },
            {
              buttonType: 'BK', // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
              buttonName: '봇키워드',
            },
            {
              buttonType: 'MD', // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
              buttonName: '상담요청하기',
            },
            {
              buttonType: 'BT', // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
              buttonName: '챗봇 문의',
            },
          ],
        },
      })
      .then(res => console.log(res));

    // 단일 예약 발송 예제
    messageService
      .sendOneFuture(
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            imageId: fileId,
            buttons: [
              {
                buttonType: 'WL', // 웹링크
                buttonName: '버튼 이름',
                linkMo: 'https://m.example.com',
                linkPc: 'https://example.com',
              },
              {
                buttonType: 'AL', // 앱링크
                buttonName: '실행 버튼',
                linkAnd: 'examplescheme://',
                linkIos: 'examplescheme://',
              },
            ],
          },
        },
        '2022-12-08 00:00:00',
      )
      .then(res => console.log(res));
  });`,
        usage: "이미지와 버튼이 모두 포함된 카카오 친구톡을 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/send",
      },
      {
        id: "create-alimtalk-template",
        title: "카카오 알림톡 템플릿 생성",
        description:
          "카카오 알림톡 템플릿을 생성하는 예제입니다. 버튼, 바로연결, 강조 유형 등을 설정할 수 있습니다.",
        category: "템플릿관리",
        keywords: [
          "알림톡",
          "템플릿",
          "생성",
          "버튼",
          "바로연결",
          "강조",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 사전에 템플릿 카테고리를 조회해야 합니다.
messageService.getKakaoAlimtalkTemplateCategories().then(res => {
  const categoryCode = res[res.length - 1].code;
  messageService
    .createKakaoAlimtalkTemplate({
      name: '등록할 템플릿 제목(등록된 템플릿과 중복불가)',
      content: '등록할 템플릿 내용',
      channelId: '등록할 템플릿의 채널 ID(pfId)',
      categoryCode,
      
      /**
       * 알림톡 버튼, 최대 5개까지 입력할 수 있으며, 바로연결이 추가되면 최대 두개까지만 추가될 수 있습니다.
       */
      /*buttons: [
        {
          buttonName: '버튼이름',
          buttonType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/

      /**
       * 바로연결, 10개까지만 등록할 수 있으며, 바로연결이 추가되면 버튼은 최대 두개까지 추가될 수 있습니다.
       */
      /*quickReplies: [
        {
          name: '바로연결 버튼이름',
          linkType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/

      /**
       * 카카오 알림톡 템플릿 메시지 유형
       * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
       */
      //messageType: 'BA',

      /**
       * 카카오 알림톡 템플릿 강조 유형
       * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형, ITEM_LIST: 아이템리스트형
       */
      //emphasizeType: 'NONE',

      // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 제목
      //emphasizeTitle: '',

      // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 부제목
      //emphasizeSubTitle: '',

      /**
       * 아이템 리스트(ITEM_LIST) 유형에서만 사용 가능한 알림톡 헤더.
       * 변수(치환문구) 포함 가능. 최대 16자
       */
      //header: '헤더 입력',

      //알림톡 하이라이트, 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
      /*highlight: {
        title: '하이라이트 제목', // 알림톡 하이라이트 제목, 변수 포함가능 및 최대 30자까지 입력 가능
        description: '', // 알림톡 하이라이트 내용. 변수 포함 불가능. 최대 16자까지 입력 가능
        // imageId: ''
      },*/

      // 알림톡 아이템, 목록과 요약이 있습니다. 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
      /*item: {
        // 알림톡 아이템 리스트, 최소 2개, 최대 10개까지 등록할 수 있습니다.
        list: [
          {
            title: '아이템리스트', // 아이템 리스트 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
            description: '아이템 리스트 내용', // 아이템 리스트 내용, 변수 포함가능, 최대 23까지 입력 가능합니다.
          },
        ],
        summary: {
          title: '', // 알림톡 아이템 리스트 요약 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
          description: '', // 알림톡 아이템 리스트 요약 내용. 변수 포함 가능. 화폐 단위, 숫자, 쉼표, 마침표만 사용 가능합니다. 최대 14자까지 입력 가능합니다.
        },
      },*/

      // 부가정보. 변수 포함 불가능. 최대 500자
      //extra: '',

      /**
       * 보안 템플릿 여부. true일 경우 해당 템플릿을 PC에서는 확인할 수 없습니다. 기본값: false
       */
      //securityFlag: false,

      //알림톡에 사용되는 이미지 고유 아이디. 이미지 타입이 ATA일 경우에만 사용 가능합니다.
      //imageId: '',
    })
    .then(res => {
      console.log(res);

      // 생성한 카카오 알림톡 템플릿을 즉시 검수할 수 있습니다.
      /*messageService
        .requestInspectionKakaoAlimtalkTemplate(res.templateId)
        .then(res2 => console.log(res2));*/
    });
});`,
        usage: "카카오 알림톡 템플릿을 생성해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "get-alimtalk-templates",
        title: "카카오 알림톡 템플릿 목록 조회",
        description:
          "카카오 알림톡 템플릿 목록을 조회하는 예제입니다. 다양한 검색 조건을 사용할 수 있습니다.",
        category: "템플릿관리",
        keywords: [
          "알림톡",
          "템플릿",
          "조회",
          "목록",
          "검색",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoAlimtalkTemplates(
    // 검색 조건이 있을 떄 추가
    /*{
      limit: 5, // 한 번 요청당 조회할 건 수 입력, 기본값은 20
      startKey: '페이지네이션 조회 키',
      name: '템플릿 이름 입력(일부 키워드로 검색 가능)',
      // 템플릿 이름 검색을 eq, ne 등이 포함된  object로 더 자세하게 검색할 수 있습니다!
      /*name: {
        eq: '', // 해당 값과 완벽히 일치하는 템플릿만을 검색
        ne: '', // 해당 값과 불일치하는 템플릿만을 검색
      },*/
      channelId: '카카오 채널 ID 입력(구 pfId)',
      templateId: '알림톡 템플릿 ID 입력',
      isHidden: true, // 숨긴 템플릿 검색, true로 했을 때만 숨긴 템플릿이 검색 됨
      /**
       *  status 안에 포함된 4가지 사항 중 한가지 선택
       *  PENDING: 대기(검수필요)
       *  INSPECTING: 검수중
       *  APPROVED: 등록완료(검수완료)
       *  REJECTED: 반려됨
       */
      status: 'INSPECTING',
      startDate: '',
      endDate: '',
    },*/
  )
  .then(res => console.log(res));`,
        usage: "카카오 알림톡 템플릿 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "get-alimtalk-template",
        title: "카카오 알림톡 템플릿 조회",
        description:
          "특정 카카오 알림톡 템플릿의 상세 정보를 조회하는 예제입니다.",
        category: "템플릿관리",
        keywords: ["알림톡", "템플릿", "조회", "상세", "nodejs", "javascript"],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoAlimtalkTemplate('조회할 알림톡 template ID')
  .then(res => console.log(res));`,
        usage: "특정 카카오 알림톡 템플릿의 상세 정보를 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "update-alimtalk-template",
        title: "카카오 알림톡 템플릿 수정",
        description:
          "카카오 알림톡 템플릿을 수정하는 예제입니다. 반드시 대기 상태에서만 수정 가능합니다.",
        category: "템플릿관리",
        keywords: [
          "알림톡",
          "템플릿",
          "수정",
          "업데이트",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .updateKakaoAlimtalkTemplate('수정할 알림톡 템플릿 ID', {
    //name: '수정할 템플릿 제목(등록된 템플릿과 중복불가)',
    //content: '수정할 템플릿 내용',
    //categoryCode: '999999', // 카테고리 코드, 카테고리 코드를 미리 조회하신 다음 코드를 입력해주세요.
    /**
     * 알림톡 버튼, 최대 5개까지 입력할 수 있으며, 바로연결이 추가되면 최대 두개까지만 추가될 수 있습니다.
     */
    /*buttons: [
        {
          buttonName: '버튼이름',
          buttonType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/
    /**
     * 바로연결, 10개까지만 등록할 수 있으며, 바로연결이 추가되면 버튼은 최대 두개까지 추가될 수 있습니다.
     */
    /*quickReplies: [
        {
          name: '바로연결 버튼이름',
          linkType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/
    /**
     * 카카오 알림톡 템플릿 메시지 유형
     * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
     */
    //messageType: 'BA',
    /**
     * 카카오 알림톡 템플릿 강조 유형
     * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형, ITEM_LIST: 아이템리스트형
     */
    //emphasizeType: 'NONE',
    // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 제목
    //emphasizeTitle: '',
    // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 부제목
    //emphasizeSubTitle: '',
    /**
     * 아이템 리스트(ITEM_LIST) 유형에서만 사용 가능한 알림톡 헤더.
     * 변수(치환문구) 포함 가능. 최대 16자
     */
    //header: '헤더 입력',
    //알림톡 하이라이트, 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
    /*highlight: {
        title: '하이라이트 제목', // 알림톡 하이라이트 제목, 변수 포함가능 및 최대 30자까지 입력 가능
        description: '', // 알림톡 하이라이트 내용. 변수 포함 불가능. 최대 16자까지 입력 가능
        // imageId: ''
      },*/
    // 알림톡 아이템, 목록과 요약이 있습니다. 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
    /*item: {
        // 알림톡 아이템 리스트, 최소 2개, 최대 10개까지 등록할 수 있습니다.
        list: [
          {
            title: '아이템리스트', // 아이템 리스트 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
            description: '아이템 리스트 내용', // 아이템 리스트 내용, 변수 포함가능, 최대 23까지 입력 가능합니다.
          },
        ],
        summary: {
          title: '', // 알림톡 아이템 리스트 요약 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
          description: '', // 알림톡 아이템 리스트 요약 내용. 변수 포함 가능. 화폐 단위, 숫자, 쉼표, 마침표만 사용 가능합니다. 최대 14자까지 입력 가능합니다.
        },
      },*/
    // 부가정보. 변수 포함 불가능. 최대 500자
    //extra: '',
    /**
     * 보안 템플릿 여부. true일 경우 해당 템플릿을 PC에서는 확인할 수 없습니다. 기본값: false
     */
    //securityFlag: false,
    //알림톡에 사용되는 이미지 고유 아이디. 이미지 타입이 ATA일 경우에만 사용 가능합니다.
    //imageId: '',
  })
  .then(res => {
    console.log(res);

    // 수정한 카카오 알림톡 템플릿을 즉시 검수할 수 있습니다.
    /*messageService
        .requestInspectionKakaoAlimtalkTemplate(res.templateId)
        .then(res2 => console.log(res2));*/
  });`,
        usage: "카카오 알림톡 템플릿을 수정해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "get-alimtalk-template-categories",
        title: "카카오 알림톡 템플릿 카테고리 조회",
        description:
          "카카오 알림톡 템플릿 카테고리 목록을 조회하는 예제입니다.",
        category: "템플릿관리",
        keywords: [
          "알림톡",
          "템플릿",
          "카테고리",
          "조회",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getKakaoAlimtalkTemplateCategories().then(res => {
  for (const category of res) {
    console.log(category);
  }
});`,
        usage: "카카오 알림톡 템플릿 카테고리 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "inspect-alimtalk-template",
        title: "카카오 알림톡 템플릿 검수 요청",
        description:
          "카카오 알림톡 템플릿에 대한 검수를 요청하는 예제입니다. 반드시 대기 상태의 템플릿만 검수 요청 가능합니다.",
        category: "템플릿관리",
        keywords: [
          "알림톡",
          "템플릿",
          "검수",
          "요청",
          "승인",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 템플릿 검수 요청, 반드시 대기 상태의 템플릿만 검수 요청할 수 있습니다.
messageService
  .requestInspectionKakaoAlimtalkTemplate('검수할 알림톡 템플릿 ID')
  .then(res => console.log(res));`,
        usage: "카카오 알림톡 템플릿에 대한 검수를 요청해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "remove-alimtalk-template",
        title: "카카오 알림톡 템플릿 삭제",
        description:
          "카카오 알림톡 템플릿을 삭제하는 예제입니다. 반드시 대기 상태에서만 삭제 가능합니다.",
        category: "템플릿관리",
        keywords: ["알림톡", "템플릿", "삭제", "제거", "nodejs", "javascript"],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .removeKakaoAlimtalkTemplate('삭제할 알림톡 템플릿 ID')
  .then(res => console.log(res));`,
        usage: "카카오 알림톡 템플릿을 삭제해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/alimtalk_template",
      },
      {
        id: "create-kakao-channel",
        title: "카카오 비즈니스 채널 연동",
        description: "카카오 비즈니스 채널을 연동(생성)하는 예제입니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "연동",
          "생성",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .createKakaoChannel({
    searchId: '채널 검색용 아이디 입력',
    phoneNumber: '카카오 비즈니스 채널 담당자 휴대전화 번호 입력',
    categoryCode:
      '채널 카테고리 조회 메소드로 확인한 카카오 채널 카테고리 코드 입력',
    token: '카카오 채널 토큰 발급 메소드로 확인한 토큰 입력',
  })
  .then(res => console.log(res));`,
        usage: "카카오 비즈니스 채널을 연동해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "create-kakao-channel-all-in-one",
        title: "카카오 비즈니스 채널 연동 (전체 과정)",
        description:
          "카카오 비즈니스 채널 연동의 전체 과정을 포함한 예제입니다. 카테고리 조회부터 채널 연동까지 모든 과정을 보여줍니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "연동",
          "전체과정",
          "카테고리",
          "토큰",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getKakaoChannelCategories().then(async res => {
  // 115번의 카테고리는 컴퓨터,소프트웨어/솔루션,소프트웨어/솔루션
  // 실제 연동하실 때는 각각의 채널에 맞는 카테고리를 선택해주세요!
  const categoryCode = res[115].code;

  const searchId = '채널 검색용 아이디';
  const phoneNumber = '카카오 비즈니스 채널 담당자 휴대전화 번호';

  // token은 API가 아닌 실제 담당자 휴대전화 번호로 전송됩니다.
  await messageService.requestKakaoChannelToken({
    searchId,
    phoneNumber,
  });

  messageService
    .createKakaoChannel({
      searchId,
      categoryCode,
      phoneNumber,
      token: '담당자 휴대전화 번호로 받은 토큰(인증번호) 입력',
    })
    .then(res => {
      // 채널 데이터를 수신 받으면 성공!
      console.log(res);
    });
});`,
        usage: "카카오 비즈니스 채널 연동의 전체 과정을 확인해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "get-kakao-channels",
        title: "카카오 비즈니스 채널 목록 조회",
        description:
          "카카오 비즈니스 채널 목록을 조회하는 예제입니다. 다양한 검색 조건을 사용할 수 있습니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "목록",
          "조회",
          "검색",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoChannels(
    // 조회할 조건이 있을 때 추가해주시면 됩니다!
    {
      channelId: '조회할 채널 ID 입력',
      searchId: '조회할 검색용 아이디 입력',

      // 조회할 건 수 입력, 미입력 시 기본 건 수는 20건 입니다.
      limit: 1,

      startKey:
        '조회할 페이지네이션 키 입력, 보통 채널 조회 시 응답받는 nextKey 항목으로 넣어보실 수 있습니다.',

      // 생성일자로 검색
      startDate: '2022-12-01',
      endDate: '2022-12-09',
    },
  )
  .then(res => console.log(res));`,
        usage: "카카오 비즈니스 채널 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "get-kakao-channel",
        title: "카카오 비즈니스 채널 조회",
        description:
          "특정 카카오 비즈니스 채널의 상세 정보를 조회하는 예제입니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "조회",
          "상세",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoChannel('조회할 카카오 채널 ID 입력')
  .then(res => console.log(res));`,
        usage: "특정 카카오 비즈니스 채널의 상세 정보를 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "get-kakao-channel-categories",
        title: "카카오 비즈니스 채널 카테고리 조회",
        description:
          "카카오 비즈니스 채널 카테고리 목록을 조회하는 예제입니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "카테고리",
          "조회",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getKakaoChannelCategories().then(res => {
  res.forEach(data => {
    // 채널 카테고리 코드
    console.log(data.code);

    console.log('----');

    // 채널 카테고리 이름
    console.log(data.name);
  });
});`,
        usage: "카카오 비즈니스 채널 카테고리 목록을 조회해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "request-kakao-channel-token",
        title: "카카오 비즈니스 채널 토큰 발급",
        description:
          "카카오 비즈니스 채널 연동을 위한 토큰을 발급하는 예제입니다.",
        category: "채널관리",
        keywords: [
          "카카오",
          "비즈니스채널",
          "채널",
          "토큰",
          "발급",
          "인증",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .requestKakaoChannelToken({
    searchId: '채널 검색용 아이디 입력',
    phoneNumber: '카카오 비즈니스 채널 담당자 휴대전화 번호 입력',
  })
  .then(res => console.log(res));`,
        usage: "카카오 비즈니스 채널 연동을 위한 토큰을 발급해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/kakao/channel",
      },
      {
        id: "send-rcs",
        title: "RCS 문자 발송",
        description:
          "RCS(Rich Communication Services) 문자를 발송하는 예제입니다. 단일 발송, 대량 발송, 예약 발송, 대체 발송 등 다양한 옵션을 제공합니다.",
        category: "RCS",
        keywords: [
          "RCS",
          "리치커뮤니케이션",
          "문자",
          "발송",
          "버튼",
          "웹링크",
          "브랜드",
          "대체발송",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 RCS용 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    rcsOptions: {
      brandId: 'RCS 브랜드의 아이디',
      buttons: [
        {
          buttonType: 'WL',
          buttonName: '웹링크 버튼',
          link: 'https://으로 시작하는 웹링크 주소',
        },
      ],
    },
  })
  .then(res => console.log(res));

// 단일 예약발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .send(
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 RCS용 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        rcsOptions: {
          brandId: 'RCS 브랜드의 아이디',
          buttons: [
            {
              buttonType: 'WL',
              buttonName: '웹링크 버튼',
              link: 'https://으로 시작하는 웹링크 주소',
            },
          ],
        },
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 RCS용 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        rcsOptions: {
          brandId: 'RCS 브랜드의 아이디',
          buttons: [
            {
              buttonType: 'WL',
              buttonName: '웹링크 버튼',
              link: 'https://으로 시작하는 웹링크 주소',
            },
          ],
        },
      },
    ],
    {
      scheduledDate: '2022-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));

// RCS 발송 실패 시 일반 문자로 대체 발송하는 예제
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 RCS용 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    rcsOptions: {
      brandId: 'RCS 브랜드의 아이디',
      buttons: [
        {
          buttonType: 'WL',
          buttonName: '웹링크 버튼',
          link: 'https://으로 시작하는 웹링크 주소',
        },
      ],
    },
    replacements: [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: 'RCS 발송 실패 시 대체 발송될 문자 내용',
      },
    ],
  })
  .then(res => console.log(res));`,
        usage: "RCS 문자를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/rcs",
      },
      {
        id: "send-sms",
        title: "단문 문자(SMS) 발송",
        description:
          "단문 문자(SMS)를 발송하는 예제입니다. 단일 발송, 대량 발송, 예약 발송 등 다양한 옵션을 제공합니다.",
        category: "SMS",
        keywords: [
          "SMS",
          "단문",
          "문자",
          "발송",
          "예약",
          "대량",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
  })
  .then(res => console.log(res));

// 단일 예약발송 예제, send 메소드로도 동일하게 사용가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      },
    ],
    {
      scheduledDate: '2022-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));`,
        usage: "단문 문자(SMS)를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/sms",
      },
      {
        id: "send-lms",
        title: "장문 문자(LMS) 발송",
        description:
          "장문 문자(LMS)를 발송하는 예제입니다. 제목(subject)을 포함한 긴 메시지를 발송할 수 있습니다.",
        category: "LMS",
        keywords: [
          "LMS",
          "장문",
          "문자",
          "발송",
          "제목",
          "subject",
          "예약",
          "대량",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      },
    ],
    {
      scheduledDate: '2022-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));`,
        usage: "장문 문자(LMS)를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/sms",
      },
      {
        id: "send-mms",
        title: "사진 문자(MMS) 발송",
        description:
          "사진이 포함된 문자(MMS)를 발송하는 예제입니다. 이미지 업로드 후 발송하는 과정을 보여줍니다.",
        category: "MMS",
        keywords: [
          "MMS",
          "사진",
          "이미지",
          "문자",
          "발송",
          "업로드",
          "파일",
          "nodejs",
          "javascript",
        ],
        code: `const path = require('path');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'MMS')
  .then(res => res.fileId)
  .then(fileId => {
    // 단일 발송 예제
    messageService
      .sendOne({
        imageId: fileId,
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
      })
      .then(res => console.log(res));

    // 단일 예약 발송 예제
    // 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
    messageService
      .sendOneFuture(
        {
          imageId: fileId,
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
        },
        '2022-12-08 00:00:00',
      )
      .then(res => console.log(res));

    // 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    messageService
      .send([
        {
          imageId: fileId,
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
        },
        {
          imageId: fileId,
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        },
        // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      ])
      .then(res => console.log(res));

    // 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    // 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
    messageService
      .send(
        [
          {
            imageId: fileId,
            to: '수신번호',
            from: '계정에서 등록한 발신번호 입력',
            text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            subject: '문자 제목', // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
          },
          {
            imageId: fileId,
            to: '수신번호',
            from: '계정에서 등록한 발신번호 입력',
            text: 'imageId가 있으면 자동으로 MMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          },
        ],
        {
          scheduledDate: '2022-12-08 00:00:00',
          // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
          // allowDuplicates: true,
        },
      )
      .then(res => console.log(res));

    return Promise.resolve();
  });`,
        usage: "사진이 포함된 문자(MMS)를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/sms",
      },
      {
        id: "send-sms-bulk",
        title: "SMS 대량 발송",
        description:
          "그룹을 이용한 SMS 대량 발송 예제입니다. 최대 100만 건까지 그룹으로 관리하여 발송할 수 있습니다.",
        category: "대량발송",
        keywords: [
          "SMS",
          "대량",
          "발송",
          "그룹",
          "bulk",
          "100만건",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.createGroup().then(async groupId => {
  // 10,000건 씩 끊어서 반복하여 그룹에 메시지를 적재할 수 있음, 한 요청 당 10,000건이 가능하며 그룹 당 최대 100만 건 까지 가능
  await messageService.addMessagesToGroup(groupId, [
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    },
  ]);

  // 실제 적재된 그룹에 대한 전체 발송 접수 요청
  await messageService.sendGroup(groupId);
});`,
        usage: "SMS를 대량으로 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/sms",
      },
      {
        id: "send-overseas-sms",
        title: "해외 SMS 발송",
        description:
          "해외로 SMS를 발송하는 예제입니다. 국가번호를 포함한 국제 발송을 지원합니다.",
        category: "SMS",
        keywords: [
          "SMS",
          "해외",
          "국제",
          "발송",
          "국가번호",
          "overseas",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .sendOne({
    to: '국제번호를 제외한 수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .sendOneFuture(
    {
      to: '국제번호를 제외한 수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '국제번호를 제외한 수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
    },
    {
      to: '국제번호를 제외한 수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '국제번호를 제외한 수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
      },
      {
        to: '국제번호를 제외한 수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        country: '1', // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
      },
    ],
    {
      scheduledDate: '2022-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));`,
        usage: "해외로 SMS를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/sms",
      },
      {
        id: "send-voice-message",
        title: "음성 메시지 발송",
        description:
          "음성 메시지를 발송하는 예제입니다. 음성 타입, 머릿말, 꼬릿말, 상담원 연결 등 다양한 옵션을 제공합니다.",
        category: "음성메시지",
        keywords: [
          "음성",
          "메시지",
          "발송",
          "voice",
          "DTMF",
          "상담원",
          "머릿말",
          "꼬릿말",
          "nodejs",
          "javascript",
        ],
        code: `const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.send({
  to: '수신번호',
  from: '발신번호',
  text: '음성 메시지 테스트입니다, 실제 수신자에게 들리는 내용입니다.',
  voiceOptions: {
    voiceType: 'FEMALE', // 필수값, MALE 혹은 FEMALE만 선택 가능합니다
    // headerMessage: '보이스 메시지 테스트', // 메시지 시작에 나오는 머릿말, 최대 135자까지 가능합니다.
    // tailMessage: '보이스 메시지 테스트', // 통화가 끝나고 나오는 꼬릿말, 상담원 연결 시 나오지 않습니다, 머리말(headerMessage)이 있어야 적용됩니다.
    // replyRange: 1, // 수신자가 누를 수 있는 다이얼 값의 범위, 1~9까지 가능하며 counselorNumber와 함께 사용할 수 없습니다.
    // counselorNumber: '상담번호, 예) 029302266', // 수신자가 0번을 눌렀을 때 연결되는 상담번호, replyRange와 함께 사용할 수 없습니다.
  },
});`,
        usage: "음성 메시지를 발송해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/voice",
      },
      {
        id: "webhook-example",
        title: "웹훅 처리",
        description:
          "SOLAPI 웹훅을 처리하는 Express.js 서버 예제입니다. 메시지 리포트, 그룹 리포트, 팩스 수신 등을 처리할 수 있습니다.",
        category: "웹훅",
        keywords: [
          "웹훅",
          "webhook",
          "리포트",
          "팩스",
          "express",
          "서버",
          "메시지",
          "그룹",
          "nodejs",
          "javascript",
        ],
        code: `const express = require('express');
const bodyParser = require('body-parser');
const asyncify = require('express-asyncify');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

/**
 * 웹훅 레퍼런스
 * http://developers.solapi.com/references/webhook/
 */

// 넘어온 그룹 ID로 메시지 목록을 가져오는 API를 사용하므로 API Key, API Secret Key가 준비되어야 합니다.
const app = asyncify(express());
app.use(bodyParser.json({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));

// 메시지 리포트
app.post('/single-report', async (req, res) => {
  // body에 [] 형식으로 메시지정보 객체 목록이 들어옵니다.
  for (const messageInfo of req.body) {
    console.log('메시지 정보:', messageInfo);
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

// 그룹 리포트
app.post('/group-report', async (req, res) => {
  // body에 [] 형식으로 그룹정보 객체 목록이 들어옵니다.
  for (const groupInfo of req.body) {
    // 그룹ID로 메시지 목록을 가져옵니다.
    const result = await messageService.getGroupMessages(groupInfo.groupId);
    for (const messageId in result.messageList) {
      /**
       * 메시지 정보에서 statusCode로 메시지 상태를 확인 할 수 있습니다.
       * 메시지 상태 코드: https://developers.solapi.com/references/message-status-codes
       * 알림톡/문자 모두 정상처리는 4000번
       */
      console.log('메시지 정보:', result.messageList[messageId]);
    }
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

// 팩스 수신
app.post('/fax', async (req, res) => {
  // body에 [] 형식으로 팩스수신정보 객체 목록이 들어옵니다.
  for (const faxInfo of req.body) {
    console.log('팩스 수신 정보:', faxInfo);
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

app.listen(8080, () => {
  console.log(\`Server is listening...\`);
});`,
        usage: "SOLAPI 웹훅을 처리해야 하는 경우",
        url: "https://github.com/solapi/solapi-nodejs/tree/master/examples/javascript/webhook",
      },
    ];
  }

  /**
   * 카테고리별 예제 코드 반환
   * @param category - 카테고리명
   * @returns 해당 카테고리의 예제 코드 배열
   */
  static getExamplesByCategory(category: string): Example[] {
    return this.getExamples().filter(
      (example) => example.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * ID로 특정 예제 코드 반환
   * @param id - 예제 ID
   * @returns 해당 ID의 예제 코드 또는 null
   */
  static getExampleById(id: string): Example | null {
    return this.getExamples().find((example) => example.id === id) || null;
  }

  /**
   * 키워드로 예제 코드 검색
   * @param keyword - 검색 키워드
   * @returns 검색된 예제 코드 배열
   */
  static searchExamples(keyword: string): Example[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getExamples().filter(
      (example) =>
        example.title.toLowerCase().includes(lowerKeyword) ||
        example.description.toLowerCase().includes(lowerKeyword) ||
        example.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)) ||
        example.code.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 사용 가능한 카테고리 목록 반환
   * @returns 카테고리 배열
   */
  static getCategories(): string[] {
    const categories = new Set(
      this.getExamples().map((example) => example.category)
    );
    return Array.from(categories);
  }
}
