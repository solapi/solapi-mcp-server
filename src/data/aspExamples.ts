import type { Example } from '../types';

/**
 * @file Classic ASP 예제 라이브러리
 * @description SOLAPI를 Classic ASP(VBScript)에서 사용하는 예제 모음
 */
export class AspExamplesLibrary {
  private static examples: Example[] = [
    {
      id: 'asp-get-balance',
      title: 'ASP 잔액 조회',
      description: 'Classic ASP에서 잔액/포인트를 조회하는 예제입니다.',
      category: '계정관리',
      usage: 'RequestGET("/cash/v1/balance")로 조회 후 balance/point 출력',
      keywords: ['asp', 'classic asp', 'vbscript', 'balance', '잔액', '포인트', 'cash'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../request.asp" -->
<%
Dim resultJSON

Set resultJSON = RequestGET("/cash/v1/balance")
Response.Write "잔액: " & resultJSON.data.item("balance")
Response.Write "포인트: " & resultJSON.data.item("point")

Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-sms-send',
      title: 'ASP SMS 발송',
      description: 'Classic ASP에서 단문 메시지(SMS)를 발송하는 예제입니다.',
      category: 'SMS',
      usage: 'SendMessages(oJSON) 호출로 메시지 발송',
      keywords: ['asp', 'classic asp', 'vbscript', 'sms', 'send', 'messages'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      .Add "to", "01012345678"
      .Add "from", "0212345678"
      .Add "text", "문자 발송 테스트"
    End With
  End With
End With

Dim resultJSON
resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-lms-send',
      title: 'ASP LMS 발송',
      description: 'Classic ASP에서 장문 메시지(LMS)를 발송하는 예제입니다.',
      category: 'LMS',
      usage: 'SendMessages(oJSON) 호출, subject/text 설정',
      keywords: ['asp', 'classic asp', 'vbscript', 'lms', 'send'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      .Add "to", "01012345678"
      .Add "from", "0212345678"
      .Add "subject", "LMS 제목"
      .Add "text", "LMS 문자 발송 테스트"
    End With
  End With
End With

Dim resultJSON
resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-mms-send',
      title: 'ASP MMS 발송',
      description: 'Classic ASP에서 MMS(이미지 포함) 발송 예제입니다. 업로드 후 imageId 사용',
      category: 'MMS',
      usage: 'UploadMMSImage("test.jpg")로 업로드 → imageId로 SendMessages',
      keywords: ['asp', 'classic asp', 'vbscript', 'mms', 'upload', 'imageId'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim fileInfo, fileId, resultJSON

' 이미지 업로드 (200KB 이하 JPG 이미지만 가능)
Set fileInfo = UploadMMSImage("test.jpg")
fileId = fileInfo.data("fileId")

Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      .Add "to", "01012345678"
      .Add "from", "0212345678"
      .Add "subject", "MMS 제목"
      .Add "text", "MMS 문자 테스트"
      .Add "imageId", fileId ' 이미지ID에 fileId값을 입력
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-message-list',
      title: 'ASP 메시지 목록 조회',
      description: 'Classic ASP에서 메시지 목록을 조회하고 HTML 테이블로 출력하는 예제입니다.',
      category: '상태조회',
      usage: 'ListMessages(queryString)로 조회, 페이징(nextKey) 처리',
      keywords: ['asp', 'classic asp', 'vbscript', 'message list', '조회', '페이징'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim toField, from, limit, startKey, startDate, endDate
' ... 폼 파라미터 읽기 생략 ...
' 쿼리스트링 구성
queryString = "?limit=" & limit
' ... 생략: startKey/to/from/startDate/endDate 조건 추가 ...

Set resultJSON = ListMessages(queryString)

For Each messageId In resultJSON.data("messageList")
  Set message = resultJSON.data("messageList").item(messageId)
  ' ISO8601 -> 한국시간
  Dim isoDate, datetime, localdatetime
  isoDate = message.item("dateCreated")
  datetime = CDate(Left(isoDate, 10) & " " & Mid(isoDate, 12, 8))
  datetime = DateAdd("h", 9, datetime)
  localdatetime =  FormatDateTime(datetime, vbGeneralDate)
  ' 출력 생략
Next
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-alimtalk-send',
      title: 'ASP 카카오 알림톡 발송',
      description: 'Classic ASP에서 카카오 알림톡을 발송하는 예제입니다.',
      category: '알림톡',
      usage: 'kakaoOptions(pfId, templateId, variables) 설정 후 SendMessages',
      keywords: ['asp', 'classic asp', 'vbscript', 'alimtalk', 'kakao', '템플릿'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim oJSON, resultJSON

Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      ' .Add "from", "0212345678"
      .Add "to", "01012345678"
      .Add "kakaoOptions", oJSON.Collection()
      With .item("kakaoOptions")
        .Add "pfId", "KA01PF1903260033550428GGGGGGGGab"
        .Add "templateId", "KA01TP2301260109382045fWJtLZUIab"
        .Add "disableSms", True
        .Add "variables", oJSON.Collection()
        With .item("variables")
          .Add "#{변수1}", "값1"
          .Add "#{변수2}", "값2"
        End With
      End With
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()

Set oJSON = Nothing
Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-get-bankaccount',
      title: 'ASP 전용계좌 정보 조회',
      description: 'Classic ASP에서 전용계좌(가상계좌) 발급 정보를 조회하는 예제입니다.',
      category: '계정관리',
      usage: 'RequestGET("/exclusive-account/v1/accounts")로 계좌 정보 확인',
      keywords: ['asp', 'vbscript', 'exclusive account', 'bank', '계좌', '전용계좌'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../request.asp" -->
<%
Dim resultJSON

Set resultJSON = RequestGET("/exclusive-account/v1/accounts")
If resultJSON.data.item("accountNumber") Then
  Response.Write "은행명: " & resultJSON.data.item("bankName")
  Response.Write "계좌번호: " & resultJSON.data.item("accountNumber")
Else
  Response.Write "발급된 계좌가 없습니다."
End If

Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-alimtalk-send-customfields',
      title: 'ASP 알림톡 발송 (CustomFields 포함)',
      description: '알림톡 발송 시 customFields 확장 필드를 포함하는 예제입니다.',
      category: '알림톡',
      usage: 'kakaoOptions + customFields(unique 등) 설정하여 SendMessages',
      keywords: ['asp', 'vbscript', 'alimtalk', 'customFields', '확장필드'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim oJSON, resultJSON

Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      ' .Add "from", "0212345678"
      .Add "to", "01012345678"
      .Add "kakaoOptions", oJSON.Collection()
      With .item("kakaoOptions")
        .Add "pfId", "KA01PF1903260033550428GGGGGGGGab"
        .Add "templateId", "KA01TP2301260109382045fWJtLZUIab"
        .Add "disableSms", True
        .Add "variables", oJSON.Collection()
        With .item("variables")
          .Add "#{변수1}", "값1"
          .Add "#{변수2}", "값2"
        End With
      End With
      .Add "customFields", oJSON.Collection()
      With .item("customFields")
        .Add "key1", "value1"
        .Add "key2", "value2"
        .Add "unique", "uniquevalue"
      End With
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()

Set oJSON = Nothing
Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-alimtalk-send-duplicates',
      title: 'ASP 알림톡 발송 (중복 허용)',
      description: 'allowDuplicates 설정으로 중복 수신번호 허용하여 발송하는 예제입니다.',
      category: '알림톡',
      usage: 'oJSON.data("allowDuplicates") = True 설정',
      keywords: ['asp', 'vbscript', 'alimtalk', 'allowDuplicates', '중복'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim oJSON, resultJSON

Set oJSON = New aspJSON
With oJSON.data
  .Add "allowDuplicates", True
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      ' .Add "from", "0212345678"
      .Add "to", "01012345678"
      .Add "kakaoOptions", oJSON.Collection()
      With .item("kakaoOptions")
        .Add "pfId", "KA01PF1903260033550428GGGGGGGGab"
        .Add "templateId", "KA01TP2301260109382045fWJtLZUIab"
        .Add "disableSms", True
        .Add "variables", oJSON.Collection()
        With .item("variables")
          .Add "#{변수1}", "값1"
          .Add "#{변수2}", "값2"
        End With
      End With
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()

Set oJSON = Nothing
Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-alimtalk-send-with-sms-fallback',
      title: 'ASP 알림톡 발송 (실패 시 문자 대체)',
      description: 'disableSms=False로 실패 시 SMS 대체 발송을 허용하는 예제입니다.',
      category: '알림톡',
      usage: 'kakaoOptions.disableSms=False 및 from 설정',
      keywords: ['asp', 'vbscript', 'alimtalk', 'sms fallback', 'disableSms'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim oJSON, resultJSON

Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      .Add "from", "021234567"
      .Add "to", "01012345678"
      .Add "kakaoOptions", oJSON.Collection()
      With .item("kakaoOptions")
        .Add "pfId", "KA01PF1903260033550428GGGGGGGGab"
        .Add "templateId", "KA01TP2301260109382045fWJtLZUIab"
        .Add "disableSms", False
        .Add "variables", oJSON.Collection()
        With .item("variables")
          .Add "#{변수1}", "값1"
          .Add "#{변수2}", "값2"
        End With
      End With
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()

Set oJSON = Nothing
Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-alimtalk-send-replacement',
      title: 'ASP 알림톡 + 대체문자(replacements) 발송',
      description: '알림톡 본문과 함께 대체 문자(replacements)를 지정하여 발송하는 예제입니다.',
      category: '알림톡',
      usage: 'kakaoOptions + replacements 배열 설정',
      keywords: ['asp', 'vbscript', 'alimtalk', 'replacements', '대체문자'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim oJSON, resultJSON

Set oJSON = New aspJSON
With oJSON.data
  .Add "messages", oJSON.Collection()
  With oJSON.data("messages")
    .Add 0, oJSON.Collection()
    With .item(0)
      .Add "to", "01012345678"
      .Add "kakaoOptions", oJSON.Collection()
      With .item("kakaoOptions")
        .Add "pfId", "KA01PF1903260033550428GGGGGGGGab"
        .Add "templateId", "KA01TP2301260109382045fWJtLZUIab"
        .Add "variables", oJSON.Collection()
        With .item("variables")
          .Add "#{변수1}", "값1"
          .Add "#{변수2}", "값2"
        End With
      End With
      .Add "replacements", oJSON.Collection()
      With .item("replacements")
        .Add 0, oJSON.Collection()
        With .item(0)
          .Add "from", "021112222"
          .Add "to", "01011112222"
          .Add "text", "대체 문자 발송"
        End With
      End With
    End With
  End With
End With

Set resultJSON = SendMessages(oJSON)
Response.Write resultJSON.JSONoutput()

Set oJSON = Nothing
Set resultJSON = Nothing
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-webhook-single-report',
      title: 'ASP 웹훅: 단일 메시지 리포트',
      description: 'SINGLE-REPORT 이벤트를 검증하고 페이로드를 파싱하는 Classic ASP 예제입니다.',
      category: '웹훅',
      usage: 'X-SOLAPI-SECRET 검증, Request.BinaryRead 바디 파싱 후 처리',
      keywords: ['asp', 'vbscript', 'webhook', 'single report', '보안', 'secret'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
' 보안을 위해 솔라피에서 보내온 것이 맞는지 체크한다.
Dim eventName, secret
eventName = Trim(Request.ServerVariables("HTTP_X_SOLAPI_EVENT_NAME"))
secret = Trim(Request.ServerVariables("HTTP_X_SOLAPI_SECRET"))
If eventName <> "SINGLE-REPORT" Then Response.End
If StrComp(secret, webhookSecretKey, vbTextCompare) <> 0 Then Response.End

If Request.TotalBytes > 0 Then
  Dim lngBytesCount, body
  lngBytesCount = Request.TotalBytes
  body = BytesToStr(Request.BinaryRead(lngBytesCount))

  Dim rJSON
  Set rJSON = New aspJSON
  rJSON.loadJSON(body)

  For Each index In rJSON.data
    Set message = rJSON.data(index)
    ' 처리 로직 예시
    If message.item("type") = "ATA" And message.item("statusCode") <> "4000" Then
      ' 실패 케이스 처리
    End If
  Next
End If

Function BytesToStr(bytes)
    Dim Stream
    Set Stream = Server.CreateObject("ADODB.Stream")
        Stream.Type = 1 'adTypeBinary
        Stream.Open
        Stream.Write bytes
        Stream.Position = 0
        Stream.Type = 2 'adTypeText
        Stream.Charset = "UTF-8"
        BytesToStr = Stream.ReadText
        Stream.Close
    Set Stream = Nothing
End Function
%>`,
      url: 'https://developers.solapi.com'
    },
    {
      id: 'asp-webhook-single-report-customfields',
      title: 'ASP 웹훅: 단일 리포트(CustomFields 처리)',
      description: '웹훅 페이로드의 customFields 값을 추출하는 예제입니다.',
      category: '웹훅',
      usage: 'customFields.key1/key2 등 키 추출',
      keywords: ['asp', 'vbscript', 'webhook', 'customFields'],
      code: `<%@Language="VBScript" CODEPAGE="65001" %>
<!--#include file="../aspJSON1.19.asp" -->
<!--#include file="../messages.asp" -->
<%
Dim eventName, secret
eventName = Trim(Request.ServerVariables("HTTP_X_SOLAPI_EVENT_NAME"))
secret = Trim(Request.ServerVariables("HTTP_X_SOLAPI_SECRET"))
If eventName <> "SINGLE-REPORT" Then Response.End
If StrComp(secret, webhookSecretKey, vbTextCompare) <> 0 Then Response.End

If Request.TotalBytes > 0 Then
  Dim lngBytesCount, body
  lngBytesCount = Request.TotalBytes
  body = BytesToStr(Request.BinaryRead(lngBytesCount))

  Dim rJSON
  Set rJSON = New aspJSON
  rJSON.loadJSON(body)

  For Each index In rJSON.data
    Set message = rJSON.data(index)
    If message.item("type") = "ATA" And message.item("statusCode") <> "4000" Then
      Set customFields = message.item("customFields")
      Dim key1, key2
      key1 = customFields("key1")
      key2 = customFields("key2")
    End If
  Next
End If

Function BytesToStr(bytes)
    Dim Stream
    Set Stream = Server.CreateObject("ADODB.Stream")
        Stream.Type = 1 'adTypeBinary
        Stream.Open
        Stream.Write bytes
        Stream.Position = 0
        Stream.Type = 2 'adTypeText
        Stream.Charset = "UTF-8"
        BytesToStr = Stream.ReadText
        Stream.Close
    Set Stream = Nothing
End Function
%>`,
      url: 'https://developers.solapi.com'
    }
  ];

  static getExamples(): Example[] {
    return this.examples;
  }

  static getExamplesByCategory(category: string): Example[] {
    return this.examples.filter(example => 
      example.category.toLowerCase() === category.toLowerCase()
    );
  }

  static getExampleById(id: string): Example | null {
    return this.examples.find(example => example.id === id) || null;
  }

  static searchExamples(query: string): Example[] {
    const searchTerm = query.toLowerCase();
    return this.examples.filter(example => 
      example.title.toLowerCase().includes(searchTerm) ||
      example.description.toLowerCase().includes(searchTerm) ||
      example.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      example.code.toLowerCase().includes(searchTerm)
    );
  }

  static getCategories(): string[] {
    const categories = this.examples.map(example => example.category);
    return [...new Set(categories)];
  }
}
