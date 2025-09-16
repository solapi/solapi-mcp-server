# SOLAPI MCP Server

SOLAPI 문서 검색 및 통합을 위한 MCP(Model Context Protocol) 서버입니다. Claude Desktop과 Cursor에서 SOLAPI 문서를 검색하고 활용할 수 있습니다.


## 빠른 시작

### 전역 설치 (권장)

가장 간단한 방법으로, 설치 후 자동으로 Claude Desktop과 Cursor에 설정됩니다:

| Package Manager | Command                               |
  |---|---------------------------------------|
| **npm** | `npm install -g @solapi/mcp-server`   |
| **yarn** | `yarn global add @solapi/mcp-server`  |
| **pnpm** | `pnpm add -g @solapi/mcp-server`      |
| **bun** | `bun add -g @solapi/mcp-server`       |

설치가 완료되면 자동으로 다음 작업이 수행됩니다
- Claude Desktop 설정 파일에 MCP 서버 등록
- Cursor 설정 파일에 MCP 서버 등록
- 설정 완료 메시지 출력

### 설치 확인

설치 후 Claude Desktop이나 Cursor를 재시작하면 SOLAPI MCP 서버를 사용할 수 있습니다.

<br />

## 수동 설정

전역 설치가 불가능한 환경이거나 수동 설정이 필요한 경우

### 1. 로컬 설치

| Package Manager | Command                      |
  |---|------------------------------|
| **npm** | `npm install @solapi/mcp-server` |
| **yarn** | `yarn add @solapi/mcp-server` |
| **pnpm** | `pnpm add @solapi/mcp-server` |
| **bun** | `bun add @solapi/mcp-server` |



### 2. Claude Desktop 설정 경로

- **macOS:**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:**: `%APPDATA%/Claude/claude_desktop_config.json`

### 3. Cursor 설정 경로

- **macOS:**: `~/.cursor/mcp.json`
- **Windows:**: `%APPDATA%/Cursor/mcp.json`

### 4. mcp.json
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

<br />

## Internal SDK version
현재 지원하는 내장 SDK 버전은 아래와 같습니다.
최신 SDK 버전을 확인하시려면 [여기](https://console.solapi.com/sdk)를 참조하세요.

| Lang         | Version |
|--------------|---------|
| Node.js      | 5.5.2   |
| Kotlin(Java) | 1.0.3   |
| Python       | 5.0.2   |
| PHP          | 5.0.6   |
| Go           | 1.0.0   |
| ASP          | 1.0.0   |