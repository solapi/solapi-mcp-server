# SOLAPI MCP Server

SOLAPI 문서/예제 검색과 **실제 메시지 발송·관리**를 한 번에 제공하는 MCP(Model Context Protocol) 서버입니다. Claude Desktop, Cursor 등에서 사용할 수 있습니다.

내부적으로 [solactl](https://github.com/solapi/solactl) CLI를 호출합니다. solactl 바이너리는 설치 시 자동으로 다운로드됩니다 (실패 시 첫 실행 시 재시도).


## 빠른 시작

### 전역 설치 (권장)

| Package Manager | Command                              |
|---|---|
| **npm** | `npm install -g @solapi/mcp-server`   |
| **yarn** | `yarn global add @solapi/mcp-server`  |
| **pnpm** | `pnpm add -g @solapi/mcp-server`      |
| **bun** | `bun add -g @solapi/mcp-server`       |

설치 후 자동으로 다음 작업이 수행됩니다.
- solactl 바이너리 자동 다운로드 (플랫폼별 prebuilt)
- Claude Desktop / Cursor 설정 파일에 MCP 서버 등록

설치 후 Claude Desktop이나 Cursor를 재시작하면 사용 가능합니다.

### 수동 설정

`~/.cursor/mcp.json` 또는 Claude Desktop의 `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "solapi": {
      "command": "npx",
      "args": ["--latest", "-y", "@solapi/mcp-server"],
      "env": {}
    }
  }
}
```


## 인증 설정

MCP 도구로 직접 SOLAPI 자격 증명을 등록할 수 있습니다.

```
"내 솔라피 키 등록해줘. apiKey는 NCS..., apiSecret은 ..., 프로필 이름은 prod"
```

→ MCP가 `configure_setup` 도구를 호출하여 `~/.solactl/credentials.json`에 저장합니다.

여러 프로필을 두고 발송 시마다 `profile` 인자로 지정할 수 있습니다.

| 도구 | 동작 |
|---|---|
| `configure_setup` | 새 프로필 등록 (또는 기존 프로필 덮어쓰기) |
| `configure_list` | 저장된 프로필 목록 |
| `configure_show` | 프로필 정보 (시크릿은 마스킹) |
| `configure_use` | 활성 프로필 전환 |
| `configure_delete` | 프로필 삭제 |


## 발송 안전 가드

발송 도구는 **기본적으로 비활성화**되어 있습니다. 실수로 메시지가 나가는 것을 막기 위함입니다.

### 활성화 방법

**일시적 활성화 (세션 한정)**

MCP 대화 중에 활성화:
```
"발송 활성화해줘" → MCP가 update_mcp_policy({sendEnabled: true}) 호출
```

MCP 서버 재시작 시 다시 비활성화로 돌아갑니다.

**부팅 시부터 활성화**

`mcp.json`의 env에 추가:
```json
"env": {
  "SOLAPI_MCP_ENABLE_SEND": "true"
}
```

### 환경변수 (Ceiling)

환경변수로 설정한 한계는 MCP 도구로 풀 수 없습니다 (ceiling 역할).

| 환경변수 | 효과 |
|---|---|
| `SOLAPI_MCP_DISABLE_SEND=true` | **Hard lock**. MCP 도구로도 발송 활성화 불가. |
| `SOLAPI_MCP_ENABLE_SEND=true` | 부팅 시 발송 활성화로 시작. |
| `SOLAPI_MCP_MAX_RECIPIENTS=N` | 한 번의 발송 호출에서 허용되는 최대 수신자 수. 기본 10. MCP에서 더 낮출 수는 있지만 더 높일 수 없음. |
| `SOLAPI_MCP_ALLOWED_SENDERS=01012345678,01087654321` | 발신번호 화이트리스트. 비우면 무제한. |
| `SOLAPI_MCP_SOLACTL_BIN=/path/to/solactl` | 자동 다운로드 대신 시스템에 설치된 solactl 사용. |
| `SOLAPI_MCP_AUTO_UPGRADE=true` | MCP 서버 부팅 시 GitHub Releases에서 latest로 자동 업그레이드. (기본 off — 패키지가 핀한 버전 사용) |

### Confirm 플래그 (Two-step send)

모든 발송 도구는 `confirmed: boolean` 인자를 갖습니다.
- `confirmed=false`(기본) → SOLAPI를 호출하지 않고 미리보기만 반환
- `confirmed=true` → 정책 검증 후 실제 발송

LLM이 사용자 동의 없이 한 번에 발송하는 사고를 막습니다. 카카오 템플릿 변경, 발신번호 삭제 등 변경 도구도 같은 가드를 사용합니다.

### 동적 정책 조회/변경

| 도구 | 동작 |
|---|---|
| `get_mcp_policy` | 현재 정책 + ceiling 반환 |
| `update_mcp_policy` | sendEnabled / maxRecipients / allowedSenders 변경 (ceiling 위반 거부, 세션 한정) |


## 도구 카탈로그

### 문서/예제 (read-only, 가드 없음)
- `list_examples` — SDK 예제 카탈로그
- `get_example` — 예제 풀 소스
- `overview` — 개요
- `web_search` — 문서 검색

### 인증
- `configure_setup`, `configure_list`, `configure_show`, `configure_use`, `configure_delete`

### 조회 (read-only, 가드 없음)
- `get_balance` — 잔액·포인트
- `list_messages` — 발송 내역
- `list_senderids` — 발신번호 목록
- `get_quota`, `list_quota_requests` — 발송 한도
- `list_kakao_channels`, `get_kakao_channel`, `list_kakao_channel_categories`
- `list_kakao_channel_groups`, `get_kakao_channel_group`
- `list_kakao_templates`, `get_kakao_template`, `list_kakao_template_categories`, `get_kakao_template_sendable`
- `list_kakao_brand_templates`, `get_kakao_brand_template_sendable`

### 발송 (confirmed=true 필수)
- `send_sms`, `send_lms`, `send_mms`, `send_rcs`, `send_ata`, `send_bms`

### 변경 (confirmed=true 필수)
- `delete_senderid`, `update_senderid`
- `request_quota`
- `create_kakao_template`, `update_kakao_template`, `delete_kakao_template`
- `inspect_kakao_template`, `cancel_inspect_kakao_template`, `release_dormant_kakao_template`
- `create_kakao_brand_template`, `update_kakao_brand_template`, `delete_kakao_brand_template`

### 정책
- `get_mcp_policy`, `update_mcp_policy`

### 관리
- `upgrade_solactl` — solactl을 latest 또는 지정 버전으로 업그레이드 (`SOLAPI_MCP_AUTO_UPGRADE=true`로 부팅마다 자동 수행 가능)


## solactl 의존성

내장 SDK 예제 외에 발송·조회 기능은 [solactl](https://github.com/solapi/solactl) 바이너리에 의존합니다. 본 패키지는 다음 버전을 자동 다운로드합니다:

- solactl `v0.1.6` (Linux/macOS amd64·arm64, Windows amd64·arm64)
- 다운로드 위치: `<package>/bin/solactl` (또는 `solactl.exe`)
- sha256 검증 후 설치

자동 다운로드가 차단된 환경(CI 등)에서는 `SOLAPI_MCP_SOLACTL_BIN=/path/to/solactl`로 시스템에 설치된 바이너리를 가리키도록 할 수 있습니다.

### 업그레이드 정책

기본적으로 패키지가 핀한 버전(`v0.1.6`)을 사용합니다. 신버전을 사용하려면:

- **수시로 (대화 중)**: `upgrade_solactl` 도구를 호출. "solactl 업그레이드해줘" 한 마디로 가능. 특정 버전을 지정하려면 `targetVersion: "0.1.7"`.
- **부팅마다 자동**: `SOLAPI_MCP_AUTO_UPGRADE=true` 환경변수.

기본값을 "수동"으로 둔 이유: 매 호출마다 자동 업그레이드는 GitHub API rate limit 소진과 도구 호출 latency 증가 문제를 일으키며, 핀한 버전은 "패키지가 검증한 조합"을 보장합니다.


## Internal SDK version
내장 SDK 버전:

| Lang         | Version |
|--------------|---------|
| Node.js      | 5.5.2   |
| Kotlin(Java) | 1.0.3   |
| Python       | 5.0.2   |
| PHP          | 5.0.6   |
| Go           | 2.0.0   |
| ASP          | 1.0.0   |
