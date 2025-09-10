/**
 * @file Python SDK 예제 라이브러리
 * @description SOLAPI Python SDK 사용 예제 모음
 */
import type { Example } from '../types';

export class PythonExamplesLibrary {
  private static examples: Example[] = [
    {
      id: 'python-balance-check',
      title: 'Python 잔액 조회',
      description: 'SOLAPI Python SDK를 사용하여 계정 잔액을 조회하는 예제입니다.',
      category: '계정관리',
      usage: 'from solapi import SolapiMessageService를 import하고 get_balance() 메서드를 호출합니다.',
      keywords: ['python', 'balance', '잔액', '조회', 'get_balance', 'SolapiMessageService', '계정'],
      code: `from solapi import SolapiMessageService

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

try:
    # 잔액을 조회합니다
    balance_response = message_service.get_balance()

    print("잔액 조회 성공!")
    print(f"현재 잔액: {balance_response.balance}원")
    print(f"포인트: {balance_response.point}P")

except Exception as e:
    print(f"잔액 조회 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/balance'
    },
    {
      id: 'python-groups-get',
      title: 'Python 메시지 그룹 조회',
      description: 'SOLAPI Python SDK를 사용하여 메시지 그룹 목록을 조회하는 예제입니다.',
      category: '상태조회',
      usage: 'from solapi import SolapiMessageService를 import하고 get_groups() 메서드를 호출합니다.',
      keywords: ['python', 'group', '그룹', '조회', 'get_groups', 'SolapiMessageService', '메시지그룹', '상태'],
      code: `from solapi import SolapiMessageService

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 메시지 그룹을 생성하고 조회합니다
try:
    # 그룹 목록을 조회합니다
    groups_response = message_service.get_groups()
    print("메시지 그룹 목록:")
    for group_id, group in groups_response.group_list.items():
        print("----")
        print(f"\\nGroup ID: {group_id}")
        print(f"생성 시간: {group.date_created}")
        print(f"메시지 수: {group.count.total}")
        print(f"상태: {group.status}")
        print(f"처리 로그: {group.log}")
        print("----")

except Exception as e:
    print(f"그룹 조회 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/groups'
    },
    {
      id: 'python-messages-get',
      title: 'Python 메시지 조회',
      description: 'SOLAPI Python SDK를 사용하여 전송된 메시지 목록을 조회하는 예제입니다.',
      category: '상태조회',
      usage: 'from solapi import SolapiMessageService를 import하고 get_messages() 메서드를 호출합니다. 날짜 범위 등의 조건을 지정할 수 있습니다.',
      keywords: ['python', 'messages', '메시지', '조회', 'get_messages', 'SolapiMessageService', '발송내역', '상태', 'GetMessagesRequest'],
      code: `from solapi import SolapiMessageService

# from solapi.model.request.messages.get_messages import GetMessagesRequest

message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

try:
    response = message_service.get_messages(
        # 메시지를 조회할 때 아래와 같이 조건을 지정할 수 있습니다.
        # GetMessagesRequest(
        #     start_date="2025-01-01",
        #     end_date="2025-01-03"
        # )
    )
    print(response)
except Exception as e:
    print(e)`,
      url: 'https://docs.solapi.com/python/messages'
    },
    {
      id: 'python-storage-upload',
      title: 'Python 파일 업로드',
      description: 'SOLAPI Python SDK를 사용하여 MMS나 카카오톡에서 사용할 이미지/파일을 업로드하는 예제입니다.',
      category: '파일업로드',
      usage: 'from solapi import SolapiMessageService와 FileTypeEnum을 import하고 upload_file() 메서드를 호출합니다.',
      keywords: ['python', 'storage', '파일업로드', 'upload_file', 'FileTypeEnum', 'MMS', 'KAKAO', 'DOCUMENT', '이미지', '첨부파일'],
      code: `from solapi import SolapiMessageService
from solapi.model.request.storage import FileTypeEnum

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)


def upload_file_example(file_path: str, file_type: FileTypeEnum):
    """
    파일을 업로드하는 예제 함수입니다.

    Args:
        file_path (str): 업로드할 파일의 경로
        file_type (FileTypeEnum): 파일 타입 (MMS, KAKAO, DOCUMENT 등)
    """
    try:
        # 파일 업로드
        response = message_service.upload_file(
            file_path=file_path, upload_type=file_type
        )

        print("파일 업로드 성공!")
        print(f"File ID: {response.file_id}")
        print(f"File Name: {response.name}")
        print(f"File Created: {response.date_created}")

        return response.file_id

    except Exception as e:
        print(f"파일 업로드 실패: {str(e)}")
        return None


# 예제 실행
if __name__ == "__main__":
    # MMS 이미지 업로드 예제
    # 현재 예제는 images 폴더에 있는 example.jpg 파일을 불러오지만, 실제 예제 사용시에는 이미지 파일의 경로를 변경해주세요
    mms_file_id = upload_file_example("../images/example.jpg", FileTypeEnum.MMS)`,
      url: 'https://docs.solapi.com/python/storage'
    },
    {
      id: 'python-sms-send',
      title: 'Python SMS 발송',
      description: 'SOLAPI Python SDK를 사용하여 SMS를 발송하는 기본 예제입니다.',
      category: 'SMS',
      usage: 'from solapi import SolapiMessageService와 RequestMessage를 import하고 send() 메서드를 호출합니다.',
      keywords: ['python', 'SMS', '문자발송', 'send', 'RequestMessage', 'SolapiMessageService', '단문', '메시지발송'],
      code: `from solapi import SolapiMessageService
from solapi.model import RequestMessage

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 단일 메시지를 생성합니다
message = RequestMessage(
    from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
    to="수신번호",  # 수신번호
    text="안녕하세요! SOLAPI Python SDK를 사용한 SMS 발송 예제입니다.",
)

# 메시지를 발송합니다
try:
    response = message_service.send(message)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered_success}")
    print(f"실패한 메시지 개수: {response.group_info.count.registered_failed}")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/sms'
    },
    {
      id: 'python-mms-send',
      title: 'Python MMS 발송',
      description: 'SOLAPI Python SDK를 사용하여 이미지가 포함된 MMS를 발송하는 예제입니다.',
      category: 'MMS',
      usage: '먼저 upload_file()로 이미지를 업로드하고, RequestMessage에서 image_id를 지정하여 MMS를 발송합니다.',
      keywords: ['python', 'MMS', '멀티미디어', '이미지발송', 'upload_file', 'RequestMessage', 'FileTypeEnum', 'image_id'],
      code: `from os.path import abspath

from solapi import SolapiMessageService
from solapi.model import RequestMessage
from solapi.model.request.storage import FileTypeEnum

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 이미지 파일을 업로드합니다
try:
    # 이미지 파일 업로드 (MMS 타입으로 지정)
    file_response = message_service.upload_file(
        file_path=abspath(
            "../images/example.jpg"
        ),  # 실제 이미지 파일 경로로 변경해주세요
        upload_type=FileTypeEnum.MMS,
    )

    print("파일 업로드 성공!")
    print(f"File ID: {file_response.file_id}")

    # MMS 메시지를 생성하고 발송합니다
    message = RequestMessage(
        from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
        to="수신번호",  # 수신번호
        # subject="MMS 제목", # MMS 제목, 제목을 지정하지 않는다면 필요하지 않습니다.
        text="MMS 메시지 내용입니다.",
        image_id=file_response.file_id,  # 업로드된 파일의 ID를 지정
    )

    # 메시지를 발송합니다
    response = message_service.send(message)
    print("\\nMMS 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered_success}")

except Exception as e:
    print(f"MMS 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/mms'
    },
    {
      id: 'python-sms-reservation',
      title: 'Python SMS 예약발송',
      description: 'SOLAPI Python SDK를 사용하여 SMS를 예약발송하는 예제입니다.',
      category: '예약발송',
      usage: 'SendRequestConfig에 scheduled_date를 지정하여 예약발송을 설정합니다.',
      keywords: ['python', 'SMS', '예약발송', 'scheduled_date', 'SendRequestConfig', 'RequestMessage', 'datetime'],
      code: `from datetime import datetime

from solapi import SolapiMessageService
from solapi.model import RequestMessage, SendRequestConfig

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 단일 메시지를 생성합니다
message = RequestMessage(
    from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
    to="수신번호",  # 수신번호
    text="안녕하세요! SOLAPI Python SDK를 사용한 SMS 발송 예제입니다.",
)

# 예약 발송을 위한 설정을 추가합니다
request_config = SendRequestConfig(scheduled_date=datetime(2025, 4, 2, 13, 0, 0))
# 혹은..
# request_config = SendRequestConfig(scheduled_date="2025-04-02 13:00:00")

# 메시지를 발송합니다
try:
    response = message_service.send(message, request_config)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered_success}")
    print(f"실패한 메시지 개수: {response.group_info.count.registered_failed}")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/reservation'
    },
    {
      id: 'python-voice-message',
      title: 'Python 음성메시지 발송',
      description: 'SOLAPI Python SDK를 사용하여 음성메시지(ARS)를 발송하는 예제입니다.',
      category: '음성메시지',
      usage: 'RequestMessage에 VoiceOption을 설정하여 음성메시지를 발송합니다. header_message, text, tail_message 순으로 재생됩니다.',
      keywords: ['python', 'voice', '음성메시지', 'VoiceOption', 'ARS', 'FEMALE', 'MALE', 'header_message', 'tail_message'],
      code: `from solapi import SolapiMessageService
from solapi.model import RequestMessage, VoiceOption

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

"""
단일 메시지를 생성합니다
header_message를 사용하는 경우, 반드시 아무 버튼이나 눌러야 text 메시지가 재생됩니다.
text 메시지가 재생된 이후, reply_range에 명시된 번호(1~9) 혹은 counselor_number에 값이 있을 경우 0번을 눌러야 tail_message가 재생됩니다.
자세한 사항은 아래 링크를 참고해주세요!

https://developers.solapi.com/references/voice
"""
message = RequestMessage(
    from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
    to="수신번호",  # 수신번호
    text="안녕하세요! SOLAPI Python SDK를 사용한 음성 메시지 발송 예제입니다.",
    voice_options=VoiceOption(
        voice_type="FEMALE",
        header_message="안녕하세요!",
        tail_message="안녕하세요!",
        reply_range=1,
    ),
)

# 메시지를 발송합니다
try:
    response = message_service.send(message)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered_success}")
    print(f"실패한 메시지 개수: {response.group_info.count.registered_failed}")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/voice'
    },
    {
      id: 'python-kakao-alimtalk',
      title: 'Python 카카오 알림톡 발송',
      description: 'SOLAPI Python SDK를 사용하여 카카오 알림톡을 발송하는 예제입니다.',
      category: '알림톡',
      usage: 'KakaoOption에 pf_id와 template_id를 설정하여 알림톡을 발송합니다.',
      keywords: ['python', 'kakao', '알림톡', 'KakaoOption', 'pf_id', 'template_id', 'variables', '카카오'],
      code: `from solapi import SolapiMessageService
from solapi.model import RequestMessage
from solapi.model.kakao.kakao_option import KakaoOption

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 카카오 알림톡 발송을 위한 옵션을 생성합니다.
kakao_option = KakaoOption(
    pf_id="계정에 등록된 카카오 비즈니스 채널ID",
    template_id="계정에 등록된 카카오 알림톡 템플릿 ID",
    # 만약에 템플릿에 변수가 있다면 아래와 같이 설정합니다.
    # 값은 반드시 문자열로 넣어주셔야 합니다!
    # variables={
    #   "#{name}": "홍길동",
    #   "#{age}": "30"
    # }
)

# 단일 메시지를 생성합니다
message = RequestMessage(
    from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
    to="수신번호",  # 수신번호
    kakao_options=kakao_option,
)

# 메시지를 발송합니다
try:
    response = message_service.send(message)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered}")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/alimtalk'
    },
    {
      id: 'python-kakao-bms',
      title: 'Python 카카오 브랜드 메시지 발송',
      description: 'SOLAPI Python SDK를 사용하여 카카오 브랜드 메시지(BMS)를 발송하는 예제입니다.',
      category: '알림톡',
      usage: 'KakaoOption에 Bms 타겟팅을 설정하여 브랜드 메시지를 발송합니다. M(마케팅), N(일반), I(친구)로 타겟팅 설정 가능합니다.',
      keywords: ['python', 'kakao', '브랜드메시지', 'BMS', 'Bms', 'targeting', 'M', 'N', 'I', '마케팅'],
      code: `from solapi import SolapiMessageService
from solapi.model import Bms, KakaoOption, RequestMessage

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 카카오 알림톡 발송을 위한 옵션을 생성합니다.
kakao_option = KakaoOption(
    pf_id="계정에 등록된 카카오 비즈니스 채널ID",
    template_id="계정에 등록된 카카오 브랜드 메시지 템플릿 ID",
    # 만약에 템플릿에 변수가 있다면 아래와 같이 설정합니다.
    # 값은 반드시 문자열로 넣어주셔야 합니다!
    # variables={
    #   "#{name}": "홍길동",
    #   "#{age}": "30"
    # }
    # 브랜드 메시지 발송 대상자 설정, M, N 타입은 카카오측의 별도 인허가를 받은 대상만 사용할 수 있습니다.
    # M: 마케팅 수신 동의 대상자 및 카카오 채널 친구
    # N: 마케팅 수신 동의 대상자 및 카카오 채널 친구는 제외한 대상자
    # I: 카카오 채널 친구
    bms=Bms(targeting="M"),
)

# 단일 메시지를 생성합니다
message = RequestMessage(
    from_="발신번호",  # 발신번호 (등록된 발신번호만 사용 가능)
    to="수신번호",  # 수신번호
    kakao_options=kakao_option,
)

# 메시지를 발송합니다
try:
    response = message_service.send(message)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered}")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/bms'
    },
    {
      id: 'python-send-many',
      title: 'Python 대량 메시지 발송',
      description: 'SOLAPI Python SDK를 사용하여 여러 메시지를 한 번에 발송하는 예제입니다.',
      category: '대량발송',
      usage: '여러 RequestMessage를 리스트로 만들어 send() 메서드에 전달합니다. SendRequestConfig로 중복 허용 등 설정 가능합니다.',
      keywords: ['python', 'bulk', '대량발송', 'send_many', 'allow_duplicates', 'failed_message_list', '리스트'],
      code: `from solapi import SolapiMessageService
from solapi.model import RequestMessage, SendRequestConfig

# API 키와 API Secret을 설정합니다
message_service = SolapiMessageService(
    api_key="YOUR_API_KEY", api_secret="YOUR_API_SECRET"
)

# 여러 메시지를 생성합니다
messages = [
    RequestMessage(from_="발신번호", to="수신번호1", text="첫 번째 메시지입니다."),
    RequestMessage(from_="발신번호", to="수신번호2", text="두 번째 메시지입니다."),
    RequestMessage(from_="발신번호", to="수신번호3", text="세 번째 메시지입니다."),
]

# SendRequestConfig를 사용하여 중복 수신번호 허용 설정
config = SendRequestConfig(
    allow_duplicates=True  # 중복 수신번호 허용
)

# 메시지를 발송합니다
try:
    response = message_service.send(messages, config)
    print("메시지 발송 성공!")
    print(f"Group ID: {response.group_info.group_id}")
    print(f"요청한 메시지 개수: {response.group_info.count.total}")
    print(f"성공한 메시지 개수: {response.group_info.count.registered}")

    # 실패한 메시지가 있는 경우
    if response.failed_message_list:
        print("\\n실패한 메시지 목록:")
        for failed in response.failed_message_list:
            print(f"수신번호: {failed.message.to}")
            print(f"실패 사유: {failed.error.message}\\n")
except Exception as e:
    print(f"메시지 발송 실패: {str(e)}")`,
      url: 'https://docs.solapi.com/python/bulk'
    },
    {
      id: 'python-webhook-single-report',
      title: 'Python 단일 메시지 웹훅 (Django)',
      description: 'SOLAPI Python SDK를 사용하여 Django에서 단일 메시지 발송 결과를 받는 웹훅 예제입니다.',
      category: '웹훅',
      usage: 'Django View에서 SingleReportPayload를 사용하여 웹훅 데이터를 파싱하고 처리합니다. @csrf_exempt 필수입니다.',
      keywords: ['python', 'webhook', '웹훅', 'django', 'SingleReportPayload', 'csrf_exempt', 'single_report', '발송결과'],
      code: `import json

from django.http import HttpResponseNotAllowed, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from solapi.model.webhook.single_report import SingleReportPayload


@method_decorator(csrf_exempt, name="dispatch")
class SingleReportWebhookController(View):
    """
    POST 로만 받는 메시지 리포트(Single Report) 웹훅 엔드포인트
    CSRF 예외 처리(@csrf_exempt) 를 걸어야 외부에서 POST 요청이 들어올 때 403 에러가 나지 않습니다.
    """

    http_method_names = ["post", "options"]

    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "invalid JSON"}, status=400)

        message_response = SingleReportPayload.model_validate(payload)
        single_report = message_response.root[0]

        # 이후 필요한 프로그래밍 처리.. 아래 방식처럼 데이터를 추출해서 사용할 수 있습니다.
        print(single_report.data.kakao_options.pf_id)

        # 혹은..
        print(single_report.data.message_id)

        # 또는..
        print(single_report.data.naver_options)

        # 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
        return JsonResponse(single_report.model_dump(), status=200)

    def options(self, request, *args, **kwargs):
        response = JsonResponse({"status": "options OK"})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    def http_method_not_allowed(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(["POST", "OPTIONS"])`,
      url: 'https://docs.solapi.com/python/webhook'
    },
    {
      id: 'python-webhook-group-report',
      title: 'Python 그룹 메시지 웹훅 (Django)',
      description: 'SOLAPI Python SDK를 사용하여 Django에서 그룹 메시지 발송 완료 알림을 받는 웹훅 예제입니다.',
      category: '웹훅',
      usage: 'Django View에서 GroupReportPayload를 사용하여 그룹 발송 완료 웹훅 데이터를 파싱하고 처리합니다.',
      keywords: ['python', 'webhook', '웹훅', 'django', 'GroupReportPayload', 'group_report', '그룹발송', '완료알림'],
      code: `import json

from django.http import HttpResponseNotAllowed, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from solapi.model.webhook.group_report import GroupReportPayload


@method_decorator(csrf_exempt, name="dispatch")
class GroupReportWebhookController(View):
    """
    POST 로만 받는 그룹 리포트(Group Report) 웹훅 엔드포인트
    CSRF 예외 처리(@csrf_exempt) 를 걸어야 외부에서 POST 요청이 들어올 때 403 에러가 나지 않습니다.
    """

    http_method_names = ["post", "options"]

    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "invalid JSON"}, status=400)

        message_response = GroupReportPayload.model_validate(payload)
        group_report = message_response.root[0]

        # 이후 필요한 프로그래밍 처리.. 아래 방식처럼 데이터를 추출해서 사용할 수 있습니다.
        print(group_report.data.group_id)

        # 혹은..
        print(group_report.data.date_created)

        # 또는..
        print(group_report.data.log)

        # 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
        return JsonResponse(group_report.model_dump(), status=200)

    def options(self, request, *args, **kwargs):
        response = JsonResponse({"status": "options OK"})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    def http_method_not_allowed(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(["POST", "OPTIONS"])`,
      url: 'https://docs.solapi.com/python/webhook'
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