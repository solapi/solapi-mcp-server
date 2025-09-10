/**
 * @file PHP SDK 예제 라이브러리
 * @description SOLAPI PHP SDK 사용 예제 모음
 */
import type { Example } from '../types';

export class PhpExamplesLibrary {
  private static examples: Example[] = [
    {
      id: 'php-sms-send',
      title: 'PHP SMS 발송',
      description: 'SOLAPI PHP SDK를 사용하여 SMS를 발송하는 기본 예제입니다. 텍스트가 90byte를 넘으면 자동으로 LMS로 전환됩니다.',
      category: 'SMS',
      usage: 'SolapiMessageService를 생성하고 Message 객체에 발신번호, 수신번호, 메시지를 설정한 후 send() 메서드를 호출합니다.',
      keywords: ['php', 'SMS', '문자발송', 'Message', 'SolapiMessageService', '단문', '메시지발송', 'setTo', 'setFrom', 'setText'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 단문 문자(SMS) 발송 예제, Text가 공백을 포함하여 90 byte를 넘어갈 경우 LMS로 자동 전환됩니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $message = new Message();
    $message->setTo("수신번호")
        ->setFrom("계정에서 등록한 발신번호 입력")
        ->setText("한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setFrom("계정에서 등록한 발신번호 입력")
            ->setText("한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다." . $i);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/sms'
    },
    {
      id: 'php-lms-send',
      title: 'PHP LMS 발송',
      description: 'SOLAPI PHP SDK를 사용하여 장문 메시지(LMS)를 발송하는 예제입니다. 90자 이상의 긴 텍스트를 전송할 때 사용됩니다.',
      category: 'LMS',
      usage: 'Message 객체에 90자 이상의 텍스트를 설정하면 자동으로 LMS로 발송됩니다. setSubject()로 제목을 설정할 수 있습니다.',
      keywords: ['php', 'LMS', '장문문자', 'Message', 'SolapiMessageService', 'setSubject', '제목', '긴텍스트'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 장문 문자(LMS) 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $message = new Message();
    $message->setTo("수신번호")
        ->setFrom("계정에서 등록한 발신번호 입력")
        ->setText("한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ");

    // LMS는 문자에 제목을 지정할 수 있습니다! 필요 시 해당 주석을 해제하여 사용해보세요!
    // $message->setSubject("문자 제목 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setFrom("계정에서 등록한 발신번호 입력")
            ->setText("한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ" . $i);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/lms'
    },
    {
      id: 'php-mms-send',
      title: 'PHP MMS 발송',
      description: 'SOLAPI PHP SDK를 사용하여 이미지가 포함된 MMS를 발송하는 예제입니다. 먼저 이미지를 업로드한 후 메시지에 첨부하여 발송합니다.',
      category: 'MMS',
      usage: 'uploadFile()로 이미지를 업로드하여 imageId를 받고, Message 객체에 setImageId()로 설정한 후 발송합니다.',
      keywords: ['php', 'MMS', '멀티미디어', '이미지발송', 'uploadFile', 'setImageId', '사진문자', '첨부파일'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 사진 문자(MMS) 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $imageId = $messageService->uploadFile("images/example.jpg");

    $message = new Message();
    $message->setTo("수신번호")
        ->setFrom("계정에서 등록한 발신번호 입력")
        ->setText("한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        ->setImageId($imageId);

    // MMS는 문자에 제목을 지정할 수 있습니다! 필요 시 해당 주석을 해제하여 사용해보세요!
    // $message->setSubject("문자 제목 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setFrom("계정에서 등록한 발신번호 입력")
            ->setText("한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ" . $i)
            ->setImageId($imageId);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/mms'
    },
    {
      id: 'php-overseas-sms-send',
      title: 'PHP 해외 SMS 발송',
      description: 'SOLAPI PHP SDK를 사용하여 해외로 SMS를 발송하는 예제입니다. 해외 문자는 단문(SMS)만 지원됩니다.',
      category: '해외SMS',
      usage: 'Message 객체에 setCountry()로 국가 코드를 설정하고 수신번호는 국제번호를 제외한 번호를 입력합니다.',
      keywords: ['php', 'SMS', '해외문자', 'setCountry', '국가코드', '국제발송', 'overseas', '해외발송'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 해외 단문 문자 발송 예제, 해외 문자는 오직 단문 문자(SMS)만 지원합니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $message = new Message();
    $message->setTo("국제번호를 제외한 수신번호")
        ->setFrom("계정에서 등록한 발신번호 입력")
        ->setText("한글 45자, 영자 90자 이하 입력되면 자동으로 SMS 타입의 메시지가 발송됩니다.");

    // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
    $message->setCountry("1");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setFrom("계정에서 등록한 발신번호 입력")
            ->setText("한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다." . $i)
            ->setCountry("1");
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/overseas-sms'
    },
    {
      id: 'php-balance-check',
      title: 'PHP 잔액 조회',
      description: 'SOLAPI PHP SDK를 사용하여 계정 잔액과 포인트를 조회하는 예제입니다.',
      category: '계정관리',
      usage: 'SolapiMessageService의 getBalance() 메서드를 호출하여 잔액과 포인트를 확인합니다.',
      keywords: ['php', 'balance', '잔액', '조회', 'getBalance', 'SolapiMessageService', '계정', 'point', '포인트'],
      code: `<?php

use Nurigo\\Solapi\\Services\\SolapiMessageService;

require_once("vendor/autoload.php");

/**
 * 충전 요금 조회 예제
 */
$messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");
$response = $messageService->getBalance();

// 충전 요금(잔액) 조회
echo $response->balance . "\\n";

// 잔여 포인트 조회
echo $response->point . "\\n";`,
      url: 'https://docs.solapi.com/php/balance'
    },
    {
      id: 'php-messages-get',
      title: 'PHP 메시지 조회',
      description: 'SOLAPI PHP SDK를 사용하여 발송된 메시지 목록을 조회하는 예제입니다. 다양한 조건으로 필터링할 수 있습니다.',
      category: '상태조회',
      usage: 'GetMessagesRequest 객체에 검색 조건을 설정하고 getMessages() 메서드를 호출합니다. 발신번호, 수신번호, 날짜, 메시지 유형 등으로 필터링 가능합니다.',
      keywords: ['php', 'messages', '메시지', '조회', 'GetMessagesRequest', 'getMessages', '발송내역', '상태', 'messageList', 'statusCode'],
      code: `<?php

use Nurigo\\Solapi\\Models\\Request\\GetMessagesRequest;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

require_once("vendor/autoload.php");


/**
 * 메시지(문자, 알림톡 모두 포함) 조회 예제
 * 반드시 발신번호/수신번호 형식은 01012345678 형식으로 입력해주셔야 합니다!
 */
$messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

// 필요한 검색 조건에 따라 주석들을 해제하여 응용해보세요!
$parameter = new GetMessagesRequest();

// 발신번호로 검색
// $parameter->setFrom("발신번호 입력");

// 수신번호로 검색
// $parameter->setTo("수신번호 입력");

// 조회할 건 수 지정
// $parameter->setLimit(1);

// 메시지 조회 시 나오는 nextKey로 페이지 조회
// $parameter->setStartKey("nextKey로 나온 값 입력");

// 그룹 ID로 조회
// $parameter->setGroupId("그룹 ID 입력");

// 메시지 ID로 조회
// $parameter->setMessageId("메시지 ID 입력");

// 메시지 ID 여러개 조회
// $parameter->setMessageIds([
//     "메시지 ID 입력",
//     "메시지 ID 입력"
// ]);

// 메시지 유형(알림톡: ATA, 단문 문자:SMS 등)으로 검색
// 유형에 대한 값은 아래 내용을 참고해주세요!
// SMS: 단문
// LMS: 장문
// MMS: 사진문자
// ATA: 알림톡
// CTA: 친구톡
// CTI: 이미지 친구톡
// NSA: 네이버 스마트알림
// RCS_SMS: RCS 단문
// RCS_LMS: RCS 장문
// RCS_MMS: RCS 사진문자
// RCS_TPL: RCS 템플릿문자
// $parameter->setType("조회 할 메시지 유형입력");

// 조회 할 상태코드 입력, 상태 코드 목록은 아래 페이지를 참고해주세요!
// https://developers.solapi.com/references/message-status-codes
// $parameter->setStatusCode("조회 할 상태코드 입력");

// 날짜로 검색, startDate와 endDate가 반드시 같이 기입되어야 합니다!
// date_default_timezone_set("Asia/Seoul");
// $startDate = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-22 00:00:00")->format("c");
// $endDate = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-22 23:59:59")->format("c");
// $parameter->setStartDate($startDate);
// $parameter->setEndDate($endDate);

$messages = $messageService->getMessages($parameter);
print_r($messages);

foreach ($messages->messageList as $key => $val) {
    echo "메시지ID: {$val->messageId}\\n";
    echo "그룹ID: {$val->groupId}\\n";
    echo "타입: {$val->type}\\n";
    echo "국가: {$val->country}\\n";
    echo "제목(LMS, MMS): {$val->subject}\\n";
    echo "내용: {$val->text}\\n";
    echo "발신번호: {$val->from}\\n";
    echo "수신번호: {$val->to}\\n";
    echo "상태(코드): {$val->statusCode}\\n";
    echo "-----------------------------\\n";
}`,
      url: 'https://docs.solapi.com/php/messages'
    },
    {
      id: 'php-statistics-get',
      title: 'PHP 통계 조회',
      description: 'SOLAPI PHP SDK를 사용하여 메시지 발송 통계를 조회하는 예제입니다. 날짜별 발송 통계를 확인할 수 있습니다.',
      category: '통계',
      usage: 'GetStatisticsRequest 객체에 날짜 범위를 설정하고 getStatistics() 메서드를 호출하여 통계 정보를 조회합니다.',
      keywords: ['php', 'statistics', '통계', '조회', 'GetStatisticsRequest', 'getStatistics', '발송통계', 'startDate', 'endDate'],
      code: `<?php

use Nurigo\\Solapi\\Models\\Request\\GetStatisticsRequest;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

require_once("vendor/autoload.php");

/**
 * 통계 조회 예제
 */
$messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

// 날짜 검색이 필요할 경우 아래 주석을 해제하여 검색해보세요!
$parameter = new GetStatisticsRequest();

// 날짜로 검색, startDate와 endDate가 반드시 같이 기입되어야 합니다!
// date_default_timezone_set("Asia/Seoul");
// $startDate = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-22 00:00:00")->format("c");
// $endDate = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-22 23:59:59")->format("c");
// $parameter->setStartDate($startDate);
// $parameter->setEndDate($endDate);

$response = $messageService->getStatistics($parameter);
print_r($response);`,
      url: 'https://docs.solapi.com/php/statistics'
    },
    {
      id: 'php-kakao-alimtalk',
      title: 'PHP 카카오 알림톡 발송',
      description: 'SOLAPI PHP SDK를 사용하여 카카오 알림톡을 발송하는 예제입니다. 등록된 템플릿을 사용하여 발송합니다.',
      category: '알림톡',
      usage: 'KakaoOption 객체에 pfId와 templateId를 설정하고, Message의 setKakaoOptions()로 설정한 후 발송합니다.',
      keywords: ['php', 'kakao', '알림톡', 'KakaoOption', 'setPfId', 'setTemplateId', 'setVariables', '치환문구'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoOption;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 카카오 알림톡(이미지 알림톡 포함, 이미지 알림톡은 별도의 추가 파라미터가 없습니다) 발송 예제
 * 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $kakaoOption = new KakaoOption();
    $kakaoOption->setPfId("연동한 비즈니스 채널의 pfId")
        ->setTemplateId("등록한 알림톡 템플릿의 ID");

    // 치환문구가 있는 경우에만 추가해주세요, 반드시 키 값은 등록하신 치환문구와 동일하게 모두 입력하셔야 합니다!
    // 또한 치환문구 상 키, 값은 모두 string 타입만 허용됩니다.
    /*$variables = [
        "#{변수명}" => "임의의 값"
    ];
    $kakaoOption->setVariables($variables);*/

    $message = new Message();
    $message->setTo("수신번호")
        ->setKakaoOptions($kakaoOption);

    // 문자 대체 발송을 희망하실 경우 계정 내에 등록하신 발신번호를 추가해주세요!
    // $message->setFrom("계정에서 등록한 발신번호 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setKakaoOptions($kakaoOption);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/alimtalk'
    },
    {
      id: 'php-kakao-bms',
      title: 'PHP 카카오 브랜드 메시지 발송',
      description: 'SOLAPI PHP SDK를 사용하여 카카오 브랜드 메시지(BMS)를 발송하는 예제입니다. 타겟팅 설정으로 발송 대상자를 지정할 수 있습니다.',
      category: '알림톡',
      usage: 'KakaoBms 객체에 타겟팅을 설정하고 KakaoOption의 setBms()로 설정합니다. M(마케팅), N(일반), I(친구) 타겟팅 설정 가능합니다.',
      keywords: ['php', 'kakao', '브랜드메시지', 'BMS', 'KakaoBms', 'targeting', 'M', 'N', 'I', 'KakaoBmsTargetingType'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoBms;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoBmsTargetingType;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoOption;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 카카오 브랜드 메시지 발송 예제
 * 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    // 브랜드 메시지 발송 대상자 설정, M, N 타입은 카카오측의 별도 인허가를 받은 비즈니스 채널만 사용할 수 있습니다.
    // M: 마케팅 수신 동의 대상자 및 카카오 채널 친구
    // N: 마케팅 수신 동의 대상자만 발송, 카카오 채널 친구는 제외한 대상자
    // I: 카카오 채널 친구
    $kakaoBms = new KakaoBms();
    $kakaoBms->setTargeting(KakaoBmsTargetingType::I);

    $kakaoOption = new KakaoOption();
    $kakaoOption->setPfId("연동한 비즈니스 채널의 pfId")
        ->setTemplateId("등록한 알림톡 템플릿의 ID")
        ->setBms($kakaoBms);

    // 치환문구가 있는 경우에만 추가해주세요, 반드시 키 값은 등록하신 치환문구와 동일하게 모두 입력하셔야 합니다!
    // 또한 치환문구 상 키, 값은 모두 string 타입만 허용됩니다.
    /*$variables = [
        "#{변수명}" => "임의의 값"
    ];
    $kakaoOption->setVariables($variables);*/

    $message = new Message();
    $message->setTo("수신번호")
        ->setKakaoOptions($kakaoOption);

    // 문자 대체 발송을 희망하실 경우 계정 내에 등록하신 발신번호를 추가해주세요!
    // $message->setFrom("계정에서 등록한 발신번호 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setKakaoOptions($kakaoOption);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/bms'
    },
    {
      id: 'php-kakao-friendtalk',
      title: 'PHP 카카오 친구톡 발송',
      description: 'SOLAPI PHP SDK를 사용하여 카카오 친구톡을 발송하는 예제입니다. 자유로운 텍스트로 메시지를 발송할 수 있습니다.',
      category: '친구톡',
      usage: 'KakaoOption에 pfId를 설정하고 Message에 setText()로 텍스트를 설정한 후 발송합니다. 2,000byte 이내의 메시지 전송 가능합니다.',
      keywords: ['php', 'kakao', '친구톡', 'friendtalk', 'KakaoOption', 'setPfId', 'setText', '자유텍스트'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoOption;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 카카오 친구톡 발송 예제
 * 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $kakaoOption = new KakaoOption();
    $kakaoOption->setPfId("연동한 비즈니스 채널의 pfId")
        ->setVariables(null);

    $message = new Message();
    $message->setTo("수신번호")
        ->setText("2,000 byte 이내의 메시지 입력")
        ->setKakaoOptions($kakaoOption);

    // 문자 대체 발송을 희망하실 경우 계정 내에 등록하신 발신번호를 추가해주세요!
    // $message->setFrom("계정에서 등록한 발신번호 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setText("2,000 byte 이내의 메시지 입력")
            ->setKakaoOptions($kakaoOption);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/friendtalk'
    },
    {
      id: 'php-kakao-friendtalk-buttons',
      title: 'PHP 카카오 친구톡 버튼 발송',
      description: 'SOLAPI PHP SDK를 사용하여 버튼이 포함된 카카오 친구톡을 발송하는 예제입니다. 다양한 버튼 타입을 설정할 수 있습니다.',
      category: '친구톡',
      usage: 'KakaoOption에 setButtons()로 버튼 배열을 설정합니다. WL(웹링크), AL(앱링크), BK(봇키워드), MD(상담요청), BT(챗봇문의) 등 다양한 버튼 타입 지원합니다.',
      keywords: ['php', 'kakao', '친구톡', 'buttons', 'setButtons', 'WL', 'AL', 'BK', 'MD', 'BT', 'buttonType', 'buttonName'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoOption;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 카카오 친구톡 발송 예제
 * 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 * 버튼 타입에 대한 유형 설명은 아래 페이지를 참고해주세요!
 * @see https://developers.solapi.com/references/kakao/button-link-type
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    // 모든 버튼의 이름은 변경할 수 있습니다!
    $kakaoOption = new KakaoOption();
    $kakaoOption->setPfId("연동한 비즈니스 채널의 pfId")
        ->setVariables(null)
        ->setButtons([
            [
                "buttonType" => "WL", // 웹링크 유형
                "buttonName" => "버튼 이름",
                "linkMo" => "https://m.example.com", // 모바일 링크
                "linkPc" => "https://example.com" // PC 링크, 생략 가능
            ],
            [
                "buttonType" => "AL", // 앱링크 유형
                "buttonName" => "버튼 이름",
                "linkAnd" => "examplescheme://", // 안드로이드 앱 링크,
                "linkIos" => "examplescheme://" // iOS 앱 링크
            ],
            [
                "buttonType" =>  "BK", // 봇키워드 유형
                "buttonName" => "봇키워드"
            ],
            [
                "buttonType" => "MD", // 상담요청하기 유형 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
                "buttonName" => "상담요청하기"
            ],
            [
                "buttonType" => "BT", // 챗봇 문의 유형 (채널이 챗봇을 운영할 때 챗봇 문의로 전환할 수 있습니다)
                "buttonName" => "챗봇 문의"
            ],
            /*[
                "buttonType" => "BC", // 상담톡전환 유형 (상담톡 서비스 사용 시 가능)
                "buttonName" => "상담톡 전환"
            ],*/
        ]);

    $message = new Message();
    $message->setTo("수신번호")
        ->setText("2,000 byte 이내의 메시지 입력")
        ->setKakaoOptions($kakaoOption);

    // 문자 대체 발송을 희망하실 경우 계정 내에 등록하신 발신번호를 추가해주세요!
    // $message->setFrom("계정에서 등록한 발신번호 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setText("2,000 byte 이내의 메시지 입력")
            ->setKakaoOptions($kakaoOption);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/friendtalk-buttons'
    },
    {
      id: 'php-kakao-friendtalk-image',
      title: 'PHP 카카오 친구톡 이미지 발송',
      description: 'SOLAPI PHP SDK를 사용하여 이미지가 포함된 카카오 친구톡을 발송하는 예제입니다. 먼저 이미지를 업로드한 후 친구톡에 첨부하여 발송합니다.',
      category: '친구톡',
      usage: 'uploadFile()로 KAKAO 타입으로 이미지를 업로드하고, KakaoOption의 setImageId()로 설정한 후 발송합니다.',
      keywords: ['php', 'kakao', '친구톡', 'image', 'uploadFile', 'setImageId', '이미지친구톡', 'KAKAO'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Kakao\\KakaoOption;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 카카오 친구톡 발송 예제
 * 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $imageId = $messageService->uploadFile("images/example.jpg", "KAKAO", "파일명", "https://example.com");

    $kakaoOption = new KakaoOption();
    $kakaoOption->setPfId("연동한 비즈니스 채널의 pfId")
        ->setVariables(null)
        ->setImageId($imageId);

    $message = new Message();
    $message->setTo("수신번호")
        ->setText("2,000 byte 이내의 메시지 입력")
        ->setKakaoOptions($kakaoOption);

    // 문자 대체 발송을 희망하실 경우 계정 내에 등록하신 발신번호를 추가해주세요!
    // $message->setFrom("계정에서 등록한 발신번호 입력");

    // 한 번에 여러 메시지를 발송할 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    /*$message = [$message];
    for ($i = 0; $i < 3; $i++) {
        $tempMessage = new Message();
        $tempMessage->setTo("수신번호")
            ->setText("2,000 byte 이내의 메시지 입력")
            ->setKakaoOptions($kakaoOption);
        $message[] = $tempMessage;
    }*/

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/friendtalk-image'
    },
    {
      id: 'php-voice-message',
      title: 'PHP 음성메시지 발송',
      description: 'SOLAPI PHP SDK를 사용하여 음성메시지(ARS)를 발송하는 예제입니다. 헤더, 본문, 테일 메시지를 순차적으로 재생합니다.',
      category: '음성메시지',
      usage: 'VoiceOption 객체를 생성하여 voiceType, headerMessage, tailMessage를 설정하고 Message의 setVoiceOptions()로 설정한 후 발송합니다.',
      keywords: ['php', 'voice', '음성메시지', 'VoiceOption', 'VoiceType', 'FEMALE', 'MALE', 'headerMessage', 'tailMessage', 'replyRange', 'counselorNumber'],
      code: `<?php

require_once("vendor/autoload.php");

use Nurigo\\Solapi\\Exceptions\\MessageNotReceivedException;
use Nurigo\\Solapi\\Models\\Message;
use Nurigo\\Solapi\\Models\\Voice\\VoiceOption;
use Nurigo\\Solapi\\Models\\Voice\\VoiceReplyRange;
use Nurigo\\Solapi\\Models\\Voice\\VoiceType;
use Nurigo\\Solapi\\Services\\SolapiMessageService;

/**
 * 음성 메시지 발송 예제, 음성 메시지에 대한 설명은 아래 링크를 참고해주세요!
 * @see https://developers.solapi.com/references/voice
 * 발신번호, 수신번호, 고객센터 연결번호에 반드시 -, * 등 특수문자를 제거하여 기입하셔야 합니다! 예) 01012345678
 */
try {
    $messageService = new SolapiMessageService("YOUR_API_KEY", "YOUR_API_SECRET");

    $voiceOption = new VoiceOption();
    $voiceOption->setVoiceType(VoiceType::FEMALE)
        ->setHeaderMessage("머릿말입니다.")
        ->setTailMessage("꼬릿말입니다.");

    // $voiceOption에서 replyRange와 counselorNumber는 같이 사용할 수 없습니다! 둘중 하나의 옵션만 선택해서 발송해주세요.

    // replyRange는 1~9까지 허용됩니다. VoiceReplyRange 내 상수 값으로 접근해주세요!
    // $voiceOption->setReplyRange(VoiceReplyRange::NINE);

    // 고객센터 번호를 설정할 경우 사용자가 다이얼 0번을 눌러야 입력한 고객센터 번호로 이동합니다.
    // $voiceOption->setCounselorNumber("연결할 고객센터 번호");


    $message = new Message();
    $message->setTo("수신번호")
        ->setFrom("계정에서 등록한 발신번호 입력")
        ->setText("음성 메시지 입니다. 최대 1, 최대 980byte(한글 490자)까지 입력 가능합니다.")
        ->setVoiceOptions($voiceOption);

    // 예약 발송을 원하시는 경우 아래 주석을 해제하고 응용하여 사용해보세요!
    // date_default_timezone_set("Asia/Seoul");
    // $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", "2022-11-03 18:00:00");
    // $result = $messageService->send($message, $dateTime);

    $result = $messageService->send($message);
    print_r($result);
} catch (MessageNotReceivedException $exception) {
    print_r($exception->getFailedMessageList());
    print_r("----");
    print_r($exception->getMessage());
} catch (Exception $exception) {
    print_r($exception->getMessage());
}`,
      url: 'https://docs.solapi.com/php/voice'
    }
  ];

  /**
   * 모든 예제 반환
   */
  static getExamples(): Example[] {
    return this.examples;
  }

  /**
   * 카테고리별 예제 반환
   */
  static getExamplesByCategory(category: string): Example[] {
    return this.examples.filter(example => 
      example.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * ID로 특정 예제 검색
   */
  static getExampleById(id: string): Example | null {
    return this.examples.find(example => example.id === id) || null;
  }

  /**
   * 키워드로 예제 검색
   */
  static searchExamples(query: string): Example[] {
    const searchTerm = query.toLowerCase();
    
    return this.examples.filter(example => 
      example.title.toLowerCase().includes(searchTerm) ||
      example.description.toLowerCase().includes(searchTerm) ||
      example.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      example.code.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * 사용 가능한 카테고리 목록 반환
   */
  static getCategories(): string[] {
    const categories = this.examples.map(example => example.category);
    return [...new Set(categories)];
  }

  /**
   * 통계 정보 반환
   */
  static getStats() {
    return {
      totalExamples: this.examples.length,
      categories: this.getCategories().length,
      totalKeywords: this.examples.reduce((sum, ex) => sum + ex.keywords.length, 0),
      averageKeywordsPerExample: Math.round(
        this.examples.reduce((sum, ex) => sum + ex.keywords.length, 0) / this.examples.length
      )
    };
  }
}