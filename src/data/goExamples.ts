import type { Example } from '../types';

/**
 * @file Go SDK 예제 라이브러리
 * @description SOLAPI Go SDK 사용 예제 모음
 */
export class GoExamplesLibrary {
  private static examples: Example[] = [
    {
      id: 'go-balance-check',
      title: 'Go 잔액 조회',
      description: 'SOLAPI Go SDK를 사용하여 계정 잔액을 조회하는 예제입니다.',
      category: '계정관리',
      usage: 'github.com/solapi/solapi-go 모듈을 설치하고 client.Cash.Balance()를 호출합니다.',
      keywords: ['go', 'golang', 'balance', '잔액', '조회', 'Cash', 'solapi-go', '계정'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// SetCustomConfig
	/*
		client.Cash.Config = map[string]string{
			"APIKey": "Another API KEY",
		}
	*/

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Cash.Balance()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-create',
      title: 'Go 메시지 그룹 생성',
      description: '메시지 그룹을 생성하는 Go 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.CreateGroup(params)로 그룹을 생성합니다.',
      keywords: ['go', 'golang', 'group', 'create', '메시지그룹', '생성', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	//  파라미터들
	params := make(map[string]string)

	// SetCustomConfig
	/*
		client.Messages.Config = map[string]string{
			"APIKey": "Another API KEY",
		}
	*/

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.CreateGroup(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-get',
      title: 'Go 메시지 그룹 조회',
      description: '특정 메시지 그룹의 상세 정보를 조회하는 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.GetGroup(groupId)로 조회합니다.',
      keywords: ['go', 'golang', 'group', 'get', '조회', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 조회를 원하는 그룹아이디
	groupId := "G4V20200826105257ADZ4FNAUGO9NL1D"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.GetGroup(groupId)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-list',
      title: 'Go 메시지 그룹 목록 조회',
      description: '메시지 그룹 목록을 조회하는 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.GetGroupList(params)로 목록을 조회합니다.',
      keywords: ['go', 'golang', 'group', 'list', '목록', '조회', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 검색조건값
	params := make(map[string]string)
	params["limit"] = "1"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.GetGroupList(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-message-list',
      title: 'Go 그룹 메시지 목록 조회',
      description: '특정 그룹에 포함된 메시지 목록을 조회하는 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.GetGroupMessageList(groupId, params)로 조회합니다.',
      keywords: ['go', 'golang', 'group', 'message', 'list', '메시지', '조회', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 검색을 원하는 그룹아이디
	groupId := "G4V20200819094043TGFVDDSDZXJ7O7H"

	// 검색조건값
	params := make(map[string]string)
	params["limit"] = "1"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.GetGroupMessageList(groupId, params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-add-message',
      title: 'Go 그룹에 메시지 추가',
      description: '기존 그룹에 발송할 메시지를 추가하는 예제입니다.',
      category: '대량발송',
      usage: 'client.Messages.AddGroupMessage(groupId, params)로 메시지를 추가합니다.',
      keywords: ['go', 'golang', 'group', 'add', 'message', '대량발송', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 메시지를 추가할 그룹 아이디
	groupId := "G4V20200824233846LAI57B7SKJACJ40"

	// 추가할 메시지 데이터
	message := make(map[string]interface{})
	message["to"] = "01000000000"
	message["from"] = "029302266"
	message["text"] = "안녕하세요 홍길동님 회원가입을 환영합니다."
	message["type"] = "SMS"

	// 포토문자(MMS)
	// Storage 예제에서 이미지 파일 업로드 방법을 확인하실 수 있습니다.
	// message["type"] = "MMS"
	// message["imageId"] = "ST01FJ20073019363R8G58YLK1kvUXEH"
	// message["subject"] = "Subject Title"

	// 장문문자(LMS)
	// message["type"] = "LMS"
	// message["subject"] = "Subject Title"

	// 친구톡(CTA)
	// 사이트에서 플러스친구 연동 후 사용이 가능합니다.
	// message["type"] = "CTA"
	// kakaoOptions := make(map[string]interface{})
	// kakaoOptions["pfId"] = "KA01PF2003231823W4979UIEbV3fHtkY"
	// message["kakaoOptions"] = kakaoOptions

	// 알림톡(CTA)
	// 사이트에서 플러스친구 연동 및 템플릿 등록 후 사용이 가능합니다.
	// message["type"] = "ATA"
	// kakaoOptions := make(map[string]interface{})
	// kakaoOptions["pfId"] = "KA01PF2003231823W4979UIEbV3fHtkY"
	// kakaoOptions["templateId"] = "KA01TP2003W3882345595hMWrRtFCSTq"
	// message["kakaoOptions"] = kakaoOptions

	// 메시지 데이터를 목록화 하여 파라미터로 넘겨줍니다.
	var messageList []interface{}
	messageList = append(messageList, message)

	fmt.Println(messageList)

	params := make(map[string]interface{})
	params["messages"] = messageList

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.AddGroupMessage(groupId, params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-send',
      title: 'Go 그룹 발송 요청',
      description: '그룹에 추가된 메시지들을 일괄 발송 요청하는 예제입니다.',
      category: '대량발송',
      usage: 'client.Messages.SendGroup(groupId)로 그룹 발송을 요청합니다.',
      keywords: ['go', 'golang', 'group', 'send', '대량발송', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 발송요청을 할 그룹 아이디
	groupId := "G4V20200824233846LAI57B7SKJACJ40"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.SendGroup(groupId)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-group-delete',
      title: 'Go 메시지 그룹 삭제',
      description: '특정 메시지 그룹을 삭제하는 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.DeleteGroup(groupId)로 그룹을 삭제합니다.',
      keywords: ['go', 'golang', 'group', 'delete', '삭제', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 삭제할 그룹 아이디
	groupId := "G4V20200825011330MWECXBWMBIABRKL"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.DeleteGroup(groupId)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-message-send-simple',
      title: 'Go 단일 메시지 발송',
      description: '단일 메시지를 발송하는 기본 Go 예제입니다.',
      category: 'SMS',
      usage: 'client.Messages.SendSimpleMessage(params)로 단일 메시지를 발송합니다.',
      keywords: ['go', 'golang', 'message', 'send', 'sms', '단문', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 메시지 데이터
	message := make(map[string]interface{})
	message["to"] = "01000000000"
	message["from"] = "029302266"
	message["text"] = "안녕하세요 홍길동님 회원가입을 환영합니다."
	message["type"] = "SMS"

	// 포토문자(MMS)
	// Storage 예제에서 이미지 파일 업로드 방법을 확인하실 수 있습니다.
	// message["type"] = "MMS"
	// message["imageId"] = "ST01FJ20073019363R8G58YLK1kvUXEH"
	// message["subject"] = "Subject Title"

	// 장문문자(LMS)
	// message["type"] = "LMS"
	// message["subject"] = "Subject Title"

	// 친구톡(CTA)
	// 사이트에서 플러스친구 연동 후 사용이 가능합니다.
	// message["type"] = "CTA"
	// kakaoOptions := make(map[string]interface{})
	// kakaoOptions["pfId"] = "KA01PF2003231823W4979UIEbV3fHtkY"
	// message["kakaoOptions"] = kakaoOptions

	// 알림톡(CTA)
	// 사이트에서 플러스친구 연동 및 템플릿 등록 후 사용이 가능합니다.
	// message["type"] = "ATA"
	// kakaoOptions := make(map[string]interface{})
	// kakaoOptions["pfId"] = "KA01PF2003231823W4979UIEbV3fHtkY"
	// kakaoOptions["templateId"] = "KA01TP2003W3882345595hMWrRtFCSTq"
	// message["kakaoOptions"] = kakaoOptions

	params := make(map[string]interface{})
	params["message"] = message

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.SendSimpleMessage(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-message-get-list',
      title: 'Go 메시지 목록 조회',
      description: '발송된 메시지 목록을 조회하는 Go 예제입니다.',
      category: '상태조회',
      usage: 'client.Messages.GetMessageList(params)로 메시지 목록을 조회합니다.',
      keywords: ['go', 'golang', 'message', 'list', '조회', '상태조회', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// 검색조건값
	params := make(map[string]string)
	params["limit"] = "1"

	// 메시지 아이디로 조회
	// params["criteria"] = "messageId"
	// params["cond"] = "eq"
	// params["value"] = "M4V20200826154526YBEPH9DUHEWWTAZ"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Messages.GetMessageList(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-storage-upload-file',
      title: 'Go 파일 업로드 (Storage)',
      description: 'MMS/카카오/문서 용도의 파일을 업로드하는 Go 예제입니다.',
      category: '파일업로드',
      usage: 'client.Storage.UploadFile(params)로 파일을 업로드합니다.',
      keywords: ['go', 'golang', 'storage', 'upload', '파일업로드', 'mms', 'kakao', 'document', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	/*
		업로드할 데이터
		타입별 제한 사이즈
		[KAKAO] : 500KB
		[MMS] : 200KB
		[DOCUMENT] : 2MB
	*/
	params := make(map[string]string)
	params["file"] = "./test.jpg"
	params["name"] = "customFileName"
	params["type"] = "MMS"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Storage.UploadFile(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
    },
    {
      id: 'go-storage-get-file-list',
      title: 'Go 파일 목록 조회 (Storage)',
      description: '업로드된 파일 목록을 조회하는 Go 예제입니다.',
      category: '파일업로드',
      usage: 'client.Storage.GetFileList(params)로 파일 목록을 조회합니다.',
      keywords: ['go', 'golang', 'storage', 'list', '파일목록', 'mms', 'solapi-go'],
      code: `package main

import (
	"fmt"

	"github.com/solapi/solapi-go"
)

func main() {
	client := solapi.NewClient()

	// SetCustomConfig
	/*
		client.Storage.Config = map[string]string{
			"APIKey": "Another API KEY",
		}
	*/

	// 검색조건값
	params := make(map[string]string)
	params["limit"] = "1"
	params["type"] = "MMS"

	// API 호출 후 결과값을 받아 옵니다.
	result, err := client.Storage.GetFileList(params)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print Result
	fmt.Printf("%+v\n", result)
}
`,
      url: 'https://github.com/solapi/solapi-go'
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
}
