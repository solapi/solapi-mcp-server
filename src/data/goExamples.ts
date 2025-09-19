import type { Example } from "../types";

/**
 * @file Go SDK 예제 라이브러리
 * @description SOLAPI Go SDK 사용 예제 모음
 */
export class GoExamplesLibrary {
  private static examples: Example[] = [
    {
      id: "go-sms-send-v2",
      title: "Go SMS 발송 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 SMS 문자를 발송하는 예제입니다.",
      category: "SMS",
      usage:
        "client.Messages.Send()를 사용하여 단일 또는 다중 SMS를 발송합니다.",
      keywords: ["go", "golang", "sms", "v2", "sdk", "발송", "solapi-go"],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")

	// 발신번호 및 수신번호 입력 형식은 01000000000 형식으로 입력하세요.
	to := "수신번호 입력"
	from := "계정에 등록한 발신번호 입력"
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 단일 SMS 발송 ===
	msg := messages.Message{
		To:   to,
		From: from,
		Text: "SOLAPI GO SDK V2 문자 발송 테스트",
	}

	res, err := c.Messages.Send(context.Background(), msg)
	if err != nil {
		fmt.Println("send error:", err)
		os.Exit(1)
	}
	b, err := json.MarshalIndent(res, "", "  ")
	if err != nil {
		fmt.Println("marshal error:", err)
		os.Exit(1)
	}
	fmt.Println(string(b))

	// === 여러 메시지 발송 ===
	// msgs := []messages.Message{
	// 	{
	// 		To:   "수신번호1",
	// 		From: from,
	// 		Text: "첫 번째 메시지",
	// 	},
	// 	{
	// 		To:   "수신번호2",
	// 		From: from,
	// 		Text: "두 번째 메시지",
	// 	},
	// }

	// // 중복 수신번호 허용 시
	// allowDuplicates := true
	// res, err := c.Messages.Send(context.Background(), msgs, messages.SendOptions{
	// 	AllowDuplicates: &allowDuplicates,
	// })

	// === 옵션 설명 ===
	// - To: 수신번호 (필수, 숫자만 입력)
	// - From: 발신번호 (필수, 등록된 발신번호만 사용 가능)
	// - Text: 메시지 내용 (필수)
	// - AllowDuplicates: 중복 수신번호 허용 여부 (선택)

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. 한 번 호출 당 최대 10,000건까지 발송 가능합니다.
	// 3. 메시지 내용은 한글 기준 최대 1,000자 까지 입력할 수 있으며,
	//    한글 기준 메시지 내용이 45자가 넘어가면 자동으로 LMS으로 전환됩니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-sms-reserved-send-v2",
      title: "Go SMS 예약 발송 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 SMS 문자를 예약 발송하는 예제입니다.",
      category: "예약발송",
      usage:
        "messages.SendOptions의 ScheduledDate를 설정하여 예약 발송을 요청합니다.",
      keywords: [
        "go",
        "golang",
        "sms",
        "예약발송",
        "v2",
        "sdk",
        "scheduled",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
)

// sendReservedSMS 는 delay 뒤에 예약 발송을 수행하고 응답 구조체를 리턴합니다.
func sendReservedSMS(ctx context.Context, apiKey, apiSecret, to, from string, delay time.Duration) (messages.DetailGroupMessageResponse, error) {
	c := client.NewClient(apiKey, apiSecret)

	// delay 뒤 예약발송 시간 (RFC3339, UTC)
	scheduledAt := time.Now().UTC().Add(delay).Format(time.RFC3339)

	msg := messages.Message{
		To:   to,
		From: from,
		Text: "SOLAPI GO SDK V2 예약 문자 발송 테스트",
	}

	showMessageList := true

	return c.Messages.Send(ctx, msg, messages.SendOptions{
		ScheduledDate:   scheduledAt,
		ShowMessageList: &showMessageList,
	})
}

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	to := "수신번호 입력"
	from := "계정에 등록한 발신번호 입력"
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	// 10분 후 예약 발송
	res, err := sendReservedSMS(context.Background(), apiKey, apiSecret, to, from, 10*time.Minute)
	if err != nil {
		fmt.Println("send error:", err)
		os.Exit(1)
	}
	b, err := json.MarshalIndent(res, "", "  ")
	if err != nil {
		fmt.Println("marshal error:", err)
		os.Exit(1)
	}
	fmt.Println(string(b))

	// === 옵션 설명 ===
	// - To: 수신번호 (필수, 숫자만 입력)
	// - From: 발신번호 (필수, 등록된 발신번호만 사용 가능)
	// - Text: 메시지 내용 (필수)
	// - ScheduledDate: 예약 발송 시간 (RFC3339 형식, UTC, 필수)
	// - ShowMessageList: 메시지 목록 표시 여부 (선택)

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. 예약 발송 시간은 현재 시간보다 미래여야 합니다.
	// 3. 예약 발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
	// 4. 메시지 내용은 최대 90바이트까지 지원됩니다. (한글 기준 약 45자)
	// 5. 예약 발송은 최대 6개월 까지 설정 가능합니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-mms-send-with-upload-v2",
      title: "Go MMS 발송 (파일 업로드 포함, V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 이미지 파일을 업로드하고 MMS를 발송하는 예제입니다.",
      category: "MMS",
      usage:
        "client.Storages.Upload()로 파일을 업로드한 후 client.Messages.Send()로 MMS를 발송합니다.",
      keywords: [
        "go",
        "golang",
        "mms",
        "파일업로드",
        "이미지",
        "v2",
        "sdk",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
	"github.com/solapi/solapi-go/v2/storages"
)

// 파일을 읽고 Base64로 인코딩하는 함수
func mustReadAndEncode(path string) string {
	b, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("failed to read file:", err)
		os.Exit(1)
	}
	return base64.StdEncoding.EncodeToString(b)
}

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	to := "수신번호 입력"
	from := "계정에 등록한 발신번호 입력"
	if apiKey == "" || apiSecret == "" || to == "" || from == "" {
		fmt.Println("환경변수(API_KEY, API_SECRET, TO, FROM)가 필요합니다.")
		os.Exit(1)
	}

	// 예제 이미지 경로: 현재 디렉터리 기준 test.jpg
	// 또는 임의 경로를 FILE_PATH 환경변수로 지정 가능
	filePath := os.Getenv("FILE_PATH")
	if filePath == "" {
		wd, _ := os.Getwd()
		filePath = filepath.Join(wd, "test.jpg")
	}

	encoded := mustReadAndEncode(filePath)
	c := client.NewClient(apiKey, apiSecret)

	// === 1단계: 파일 업로드 ===
	upReq := storages.UploadFileRequest{
		File: encoded,                // Base64로 인코딩된 파일 데이터
		Name: filepath.Base(filePath), // 파일명
		Type: "MMS",                  // 업로드 타입
	}
	upRes, err := c.Storages.Upload(context.Background(), upReq)
	if err != nil {
		fmt.Println("upload error:", err)
		os.Exit(1)
	}

	// === 2단계: MMS 메시지 발송 ===
	msg := messages.Message{
		To:      to,
		From:    from,
		Type:    "MMS",
		Subject: "MMS 발송 테스트", // MMS 제목 (선택)
		Text:    "이미지 한 장이 포함된 MMS",
		ImageID: upRes.FileID, // 업로드된 파일의 ID (필수)
	}

	res, err := c.Messages.Send(context.Background(), msg)
	if err != nil {
		fmt.Println("send error:", err)
		os.Exit(1)
	}
	fmt.Printf("groupId=%s total=%d registeredFailed=%d\n", res.GroupID, res.GroupInfo.Count.Total, res.GroupInfo.Count.RegisteredFailed)

	// === 옵션 설명 ===
	// - To: 수신번호 (필수, 숫자만 입력)
	// - From: 발신번호 (필수, 등록된 발신번호만 사용 가능)
	// - Type: 메시지 타입, "MMS"로 설정 (필수)
	// - Subject: MMS 제목 (선택)
	// - Text: 메시지 내용 (필수)
	// - ImageID: 업로드된 이미지 파일의 ID (필수)

	// === 지원 파일 형식 ===
	// - 이미지: JPG, JPEG, PNG
	// - 파일 크기: 최대 200KB

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. 파일 업로드 후 반환된 FileID를 사용하여 MMS를 발송해야 합니다.
	// 3. MMS 메시지 텍스트는 최대 2,000바이트까지 지원됩니다. (한글 기준 약 1,000자)
	// 4. 발송 간 이미지 파일 ID가 없는 경우 SMS/LMS로 자동 전환됩니다.

	// === 실행 방법 ===
	// # 기본 이미지 파일(test.jpg)로 실행
	// go run main.go
	// 
	// # 다른 이미지 파일로 실행
	// export FILE_PATH="/path/to/your/image.jpg"
	// go run main.go
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-alimtalk-send-v2",
      title: "Go 알림톡 발송 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 카카오 알림톡을 발송하는 예제입니다.",
      category: "알림톡",
      usage: "messages.Message의 KakaoOptions를 설정하여 알림톡을 발송합니다.",
      keywords: [
        "go",
        "golang",
        "알림톡",
        "kakao",
        "v2",
        "sdk",
        "alimtalk",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	to := "수신번호 입력"
	from := "계정에 등록한 발신번호 입력"
	
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 단일 알림톡 발송 ===
	msg := messages.Message{
		To:   to,
		From: from,
		KakaoOptions: &messages.KakaoOptions{
			PfID:       "비즈니스 채널 PfID",     // 연동한 비즈니스 채널의 고유 ID (필수)
			TemplateID: "알림톡 템플릿 ID",        // 등록한 알림톡 템플릿의 ID (필수)
			Variables: map[string]string{        // 템플릿의 치환문구를 대체할 값들 (선택)
				"#{변수명}": "치환할 값",
			},
		},
	}

	res, err := c.Messages.Send(context.Background(), msg)
	if err != nil {
		fmt.Println("send error:", err)
		os.Exit(1)
	}
	
	b, err := json.MarshalIndent(res, "", "  ")
	if err != nil {
		fmt.Println("marshal error:", err)
		os.Exit(1)
	}
	fmt.Println(string(b))

	// === 여러 메시지 발송 예제 ===
	// msgs := []messages.Message{
	// 	{
	// 		To:   "수신번호1",
	// 		From: from,
	// 		KakaoOptions: &messages.KakaoOptions{
	// 			PfID:       "비즈니스 채널 PfID",
	// 			TemplateID: "알림톡 템플릿 ID",
	// 			Variables: map[string]string{
	// 				"#{이름}": "홍길동",
	// 			},
	// 		},
	// 	},
	// 	{
	// 		To:   "수신번호2",
	// 		From: from,
	// 		KakaoOptions: &messages.KakaoOptions{
	// 			PfID:       "비즈니스 채널 PfID",
	// 			TemplateID: "알림톡 템플릿 ID",
	// 			Variables: map[string]string{
	// 				"#{이름}": "김철수",
	// 			},
	// 		},
	// 	},
	// }
	// res, err := c.Messages.Send(context.Background(), msgs)

	// === 옵션 설명 ===
	// - PfID: 연동한 비즈니스 채널의 고유 ID (필수)
	// - TemplateID: 등록한 알림톡 템플릿의 ID (필수)
	// - Variables: 템플릿의 치환문구를 대체할 값들 (선택)
	// - DisableSms: true로 설정하면 문자 대체발송이 비활성화됩니다 (선택)
	// - AllowDuplicates: 중복 수신번호 허용 여부 (선택)

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 비즈니스 채널 연동: 카카오 비즈니스 채널을 연동하고 PfID를 확인하세요.
	// 3. 알림톡 템플릿 등록: 사용할 알림톡 템플릿을 등록하고 템플릿 ID를 확인하세요.

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. 한 번 호출 당 최대 10,000건까지 발송 가능합니다.
	// 3. 치환문구(Variables)를 사용할 경우 반드시 key와 value 모두 string 타입이어야 합니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-voice-message-send-v2",
      title: "Go 음성 메시지 발송 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 음성 메시지(TTS)를 발송하는 예제입니다.",
      category: "음성메시지",
      usage:
        "messages.Message의 VoiceOptions를 설정하여 음성 메시지를 발송합니다.",
      keywords: [
        "go",
        "golang",
        "음성메시지",
        "tts",
        "voice",
        "v2",
        "sdk",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
)

// 음성 메시지를 생성하는 함수
func buildVoiceMessage(to, from string) messages.Message {
	return messages.Message{
		To:   to,
		From: from,
		Text: "음성 메시지 테스트입니다, 실제 수신자에게 들리는 내용입니다.",
		Type: "VOICE",
		VoiceOptions: &messages.VoiceOptions{
			VoiceType: "FEMALE", // 또는 "MALE"
		},
	}
}

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	to := "수신번호 입력"
	from := "계정에 등록한 발신번호 입력"
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	msg := buildVoiceMessage(to, from)

	// === 음성 옵션 설정 예제 ===
	// msg.VoiceOptions = &messages.VoiceOptions{
	// 	VoiceType:       "FEMALE",        // 음성 타입 (MALE/FEMALE)
	// 	HeaderMessage:   "머릿말 메시지",  // 통화 시작 시 나오는 메시지 (최대 135자)
	// 	TailMessage:     "꼬릿말 메시지",  // 통화 종료 시 나오는 메시지 (최대 135자)
	// 	ReplyRange:      1,              // 수신자가 누를 수 있는 다이얼 범위 (1-9)
	// 	CounselorNumber: "상담번호",      // 0번을 누르면 연결되는 번호, 01000000000 형식 입력
	// }

	// 개별 옵션 설정 예제
	// msg.VoiceOptions.HeaderMessage = "보이스 메시지 테스트" // 메시지 시작에 나오는 머릿말, 최대 135자
	// msg.VoiceOptions.TailMessage = "보이스 메시지 테스트"   // 통화 종료 시 나오는 꼬릿말, 최대 135자
	// msg.VoiceOptions.ReplyRange = 1                    // 수신자가 누를 수 있는 다이얼 범위(1~9), counselorNumber와 함께 사용 불가
	// msg.VoiceOptions.CounselorNumber = "상담번호"        // 수신자가 0번을 누르면 연결되는 번호, replyRange와 함께 사용 불가

	res, err := c.Messages.Send(context.Background(), msg)
	if err != nil {
		fmt.Println("send error:", err)
		os.Exit(1)
	}

	b, err := json.MarshalIndent(res, "", "  ")
	if err != nil {
		fmt.Println("marshal error:", err)
		os.Exit(1)
	}

	fmt.Println(string(b))

	// === 옵션 설명 ===
	// - To: 수신번호 (필수, 숫자만 입력)
	// - From: 발신번호 (필수, 등록된 발신번호만 사용 가능)
	// - Text: 음성으로 변환될 텍스트 내용 (필수)
	// - Type: 메시지 타입, "VOICE"로 설정 (필수)
	// - VoiceOptions.VoiceType: 음성 타입 ("MALE" 또는 "FEMALE")
	// - VoiceOptions.HeaderMessage: 통화 시작 시 나오는 메시지 (최대 135자)
	// - VoiceOptions.TailMessage: 통화 종료 시 나오는 메시지 (최대 135자)
	// - VoiceOptions.ReplyRange: 수신자가 누를 수 있는 다이얼 범위 (1-9, CounselorNumber와 함께 사용 불가)
	// - VoiceOptions.CounselorNumber: 0번을 누르면 연결되는 번호 (ReplyRange와 함께 사용 불가)

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. ReplyRange와 CounselorNumber는 함께 사용할 수 없습니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-message-list-v2",
      title: "Go 메시지 목록 조회 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 발송된 메시지 목록을 조회하는 예제입니다.",
      category: "상태조회",
      usage: "client.Messages.List()를 사용하여 메시지 목록을 조회합니다.",
      keywords: [
        "go",
        "golang",
        "메시지목록",
        "조회",
        "list",
        "v2",
        "sdk",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/messages"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")

	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 기본 메시지 목록 조회 ===
	// 가장 최근 데이터부터 10건 조회
	resp, err := c.Messages.List(
		context.Background(),
		messages.ListQuery{Limit: 10},
	)
	if err != nil {
		fmt.Println("list error:", err)
		os.Exit(1)
	}

	fmt.Printf("limit=%d startKey=%s nextKey=%s\n", resp.Limit, resp.StartKey, resp.NextKey)
	for id, m := range resp.MessageList {
		fmt.Printf("%s to=%s from=%s type=%s status=%s\n", id, m.To, m.From, m.Type, m.Status)
	}

	// === 고급 조회 옵션들 ===
	
	// 특정 메시지 ID로 조회
	// query := messages.ListQuery{
	// 	MessageID: "메시지ID",
	// 	Limit:     10,
	// }

	// 그룹 ID로 조회
	// query := messages.ListQuery{
	// 	GroupID: "그룹ID",
	// 	Limit:   10,
	// }

	// 수신번호로 조회
	// query := messages.ListQuery{
	// 	To:    "01012345678",
	// 	Limit: 10,
	// }

	// 발신번호로 조회
	// query := messages.ListQuery{
	// 	From:  "01012345678",
	// 	Limit: 10,
	// }

	// 메시지 타입으로 조회
	// query := messages.ListQuery{
	// 	TypeIn: []string{"SMS", "LMS", "MMS"},
	// 	Limit:  10,
	// }

	// 날짜 범위로 조회
	// query := messages.ListQuery{
	// 	DateType:  "CREATED", // CREATED, UPDATED, SENT
	// 	StartDate: "2023-01-01 00:00:00",
	// 	EndDate:   "2023-01-31 23:59:59",
	// 	Limit:     10,
	// }

	// 페이지네이션
	// query := messages.ListQuery{
	// 	StartKey: "이전 조회의 NextKey 값",
	// 	Limit:    10,
	// }

	// resp, err := c.Messages.List(context.Background(), query)

	// === 조회 결과 처리 예제 ===
	// fmt.Printf("총 건수: %d\n", len(resp.MessageList))
	// fmt.Printf("다음 페이지 키: %s\n", resp.NextKey)

	// for id, message := range resp.MessageList {
	// 	fmt.Printf("ID: %s\n", id)
	// 	fmt.Printf("수신번호: %s\n", message.To)
	// 	fmt.Printf("발신번호: %s\n", message.From)
	// 	fmt.Printf("메시지 타입: %s\n", message.Type)
	// 	fmt.Printf("상태: %s\n", message.Status)
	// 	fmt.Printf("발송 시간: %s\n", message.DateSent)
	// 	fmt.Printf("생성 시간: %s\n", message.DateCreated)
	// }

	// === 옵션 설명 ===
	// - MessageID: 특정 메시지 ID로 조회
	// - GroupID: 그룹 ID로 조회
	// - To: 수신번호로 조회
	// - From: 발신번호로 조회
	// - TypeIn: 메시지 타입 배열 (SMS, LMS, MMS, ATA, CTA 등)
	// - DateType: 날짜 필터 타입 (CREATED, UPDATED, SENT)
	// - StartDate/EndDate: 날짜 범위 (YYYY-MM-DD HH:mm:ss 형식)
	// - StartKey: 페이지네이션 시작 키
	// - Limit: 조회 건수 (기본값: 20, 최대값: 500)

	// === 응답 필드 ===
	// - MessageList: 메시지 맵 (키: 메시지ID, 값: 메시지 객체)
	// - Limit: 요청한 건수
	// - StartKey: 현재 페이지의 시작 키
	// - NextKey: 다음 페이지의 시작 키

	// === 주의사항 ===
	// 1. 한 번에 최대 500건까지 조회할 수 있습니다.(기본 값: 20건)
	// 2. 페이지네이션이 필요한 경우 NextKey를 사용하여 다음 페이지를 조회하세요.
	// 3. 날짜 범위 조회 시 DateType을 반드시 지정해야 합니다.
	// 4. 메시지 타입은 대문자로 입력해야 합니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-group-create-v2",
      title: "Go 그룹 생성 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 새로운 메시지 그룹을 생성하는 예제입니다.",
      category: "대량발송",
      usage: "client.Groups.Create()를 사용하여 새로운 그룹을 생성합니다.",
      keywords: [
        "go",
        "golang",
        "group",
        "create",
        "생성",
        "v2",
        "sdk",
        "대량발송",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/groups"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	appId := os.Getenv("APP_ID")
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 그룹 생성 옵션 설정 ===
	opts := groups.CreateGroupOptions{
		AllowDuplicates: true, // 중복 수신번호 허용 여부
		AppId:           appId, // 애플리케이션 ID (선택)
		// Strict: false,      // 엄격 모드 (기본값: false)
	}

	// === 그룹 생성 실행 ===
	res, err := c.Groups.Create(context.Background(), opts)
	if err != nil {
		fmt.Println("create group error:", err)
		os.Exit(1)
	}

	fmt.Printf("created groupId=%s\n", res.GroupID)

	// === 그룹 생성 옵션 설명 ===
	// - AllowDuplicates: 동일한 수신번호로 여러 메시지를 보낼 수 있는지 여부
	//   - true: 중복 허용
	//   - false: 중복 불허 (기본값)
	// - AppId: 애플리케이션 식별자 (선택)
	// - Strict: 엄격 모드
	//   - true: 유효하지 않은 메시지는 등록되지 않음
	//   - false: 유효하지 않은 메시지도 등록 (기본값)

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 앱 ID 설정 (선택): 애플리케이션 ID가 있는 경우 설정하세요.
	//    export APP_ID="your_app_id"

	// === 그룹 사용 방법 ===
	// 생성된 그룹에 메시지를 추가하려면:
	// export GROUP_ID="생성된_그룹_ID"
	// # add_group_messages 예제 실행
	//
	// 그룹의 모든 메시지를 발송하려면:
	// export GROUP_ID="생성된_그룹_ID"
	// # send_group_all_in_one 예제 실행

	// === 주의사항 ===
	// 1. 생성된 그룹은 메시지가 발송되기 전까지 24시간 동안 유지됩니다.
	// 2. 그룹에 메시지를 추가하지 않고 발송을 시도하면 에러가 발생합니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-group-list-v2",
      title: "Go 그룹 목록 조회 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 생성된 메시지 그룹 목록을 조회하는 예제입니다.",
      category: "상태조회",
      usage: "client.Groups.ListGroups()를 사용하여 그룹 목록을 조회합니다.",
      keywords: [
        "go",
        "golang",
        "group",
        "list",
        "목록",
        "조회",
        "v2",
        "sdk",
        "상태조회",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/groups"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	if apiKey == "" || apiSecret == "" {
		fmt.Println("환경변수(API_KEY, API_SECRET)가 필요합니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 기본 그룹 목록 조회 ===
	// 가장 최근 그룹부터 10건 조회
	resp, err := c.Groups.ListGroups(context.Background(), groups.ListGroupsQuery{Limit: 10})
	if err != nil {
		fmt.Println("list groups error:", err)
		os.Exit(1)
	}

	startKey := "null"
	if resp.StartKey != nil {
		startKey = *resp.StartKey
	}
	fmt.Printf("limit=%d startKey=%s nextKey=%s\n", resp.Limit, startKey, resp.NextKey)

	for id, g := range resp.GroupList {
		b, err := json.MarshalIndent(g, "", "  ")
		if err != nil {
			fmt.Printf("groupId=%s marshal error: %v\n", id, err)
			continue
		}
		fmt.Printf("groupId=%s\n%s\n", id, string(b))
	}

	// === 고급 조회 옵션들 ===
	
	// 페이지네이션
	// query := groups.ListGroupsQuery{
	// 	StartKey: "이전 조회의 NextKey 값",
	// 	Limit:    10,
	// }

	// 날짜 범위로 조회
	// query := groups.ListGroupsQuery{
	// 	StartDate: "2023-01-01 00:00:00",
	// 	EndDate:   "2023-01-31 23:59:59",
	// 	Limit:     10,
	// }

	// === 조회 결과 처리 예제 ===
	// fmt.Printf("조회 건수: %d\n", resp.Limit)
	// fmt.Printf("시작 키: %s\n", resp.StartKey)
	// fmt.Printf("다음 키: %s\n", resp.NextKey)
	// fmt.Printf("총 그룹 수: %d\n", len(resp.GroupList))

	// for groupId, group := range resp.GroupList {
	// 	fmt.Printf("그룹 ID: %s\n", groupId)
	// 	fmt.Printf("그룹 상태: %s\n", group.Status)
	// 	fmt.Printf("총 메시지 수: %d\n", group.Count.Total)
	// 	fmt.Printf("발송 성공 수: %d\n", group.Count.SentSuccess)
	// 	fmt.Printf("발송 실패 수: %d\n", group.Count.SentFailed)
	// 	fmt.Printf("생성 시간: %s\n", group.DateCreated)
	// 	fmt.Printf("발송 시간: %s\n", group.DateSent)
	// }

	// === 옵션 설명 ===
	// - StartKey: 페이지네이션 시작 키
	// - Limit: 조회 건수 (기본값: 20, 최대값: 100)
	// - StartDate: 시작 날짜 (UTC 형식)
	// - EndDate: 종료 날짜 (UTC 형식)
	// - Status: 그룹 상태 필터

	// === 그룹 상태 값 ===
	// - PENDING: 대기 중 (메시지 등록됨, 발송 전)
	// - SENDING: 발송 중
	// - COMPLETE: 발송 완료
	// - FAILED: 발송 실패

	// === 그룹 정보 필드 ===
	// - Count.Total: 총 메시지 수
	// - Count.SentTotal: 발송된 메시지 수
	// - Count.SentSuccess: 발송 성공 수
	// - Count.SentFailed: 발송 실패 수
	// - Count.SentPending: 발송 대기 수
	// - DateCreated: 그룹 생성 시간
	// - DateSent: 그룹 발송 시간
	// - DateCompleted: 그룹 완료 시간

	// === 응답 필드 ===
	// - GroupList: 그룹 맵 (키: 그룹ID, 값: 그룹 정보 객체)
	// - Limit: 요청한 건수
	// - StartKey: 현재 페이지의 시작 키
	// - NextKey: 다음 페이지의 시작 키

	// === 주의사항 ===
	// 1. 한 번에 최대 500건까지 조회할 수 있습니다.
	// 2. 페이지네이션이 필요한 경우 NextKey를 사용하여 다음 페이지를 조회하세요.
	// 3. 날짜 필터를 사용할 때는 StartDate와 EndDate를 함께 지정해야 합니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-group-add-messages-v2",
      title: "Go 그룹에 메시지 추가 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 기존 그룹에 메시지를 추가하는 예제입니다.",
      category: "대량발송",
      usage:
        "client.Groups.AddMessages()를 사용하여 그룹에 메시지를 추가합니다.",
      keywords: [
        "go",
        "golang",
        "group",
        "add",
        "messages",
        "메시지추가",
        "v2",
        "sdk",
        "대량발송",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/groups"
	"github.com/solapi/solapi-go/v2/messages"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	groupId := os.Getenv("GROUP_ID")
	if apiKey == "" || apiSecret == "" || groupId == "" {
		fmt.Println("환경변수(API_KEY, API_SECRET, GROUP_ID)가 필요합니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 그룹 메시지 추가 요청 ===
	req := groups.AddGroupMessagesRequest{
		Messages: []messages.Message{
			{
				To:   "수신번호",
				From: "발신번호",
				Text: "그룹에 추가되는 첫 번째 메시지",
			},
			{
				To:   "수신번호",
				From: "발신번호",
				Text: "그룹에 추가되는 두 번째 메시지",
			},
		},
	}

	// === 메시지 추가 실행 ===
	res, err := c.Groups.AddMessages(context.Background(), groupId, req)
	if err != nil {
		fmt.Println("add messages error:", err)
		os.Exit(1)
	}

	fmt.Printf("groupId=%s total=%d registeredFailed=%d\n", groupId, res.GroupInfo.Count.Total, res.GroupInfo.Count.RegisteredFailed)

	// === 메시지 옵션들 ===
	// message := messages.Message{
	// 	To:   "수신번호",
	// 	From: "발신번호",
	// 	Text: "메시지 내용",
	//
	// 	// 선택적 옵션들
	// 	Type:    "SMS",           // 메시지 타입 (SMS, LMS, MMS 등)
	// 	Subject: "제목",          // LMS/MMS 제목
	// 	ImageID: "이미지ID",      // MMS용 이미지 ID
	//
	// 	// 카카오톡 옵션
	// 	KakaoOptions: &messages.KakaoOptions{
	// 		PfID:       "비즈니스 채널 ID",
	// 		TemplateID: "템플릿 ID",
	// 		Variables: map[string]string{
	// 			"#{이름}": "홍길동",
	// 		},
	// 	},
	// }

	// === 결과 확인 예제 ===
	// fmt.Printf("그룹 ID: %s\n", groupId)
	// fmt.Printf("총 메시지 수: %d\n", res.GroupInfo.Count.Total)
	// fmt.Printf("등록 실패 수: %d\n", res.GroupInfo.Count.RegisteredFailed)
	// fmt.Printf("등록 성공 수: %d\n", res.GroupInfo.Count.RegisteredSuccess)

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 그룹 생성: 메시지를 추가할 그룹이 있어야 합니다. (create_group 예제 참조)
	// 3. 그룹 ID 설정: 생성된 그룹의 ID를 환경변수로 설정하세요.
	//    export GROUP_ID="your_group_id"

	// === 주의사항 ===
	// 1. 그룹이 존재하지 않으면 에러가 발생합니다.
	// 2. 그룹에 추가된 메시지는 즉시 발송되지 않습니다. 그룹 발송을 별도로 실행해야 합니다.
	// 3. 한 번에 최대 10,000건까지 메시지를 추가할 수 있습니다.
	// 4. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 5. 메시지 타입에 따라 필수 파라미터가 다를 수 있습니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-group-list-messages-v2",
      title: "Go 그룹 메시지 목록 조회 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 특정 그룹에 포함된 메시지 목록을 조회하는 예제입니다.",
      category: "상태조회",
      usage:
        "client.Groups.ListMessages()를 사용하여 그룹의 메시지 목록을 조회합니다.",
      keywords: [
        "go",
        "golang",
        "group",
        "messages",
        "list",
        "목록",
        "조회",
        "v2",
        "sdk",
        "상태조회",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/groups"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	groupId := os.Getenv("GROUP_ID")
	if apiKey == "" || apiSecret == "" || groupId == "" {
		fmt.Println("환경변수(API_KEY, API_SECRET, GROUP_ID)가 필요합니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 그룹 메시지 목록 조회 ===
	resp, err := c.Groups.ListMessages(context.Background(), groupId, groups.ListMessagesQuery{Limit: 10})
	if err != nil {
		fmt.Println("list group messages error:", err)
		os.Exit(1)
	}

	fmt.Printf("limit=%d startKey=%s nextKey=%s\n", resp.Limit, resp.StartKey, resp.NextKey)
	for id, m := range resp.MessageList {
		fmt.Printf("%s to=%s from=%s type=%s status=%s text=%s\n", id, m.To, m.From, m.Type, m.Status, m.Text)
	}

	// === 고급 조회 옵션들 ===
	
	// 페이지네이션
	// query := groups.ListMessagesQuery{
	// 	StartKey: "이전 조회의 NextKey 값",
	// 	Limit:    10,
	// }

	// 날짜 범위로 필터링
	// query := groups.ListMessagesQuery{
	// 	StartDate: "2023-01-01 00:00:00",
	// 	EndDate:   "2023-01-31 23:59:59",
	// 	Limit:     10,
	// }

	// === 조회 결과 처리 예제 ===
	// fmt.Printf("조회 건수: %d\n", resp.Limit)
	// fmt.Printf("시작 키: %s\n", resp.StartKey)
	// fmt.Printf("다음 키: %s\n", resp.NextKey)
	// fmt.Printf("총 메시지 수: %d\n", len(resp.MessageList))

	// for messageId, message := range resp.MessageList {
	// 	fmt.Printf("메시지 ID: %s\n", messageId)
	// 	fmt.Printf("수신번호: %s\n", message.To)
	// 	fmt.Printf("발신번호: %s\n", message.From)
	// 	fmt.Printf("메시지 타입: %s\n", message.Type)
	// 	fmt.Printf("상태: %s\n", message.Status)
	// 	fmt.Printf("메시지 내용: %s\n", message.Text)
	// 	fmt.Printf("생성 시간: %s\n", message.DateCreated)
	// 	fmt.Printf("발송 시간: %s\n", message.DateSent)
	// }

	// === 옵션 설명 ===
	// - StartKey: 페이지네이션 시작 키
	// - Limit: 조회 건수 (기본값: 20, 최대값: 500)
	// - StartDate: 시작 날짜 (YYYY-MM-DD HH:mm:ss 형식)
	// - EndDate: 종료 날짜 (YYYY-MM-DD HH:mm:ss 형식)

	// === 응답 필드 ===
	// - MessageList: 메시지 맵 (키: 메시지ID, 값: 메시지 객체)
	// - Limit: 요청한 건수
	// - StartKey: 현재 페이지의 시작 키
	// - NextKey: 다음 페이지의 시작 키 (없으면 빈 문자열)

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 그룹 ID 설정: 조회할 그룹의 ID를 환경변수로 설정하세요.
	//    export GROUP_ID="your_group_id"

	// === 주의사항 ===
	// 1. 한 번에 최대 500건까지 조회할 수 있습니다.
	// 2. 페이지네이션이 필요한 경우 NextKey를 사용하여 다음 페이지를 조회하세요.
	// 3. 날짜 필터를 사용할 때는 StartDate와 EndDate를 함께 지정해야 합니다.
	// 4. 메시지 상태에 따라 조회 결과가 다를 수 있습니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-group-send-all-in-one-v2",
      title: "Go 그룹 전체 워크플로우 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 그룹 생성부터 메시지 추가, 발송, 결과 조회까지의 전체 과정을 하나의 예제로 통합한 예제입니다.",
      category: "대량발송",
      usage:
        "그룹 생성 → 메시지 추가 → 발송 → 결과 조회의 전체 워크플로우를 실행합니다.",
      keywords: [
        "go",
        "golang",
        "group",
        "workflow",
        "워크플로우",
        "전체",
        "v2",
        "sdk",
        "대량발송",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/groups"
	"github.com/solapi/solapi-go/v2/messages"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	if apiKey == "" || apiSecret == "" {
		fmt.Println("환경변수(API_KEY, API_SECRET)가 필요합니다.")
		os.Exit(1)
	}

	c := client.NewClient(apiKey, apiSecret)

	// === 1단계: 그룹 생성 ===
	// 항상 새 그룹 생성 (사전 조회 없음)
	created, err := c.Groups.Create(context.Background(), groups.CreateGroupOptions{AllowDuplicates: true})
	if err != nil {
		fmt.Println("create group error:", err)
		os.Exit(1)
	}
	groupId := created.GroupID
	fmt.Printf("created groupId=%s\n", groupId)

	// === 2단계: 메시지 추가 ===
	// 전송 전에 그룹에 메시지 추가 (예제 통합)
	// 반드시 발신번호/수신번호는 01000000000 형식으로 입력해야 합니다.
	req := groups.AddGroupMessagesRequest{
		Messages: []messages.Message{
			{To: "수신번호", From: "계정에 등록한 발신번호", Text: "그룹에 추가되는 첫 번째 메시지"},
			{To: "수신번호", From: "계정에 등록한 발신번호", Text: "그룹에 추가되는 두 번째 메시지"},
		},
	}
	addRes, err := c.Groups.AddMessages(context.Background(), groupId, req)
	if err != nil {
		fmt.Println("add messages error:", err)
		os.Exit(1)
	}
	fmt.Printf("groupId=%s total=%d registeredFailed=%d\n", groupId, addRes.GroupInfo.Count.Total, addRes.GroupInfo.Count.RegisteredFailed)

	// === 3단계: 그룹 발송 ===
	res, err := c.Groups.Send(context.Background(), groupId)
	if err != nil {
		fmt.Println("send group error:", err)
		os.Exit(1)
	}

	fmt.Printf("groupId=%s total=%d status=%s scheduled=%s\n", res.GroupID, res.GroupInfo.Count.Total, res.Status, res.ScheduledDate)
	// 실패 목록이 있다면 몇 건인지 출력
	if len(res.FailedMessageList) > 0 {
		fmt.Printf("failed=%d firstStatus=%s\n", len(res.FailedMessageList), res.FailedMessageList[0].StatusMessage)
	}

	// === 4단계: 메시지 목록 조회 ===
	// 발송 후 그룹 메시지 목록 조회 (list_group_messages 예제 통합)
	listRes, err := c.Groups.ListMessages(context.Background(), groupId, groups.ListMessagesQuery{Limit: 10})
	if err != nil {
		fmt.Println("list group messages error:", err)
		os.Exit(1)
	}
	fmt.Printf("limit=%d startKey=%s nextKey=%s\n", listRes.Limit, listRes.StartKey, listRes.NextKey)
	for id, m := range listRes.MessageList {
		b, err := json.MarshalIndent(m, "", "  ")
		if err != nil {
			fmt.Printf("messageId=%s marshal error: %v\n", id, err)
			continue
		}
		fmt.Printf("messageId=%s\n%s\n", id, string(b))
	}

	// === 그룹 발송 옵션 예제 ===
	// 예약 발송
	// res, err := c.Groups.Send(context.Background(), groupId, groups.SendOptions{
	// 	ScheduledDate: "2023-12-31T23:59:59Z",
	// })

	// === 워크플로우 단계 설명 ===
	// 1. 그룹 생성: 새로운 메시지 그룹을 생성합니다.
	//    - 중복 수신번호 허용 옵션을 설정할 수 있습니다.
	// 2. 메시지 추가: 생성된 그룹에 메시지를 추가합니다.
	//    - 여러 개의 메시지를 한 번에 추가할 수 있습니다.
	//    - 각 메시지는 개별적으로 설정할 수 있습니다.
	// 3. 그룹 발송: 그룹의 모든 메시지를 발송합니다.
	//    - 즉시 발송되거나 예약 발송될 수 있습니다.
	// 4. 결과 조회: 발송 결과를 확인합니다.
	//    - 성공/실패 건수를 확인할 수 있습니다.
	//    - 실패한 메시지의 상세 정보를 확인할 수 있습니다.
	// 5. 메시지 목록 조회: 그룹에 포함된 모든 메시지의 상태를 확인합니다.
	//    - 각 메시지의 발송 결과를 개별적으로 확인할 수 있습니다.

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 발신번호 등록: SOLAPI 콘솔에서 발신번호를 등록하세요.

	// === 주의사항 ===
	// 1. 발신번호와 수신번호는 반드시 -, * 등 특수문자를 제거한 형식으로 입력하세요.
	//    - 예: 01012345678 (올바름)
	//    - 예: 010-1234-5678 (잘못됨)
	// 2. 그룹 생성 후 24시간 이내에 발송하지 않으면 그룹이 만료될 수 있습니다.
	// 3. 한 그룹에 최대 10,000건까지 메시지를 추가할 수 있습니다.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
    {
      id: "go-storage-upload-mms-v2",
      title: "Go MMS 파일 업로드 (V2 SDK)",
      description:
        "SOLAPI Go SDK V2를 사용하여 MMS 메시지에 사용할 이미지 파일을 스토리지에 업로드하는 예제입니다.",
      category: "파일업로드",
      usage:
        "client.Storages.Upload()를 사용하여 파일을 업로드하고 FileID를 받습니다.",
      keywords: [
        "go",
        "golang",
        "storage",
        "upload",
        "mms",
        "파일업로드",
        "이미지",
        "v2",
        "sdk",
        "solapi-go",
      ],
      code: `package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"

	"github.com/solapi/solapi-go/v2/client"
	"github.com/solapi/solapi-go/v2/storages"
)

// 파일을 읽고 Base64로 인코딩하는 함수
func mustReadAndEncode(path string) string {
	b, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("failed to read file:", err)
		os.Exit(1)
	}
	return base64.StdEncoding.EncodeToString(b)
}

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	if apiKey == "" || apiSecret == "" {
		fmt.Println("API KEY 또는 API SECRET이 설정되지 않았습니다.")
		os.Exit(1)
	}

	// === 예제 파일 경로 설정 ===
	exampleDir, _ := os.Getwd()
	filePath := filepath.Join(exampleDir, "test.jpg")

	encoded := mustReadAndEncode(filePath)
	c := client.NewClient(apiKey, apiSecret)

	// === 파일 업로드 요청 ===
	req := storages.UploadFileRequest{
		File: encoded,     // Base64로 인코딩된 파일 데이터
		Name: "test.jpg",  // 파일명
		Type: "MMS",       // 업로드 타입
		// Link: "https://...", // 외부 URL에서 파일 다운로드 (선택)
	}

	// === 파일 업로드 실행 ===
	resp, err := c.Storages.Upload(context.Background(), req)
	if err != nil {
		fmt.Println("upload error:", err)
		os.Exit(1)
	}

	fmt.Printf("uploaded fileId=%s name=%s type=%s url=%s\n", resp.FileID, resp.Name, resp.Type, resp.URL)

	// === MMS 메시지에서 사용 예제 ===
	// msg := messages.Message{
	// 	To:      "수신번호",
	// 	From:    "발신번호",
	// 	Type:    "MMS",
	// 	Subject: "MMS 제목",
	// 	Text:    "MMS 메시지 내용",
	// 	ImageID: resp.FileID, // 업로드된 파일 ID
	// }
	// 
	// res, err := c.Messages.Send(context.Background(), msg)

	// === 지원 파일 형식 ===
	// - 이미지: JPG, JPEG, PNG, GIF
	// - 문서: PDF (특정 경우에 한함)
	// - 최대 크기: 300KB
	// - 권장 해상도: 640x480 이하

	// === 업로드 타입 ===
	// - MMS: MMS 메시지용 파일
	// - RCS: RCS 메시지용 파일
	// - FAX: 팩스용 파일

	// === 파일 업로드 옵션 예제 ===
	// req := storages.UploadFileRequest{
	// 	File: encoded,
	// 	Name: "custom_name.jpg",  // 사용자 정의 파일명
	// 	Type: "MMS",
	// 	// Link: "https://example.com/image.jpg", // 외부 URL에서 파일 다운로드 (선택)
	// }

	// === 사전 준비 ===
	// 1. API 키 설정: 환경변수에 SOLAPI API 키를 설정하세요.
	//    export API_KEY="your_api_key"
	//    export API_SECRET="your_api_secret"
	// 2. 이미지 파일 준비: test.jpg 파일을 예제 디렉터리에 준비하세요.

	// === 실행 방법 ===
	// # 기본 파일로 실행
	// go run main.go
	// 
	// # 다른 파일로 실행
	// # 파일을 test.jpg로 복사하거나 코드에서 경로를 수정하세요

	// === 주의사항 ===
	// 1. 파일은 반드시 Base64로 인코딩하여 전송해야 합니다.
	// 2. 업로드된 파일은 MMS 메시지에서만 사용할 수 있습니다.
	// 3. 파일 업로드 후 반환된 FileID를 MMS 메시지의 ImageID 필드에 설정해야 합니다.
	// 4. 업로드된 파일은 SOLAPI 스토리지에 저장되며, 별도의 비용이 발생할 수 있습니다.
	// 5. 파일 크기가 300KB를 초과하면 업로드가 실패할 수 있습니다.
	// 6. 동일한 파일을 여러 번 업로드하면 각각 다른 FileID가 생성됩니다.
	// 7. 업로드된 파일은 영구적으로 저장되지 않을 수 있으니, 사용 후 FileID를 기록해두세요.
}
`,
      url: "https://github.com/solapi/solapi-go",
    },
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
    return this.examples.filter(
      (example) => example.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * ID로 특정 예제 검색
   */
  static getExampleById(id: string): Example | null {
    return this.examples.find((example) => example.id === id) || null;
  }

  /**
   * 키워드로 예제 검색
   */
  static searchExamples(query: string): Example[] {
    const searchTerm = query.toLowerCase();

    return this.examples.filter(
      (example) =>
        example.title.toLowerCase().includes(searchTerm) ||
        example.description.toLowerCase().includes(searchTerm) ||
        example.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm)
        ) ||
        example.code.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * 사용 가능한 카테고리 목록 반환
   */
  static getCategories(): string[] {
    const categories = this.examples.map((example) => example.category);
    return [...new Set(categories)];
  }
}
