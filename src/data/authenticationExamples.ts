export const authenticationExamples = [
  {
    id: "api-key-authentication",
    title: "API Key 인증 방식",
    category: "인증",
    description: "API Key와 API Secret을 사용하여 HMAC 기반 서명을 생성하여 인증하는 방식",
    tags: ["API Key", "HMAC", "인증", "Authorization", "Signature"],
    content: `
## API Key 인증 방식

REST API를 호출할 때 HTTP 헤더의 Authorization 필드를 사용하여 인증을 진행합니다. API를 호출하려면 먼저 본인 인증이 필요합니다.

솔라피 콘솔의 [API Key 관리](https://console.solapi.com/credentials) 메뉴에서 API Key와 API Secret을 발급받아 REST API 호출에 사용할 수 있습니다.

### Authorization 헤더 형식

\`\`\`bash
Authorization: <AuthenticationMethod> apiKey=<API Key>, date=<Date Time>, salt=<Salt>, signature=<Signature>
\`\`\`

#### 파라미터 설명

- **AuthenticationMethod**: Signature 생성 알고리즘 (HMAC-SHA256, HMAC-MD5 등 지원)
- **API Key**: 발급받은 API Key
- **Date Time**: 요청 시간 (ISO 8601 형식, 예: 2019-07-01T00:41:48Z)
- **Salt**: 임의의 문자열 (12~64자리 사이의 영문, 숫자 문자열)
- **Signature**: HMAC 해시값 (Date Time + Salt를 조합한 문자열을 API Secret으로 Key로 사용)

#### Signature 생성 방법

1. **문자열 조합**: \`<Date Time> + <Salt>\` 문자열 생성
2. **HMAC 생성**: API Secret을 Key로 사용하여 HMAC 해시 생성
3. **알고리즘**: HMAC-SHA256 또는 HMAC-MD5 사용 가능

※ **주의사항**: API Secret과 Signature 생성 로직은 외부에 노출되지 않도록 주의해야 합니다.

### 보안 고려사항

- **시간 제한**: 요청 시간은 15분 이내여야 합니다 (Replay Attack 방지)
- **재전송 방지**: 15분 이내의 동일한 Signature는 재사용이 불가합니다 (서버에 저장됨)
- **Salt 사용**: 매 요청마다 다른 Salt 값을 사용하여 Signature 중복을 방지합니다.

### Node.js 구현 예제

\`\`\`javascript
const crypto = require('crypto');

// HMAC-SHA256 서명 생성
function generateSignature(apiSecret, dateTime, salt) {
  const data = dateTime + salt;
  return crypto
    .createHmac('sha256', apiSecret)
    .update(data)
    .digest('hex');
}

// Authorization 헤더 생성
function createAuthHeader(apiKey, apiSecret) {
  const dateTime = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString('hex');
  const signature = generateSignature(apiSecret, dateTime, salt);
  
  return \`HMAC-SHA256 apiKey=\${apiKey}, date=\${dateTime}, salt=\${salt}, signature=\${signature}\`;
}

// API 호출 예제
const axios = require('axios');

async function sendMessage(apiKey, apiSecret, messageData) {
  const authHeader = createAuthHeader(apiKey, apiSecret);
  
  try {
    const response = await axios.post('https://api.solapi.com/messages/v4/send-many/detail', messageData, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('API 호출 실패:', error.response?.data || error.message);
    throw error;
  }
}
\`\`\`

### Python 구현 예제

\`\`\`python
import hmac
import hashlib
import secrets
from datetime import datetime, timezone

def generate_signature(api_secret: str, date_time: str, salt: str) -> str:
    """HMAC-SHA256 서명 생성"""
    data = date_time + salt
    signature = hmac.new(
        api_secret.encode(),
        data.encode(),
        hashlib.sha256
    ).hexdigest()
    return signature

def create_auth_header(api_key: str, api_secret: str) -> str:
    """Authorization 헤더 생성"""
    date_time = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    salt = secrets.token_hex(16)
    signature = generate_signature(api_secret, date_time, salt)
    
    return f"HMAC-SHA256 apiKey={api_key}, date={date_time}, salt={salt}, signature={signature}"
\`\`\`

### 오류 처리

| Error Code | 설명 | HTTP 상태 코드 | 해결 방법 |
|------------|------|---------------|-----------|
| InvalidAPIKey | 유효하지 않은 API Key | 403 | API Key 존재 여부 및 발급 확인 |
| SignatureDoesNotMatch | Signature 불일치 | 403 | Signature 생성 과정 확인 |
| RequestTimeTooSkewed | 시간 초과 (15분) | 403 | 서버의 시간 동기화 |
| DuplicatedSignature | 중복된 Signature 사용 | 403 | Salt 값을 매번 다르게 생성 |

※ **참고**: 발급된 토큰은 유효시간이 15분으로 제한되어 있어 통신환경에 따라 시간이 초과될 수 있습니다. 서버의 시간을 표준시에 동기화해주세요.
    `
  },
  {
    id: "oauth2-authentication",
    title: "OAuth2 인증 방식",
    category: "인증",
    description: "OAuth 2.0을 사용한 서드파티 앱 연동 인증 방식",
    tags: ["OAuth2", "Access Token", "Refresh Token", "서드파티", "앱연동"],
    content: `
## OAuth 2.0 인증 방식

OAuth 2.0은 사용자의 계정 정보를 직접 노출하지 않고, 제3자 애플리케이션에게 특정 리소스에 대한 접근 권한을 안전하게 위임할 수 있도록 하는 표준 인증 프로토콜입니다.

### 연동 준비 과정

- **앱 생성**: 연동할 앱을 [솔라피 콘솔 앱 관리](https://console.solapi.com/apps)에서 생성합니다.
- **클라이언트 정보 확인**: 앱 생성 후 클라이언트 ID와 클라이언트 Secret을 발급받을 수 있습니다.

※ **참고**: 클라이언트 Secret은 **최초 1회만 확인 가능**하므로 안전하게 보관해야 합니다.

### Step 1: 사용자 인증 요청

솔라피 로그인 페이지로 이동하여 사용자로부터 파라미터를 받아 솔라피 계정으로 로그인 하도록 요청합니다.

**Endpoint**: \`GET /oauth2/v1/authorize\`

#### 요청 파라미터

- **client_id** (필수): 앱 생성 시 발급받은 클라이언트 ID
- **response_type** (필수): 응답 타입 (\`code\` 또는 \`token\`)
- **redirect_uri** (필수): 인증 후 리다이렉트 될 URL
- **scope** (선택): 요청할 권한 범위 (공백으로 구분)
- **state** (선택): CSRF 방지를 위한 임의의 문자열

#### 요청 예시

\`\`\`bash
GET /oauth2/v1/authorize?client_id=your_client_id&response_type=code&redirect_uri=https://yourapp.com/callback&scope=accounts:read+users:read&state=random_string_123 HTTP/1.1
Host: api.solapi.com
\`\`\`

### Step 2: 액세스 토큰 발급받기

사용자 인증 후 발급받은 \`code\`를 사용하여 액세스 토큰을 발급받을 수 있습니다.

**Endpoint**: \`POST /oauth2/v1/access_token\`

#### 요청 바디

\`\`\`json
{
    "grant_type": "authorization_code",
    "code": "ADFKVJCK19JDFKL2KFJLS3388",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "redirect_uri": "https://yourapp.com/callback"
}
\`\`\`

#### 응답 예시

\`\`\`json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ZwUymzWAUiTxQ...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ZwUymzWAUiTxQ...",
    "token_type": "Bearer",
    "expires_in": 86400
}
\`\`\`

- **토큰 유효기간**:
- **액세스 토큰**: 24시간 동안 유효
- **리프레시 토큰**: 만료일 없음, **최초 액세스 토큰 발급 시에만 확인 가능**하므로 안전하게 보관해야 합니다.

### Step 3: 액세스 토큰으로 API 호출하기

발급받은 액세스 토큰을 Authorization 헤더에 포함하여 솔라피 API를 호출할 수 있습니다.

\`\`\`bash
GET /users/v1/member HTTP/1.1
Host: api.solapi.com
Authorization: Bearer eyGciOiNiIsIkpXVCJ9.eyJ0NTY3ODkwIiwibWRtaW4iOnRydWV9.TJVHrcEfxjoYZgeFONFh7HgQ
\`\`\`

### 리프레시 토큰으로 액세스 토큰 갱신

액세스 토큰이 만료되었을 경우, 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받을 수 있습니다.

\`\`\`json
{
    "grant_type": "refresh_token",
    "refresh_token": "eyGciOiNiIsIkpXVCJ9.eyJ0NTYDkwIwibWaW4iOnRydWV9.TVEfxjoYZgeFONFh7HgQ"
}
\`\`\`

### State 파라미터 활용

\`state\` 파라미터는 OAuth 2.0 인증 과정의 보안을 강화하는 데 사용됩니다:
- **CSRF 공격 방지**: Cross-Site Request Forgery 공격을 방지합니다.
- **상태 유지**: 인증 요청 전의 상태를 응답 시에 복원할 수 있습니다.

\`\`\`javascript
// State 값 생성 및 세션 저장 예제
const state = crypto.randomBytes(16).toString('hex');
sessionStorage.setItem('oauth_state', state);

// OAuth URL에 state 포함
const authUrl = \`https://api.solapi.com/oauth2/v1/authorize?response_type=code&client_id=\${CLIENT_ID}&state=\${state}\`;

// 리다이렉트 후 state 검증
const returnedState = req.query.state;
const originalState = sessionStorage.getItem('oauth_state');

if (returnedState !== originalState) {
    throw new Error('State 값이 일치하지 않습니다. CSRF 공격 가능성이 있습니다.');
}
\`\`\`

### 권한(Scope) 오류 처리

요청한 기능에 대한 권한이 없을 경우 API 호출 시 오류가 발생할 수 있습니다.

\`\`\`javascript
try {
    const response = await fetch('https://api.solapi.com/users/v1/member', {
        headers: {
            'Authorization': \`Bearer \${accessToken}\`
        }
    });
    
    if (response.status === 401) {
        // 권한 부족 오류 처리
        showMessage('해당 계정은 권한이 부족합니다. 앱에 필요한 권한을 허용해주세요.');
        disableUserFeatures();
    }
} catch (error) {
    console.error('API 호출 오류:', error);
}
\`\`\`
    `
  },
  {
    id: "oauth2-scopes",
    title: "OAuth2 권한 목록",
    category: "인증",
    description: "SOLAPI OAuth2에서 사용할 수 있는 권한(Scope) 목록 및 설명",
    tags: ["OAuth2", "Scope", "권한", "API", "접근제어"],
    content: `
## OAuth2 권한(Scope) 목록

SOLAPI OAuth2에서 사용할 수 있는 권한(Scope) 목록입니다. 각 권한은 특정 API에 접근할 수 있는 권한을 정의합니다.

### 주요 권한 목록

#### 계정 정보 조회

- **users:read**: 회원 정보를 포함한 사용자 정보를 조회합니다.
- **accounts:read**: 계정 정보 조회

#### 발신번호 관리

- **senderid:read**: 발신번호 조회
- **senderid:write**: 발신번호 등록 / 수정 / 삭제
- **role-senderid:read**: 발신번호 조회(에이전트)
- **role-senderid:write**: 발신번호 등록 / 수정 / 삭제(에이전트)

#### 메시지 관리

- **message:read**: 메시지 내역 및 예약 조회
- **message:write**: 메시지 발송
- **role-message:read**: 메시지 내역 및 예약 조회(에이전트)
- **role-message:write**: 메시지 발송(에이전트)

#### 충전/결제

- **cash:read**: 캐시 잔액, 요금 조회
- **cash:write**: 카드 등록, 캐시 충전, 환불
- **role-cash:read**: 캐시 잔액, 요금 조회(에이전트)
- **role-cash:write**: 카드 등록, 캐시 충전, 환불(에이전트)

#### 이미지

- **images:read**: 이미지 조회
- **images:write**: 이미지 업로드
- **role-images:read**: 이미지 조회(에이전트)
- **role-images:write**: 이미지 업로드(에이전트)

#### 카카오톡

- **kakao:read**: 카카오톡 채널 정보 조회
- **kakao:write**: 카카오톡 채널 정보 수정 및 삭제
- **role-kakao:read**: 카카오톡 채널 정보 조회(에이전트)
- **role-kakao:write**: 카카오톡 채널 정보 수정 및 삭제(에이전트)

#### 파일 스토리지

- **storage:read**: 계정 파일 조회
- **storage:write**: 계정 파일 업로드
- **role-storage:read**: 계정 파일 조회(에이전트)
- **role-storage:write**: 계정 파일 업로드(에이전트)

#### 기타 권한

- **pricing:read**: 계정 요금 조회
- **notification:read**: 알림 내역 조회
- **coolog:read**: 계정 로그 조회
- **iam:read**: 계정 인증정보 조회
- **iam:write**: 계정 인증정보 수정

### 권한 요청 예제

#### 기본 권한 요청

\`\`\`javascript
const authUrl = \`https://api.solapi.com/oauth2/v1/authorize?\` +
  \`client_id=\${CLIENT_ID}&\` +
  \`response_type=code&\` +
  \`redirect_uri=\${REDIRECT_URI}&\` +
  \`scope=users:read accounts:read message:read\`;
\`\`\`

#### 메시지 발송 권한 요청

\`\`\`javascript
const authUrl = \`https://api.solapi.com/oauth2/v1/authorize?\` +
  \`client_id=\${CLIENT_ID}&\` +
  \`response_type=code&\` +
  \`redirect_uri=\${REDIRECT_URI}&\` +
  \`scope=users:read message:write senderid:read\`;
\`\`\`

### 권한별 API 호출 예제

#### 계정 정보 조회 (users:read 권한 필요)

\`\`\`javascript
const response = await fetch('https://api.solapi.com/users/v1/member', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`
  }
});
\`\`\`

#### 메시지 발송 (message:write 권한 필요)

\`\`\`javascript
const response = await fetch('https://api.solapi.com/messages/v4/send-many/detail', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: {
      to: '01012345678',
      from: '01087654321',
      text: '안녕하세요. 테스트 메시지입니다.'
    }
  })
});
\`\`\`

### 권한 부족 오류 처리

권한이 없는 경우 401 Unauthorized 오류가 발생합니다:

\`\`\`javascript
try {
  const response = await fetch(apiUrl, {
    headers: { 'Authorization': \`Bearer \${accessToken}\` }
  });
  
  if (response.status === 401) {
    console.error('권한이 부족합니다. 필요한 스코프를 요청해야 합니다.');
    // 권한 부족으로 인한 기능 제한 처리
  }
} catch (error) {
  console.error('API 호출 오류:', error);
}
\`\`\`

### 주의사항

1. **최소 권한 원칙**: 필요한 기능에 대한 최소한의 권한만 요청하세요.
2. **권한 설명**: 사용자에게 각 권한이 필요한 이유를 명확하게 설명하세요.
3. **에이전트 권한**: \`role-\` 접두사가 붙은 권한은 계정 내 에이전트 권한으로 동작합니다.
4. **앱 설정 확인**: 원하는 권한은 앱 설정에서 사용할 수 있도록 설정해야 합니다.
    `
  },
  {
    id: "sso-authentication",
    title: "SSO 인증 방식",
    category: "인증",
    description: "Single Sign-On을 사용한 통합된 인증 방식",
    tags: ["SSO", "Single Sign-On", "토큰", "통합", "로그인"],
    content: `
## SSO 인증 방식

싱글 사인온(Single Sign-On, SSO)은 한 번의 로그인으로 여러 서비스에 접근할 수 있도록 하여, 솔라피에서 발급한 토큰으로 앱에서 API를 호출할 수 있는 통합된 로그인 인증 방식입니다.

### SSO란?

솔라피에서 SSO 토큰을 발급받아, SSO 토큰을 통해 토큰 생성 과정 없이 API 통신을 합니다.

### SSO 인증 절차

1. **SSO 토큰 발급**: [SSO API Reference](https://docs.solapi.com/api-reference/api-sso)를 참고하여 토큰 발급
2. **IP 허용 설정**: 앱에 허용된 IP에서만 통신이 가능하도록 설정
3. **API 호출**: 발급받은 SSO 토큰으로 API 호출

### SSO 토큰을 사용한 API 호출하기

발급받은 SSO 토큰을 사용하여 솔라피의 API를 통신할 수 있습니다.

#### 기본 형식

\`\`\`bash
curl -X (GET|POST) https://api.solapi.com/<호출하려는 API url> \\
  -H 'Authorization: sso <SSO Token>'
\`\`\`

#### 회원 정보 조회 예제

\`\`\`bash
curl -X GET https://api.solapi.com/users/v1/member \\
  -H 'authorization: sso eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IkRvM2VOQ2ZvdUFCcSIsIm1lbWJlcklkIjoiTUVNVXdnX0d2SEVNcjQiLCJhY2NvdW50SWQiOiIyMTA3MjIxOTY1Mzg2NyIsImlhdCI6MTYyNzIyMjUxMn0.Eh_hXbqhfTC00QDvF4HrLgXnUqEsT80c6-r3qM6vfff'
\`\`\`

### JavaScript/Node.js 예제

\`\`\`javascript
const axios = require('axios');

async function callSolapiWithSSO(ssoToken, endpoint) {
  try {
    const response = await axios.get(\`https://api.solapi.com\${endpoint}\`, {
      headers: {
        'Authorization': \`sso \${ssoToken}\`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('SSO API 호출 오류:', error.response?.data || error.message);
    throw error;
  }
}

// 사용 예제
const ssoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const userInfo = await callSolapiWithSSO(ssoToken, '/users/v1/member');
\`\`\`

### Python 예제

\`\`\`python
import requests

def call_solapi_with_sso(sso_token: str, endpoint: str):
    """SSO 토큰을 사용하여 솔라피 API 호출"""
    headers = {
        'Authorization': f'sso {sso_token}'
    }
    
    response = requests.get(f'https://api.solapi.com{endpoint}', headers=headers)
    response.raise_for_status()
    
    return response.json()

# 사용 예제
sso_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
user_info = call_solapi_with_sso(sso_token, '/users/v1/member')
\`\`\`

### 주요 특징

1. **IP 제한**: 앱에 허용된 IP에서만 호출 가능
2. **통합된 인증**: 한번의 인증으로 여러 기능 사용
3. **토큰 기반**: JWT 토큰 형식의 SSO 토큰 사용
4. **보안**: IP 화이트리스팅으로 보안 수준 향상

### 인증 방식 비교

| 인증 방식 | 주요 대상 | 특징 |
|----------|-----------|------|
| **API Key** | 서버-서버 통신 | HMAC 기반, 높은 보안 |
| **OAuth2** | 서드파티 앱 통신 | 권한 위임, 서드파티 앱 |
| **SSO** | 내부 시스템 연동 | IP 제한, 통합된 인증 |

### 관련 문서

- [SSO API Reference](https://docs.solapi.com/api-reference/api-sso)
- [REST API Documents](https://docs.solapi.com/rest-api-reference/overview)
- [1:1 문의](https://support.solapi.com/hc/ko/requests/new)

### 주의사항

※ **보안 고려사항**:
- SSO 토큰은 안전하게 보관해야 합니다.
- IP 화이트리스팅 설정을 통해 접근을 제한해야 합니다.
- 토큰이 탈취될 경우 즉시 재발급 받아야 합니다.
- 주기적으로 토큰을 갱신해야 합니다.
    `
  },
  {
    id: "authentication-overview",
    title: "인증 방식 개요",
    category: "인증",
    description: "SOLAPI에서 제공하는 다양한 인증 방식에 대한 소개 및 비교",
    tags: ["인증", "API Key", "OAuth2", "SSO", "개요", "비교"],
    content: `
## 인증 방식 개요

SOLAPI는 [솔라피닷컴](https://solapi.com) 서비스와 연동하여 다양한 기능을 사용할 수 있는 API를 제공합니다. API 사용을 위해서는 **반드시 먼저 사용자 인증(Authorization)**이 필요하며, SOLAPI는 세 가지 종류의 인증 방식을 제공합니다:

### 인증 방식 종류

| 인증 방식 | 주요 목적 | 특징 |
|----------|-----------|------|
| **[API Key 인증](./api-key)** | 서버-서버 통신 | 높은 보안의 인증 방식 |
| **[OAuth2 인증](./oauth2-3/oauth2)** | 서드파티 앱 통신 | 서드파티 앱 연동 인증 방식 |
| **[SSO 인증](./authentication-sso)** | 내부 시스템 연동 | 통합된 인증 방식 |

### 인증 방식 선택 가이드

#### 1. API Key 인증 - 높은 보안
**권장 상황**: 서버 환경에서 높은 보안 수준의 솔라피 API를 사용하고 싶을 때

**특징**:
- HMAC 기반 보안 인증
- API Key와 Secret을 이용한 Signature 생성
- 발급 즉시 사용 가능
- 가장 보안성이 높음

**구체적인 사용 사례**:
- 자체적으로 SMS 발송기능 구현
- 1회성 시스템에서 알림 메시지 발송
- 정기 배치작업에서 상태 메시지 발송

#### 2. OAuth2 인증 - 서드파티 앱
**권장 상황**: 다른 사용자의 계정을 대신하여 API를 사용하는 앱을 개발하고 싶을 때

**특징**:
- 표준 OAuth 2.0 프로토콜
- 사용자 동의 기반 권한 위임
- 서드파티 앱 생성 필요
- Scope 기반 세분화된 권한 제어

**구체적인 사용 사례**:
- 메시지 발송 대행 서비스
- CRM 시스템과 연동
- 쇼핑몰 솔루션 연동

#### 3. SSO 인증 - 내부 시스템 연동
**권장 상황**: 그룹웨어 등 내부 시스템에서 단일 인증을 사용하고 싶을 때

**특징**:
- 통합된 로그인 환경
- IP 제한 기반 접근 제어
- 솔라피 로그인으로 연동 기능 사용

**구체적인 사용 사례**:
- 그룹웨어 내부 시스템
- 사내 어드민
- 내부 관리 및 모니터링

### SOLAPI API 사용을 위한 5가지 필수 조건

API 사용 시 아래 5가지 조건이 모두 충족되어야 합니다:

#### 1. 계정 권한 (OAuth2 해당)
서드파티 앱 개발 시 사용자가 보유한 권한을 사용할 수 있습니다:
- **계정 접근 권한**: 사용자의 특정 정보 조회
- **계정 로그 권한**: 사용자의 로그 발송 및 조회

※ **주의사항**:
- 필요 권한 확인: 각 API마다 필요한 권한을 확인해야 함
- 권한 허용 필수: 사용자가 권한을 허용하지 않으면 해당 API 사용 불가
- 최소한의 권한 요청 원칙: 최소한의 권한 요청은 사용자의 앱 사용률을 높임

#### 2. 멤버 역할
각 멤버의 역할에 따라 API 사용이 제한됩니다:

| 역할 | 권한 범위 | 특징 |
|------|-----------|------|
| **OWNER** | 모든 권한 | 계정의 모든 기능 사용 가능 |
| **DEVELOPER** | 개발 권한 | API 호출 및 개발 (일부 기능 제한) |
| **MEMBER** | 기본 권한 | 제한된 기본기능 사용 가능 |

#### 3. 계정 상태

| 상태 | API 호출 가능 여부 | 특징 |
|------|-------------------|------|
| **ACTIVE** | 가능 | 정상 사용중인 계정 |
| **INACTIVE** | 불가 (인증 및 서비스 제한) | 휴면 계정 (1년 이상 미사용) |
| **DELETED** | 불가 (서비스 불가) | 탈퇴한 계정 |

#### 4. 멤버 상태

| 상태 | API 호출 가능 여부 | 특징 |
|------|-------------------|------|
| **UNVERIFIED** | 제한적 호출 | 휴대폰 본인 인증 미완료 |
| **ACTIVE** | 가능 | 정상 사용중인 계정 |
| **INACTIVE** | 불가 (인증 및 서비스 제한) | 휴면 멤버 (1년 이상 미사용) |
| **DELETED** | 불가 (서비스 불가) | 탈퇴한 멤버 |

#### 5. 계정 인증
계정 상태 및 멤버 상태에 따라 결정됩니다:

| 인증 상태 | 가능 | 대상 |
|----------|------|------|
| **개인 인증** | 개인 사용자 | 개인 기반 인증 |
| **사업자 인증** | 기업/사업자 | 사업자등록증 기반 인증 |

### 인증 방식별 구현 가이드

각 인증 방식의 상세한 구현 방법은 아래 문서를 참고하세요:

1. **[API Key 인증 구현](./api-key)**: HMAC 기반 인증 구현 방법
2. **[OAuth2 인증 구현](./oauth2-3/oauth2)**: OAuth 2.0 흐름 구현 방법
3. **[SSO 인증 구현](./authentication-sso)**: SSO 토큰을 사용한 인증 방식
4. **[OAuth2 권한 목록](./oauth2-3/scope)**: 전체 권한(Scope) 목록

### 보안 고려사항

모든 인증 방식에서 공통적으로 고려해야 할 보안 사항:

1. **토큰/키 보안**: API 키, Secret, 토큰은 안전하게 보관
2. **HTTPS 사용**: 모든 API 통신은 HTTPS를 통해 암호화
3. **권한 최소화**: 필요한 최소한의 권한만 요청
4. **주기적 갱신**: 토큰 등을 주기적으로 갱신
5. **로그 모니터링**: API 호출 로그를 모니터링하여 이상 탐지
    `
  }
];
