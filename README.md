# SOLAPI MCP Server

SOLAPI 문서 검색 및 통합을 위한 MCP(Model Context Protocol) 서버입니다. Claude Desktop과 Cursor에서 SOLAPI 문서를 검색하고 활용할 수 있습니다.

## 🚀 빠른 시작

### 전역 설치 (권장)

가장 간단한 방법으로, 설치 후 자동으로 Claude Desktop과 Cursor에 설정됩니다:

```bash
npm install -g @solapi/mcp-server-test
```

설치가 완료되면 자동으로 다음 작업이 수행됩니다
- Claude Desktop 설정 파일에 MCP 서버 등록
- Cursor 설정 파일에 MCP 서버 등록
- 설정 완료 메시지 출력

### 설치 확인

설치 후 Claude Desktop이나 Cursor를 재시작하면 SOLAPI MCP 서버를 사용할 수 있습니다.

## 🔧 수동 설정

전역 설치가 불가능한 환경이거나 수동 설정이 필요한 경우

### 1. 로컬 설치

```bash
npm install @solapi/mcp-server-test
```

### 2. Claude Desktop 설정

**macOS:**
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "solapi": {
      "command": "npx",
      "args": ["-y", "@solapi/mcp-server"],
      "env": {}
    }
  }
}
```

**Windows:**
```json
// %APPDATA%/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "solapi": {
      "command": "npx",
      "args": ["-y", "@solapi/mcp-server"],
      "env": {}
    }
  }
}
```

### 3. Cursor 설정

**macOS:**
```json
// ~/.cursor/mcp.json
{
  "mcpServers": {
    "solapi": {
      "command": "npx",
      "args": ["-y", "@solapi/mcp-server"],
      "env": {}
    }
  }
}
```

**Windows:**
```json
// %APPDATA%/Cursor/mcp.json
{
  "mcpServers": {
    "solapi": {
      "command": "npx",
      "args": ["-y", "@solapi/mcp-server"],
      "env": {}
    }
  }
}
```

## 📋 사용 가능한 도구

이 MCP 서버는 다음과 같은 도구들을 제공합니다:

### 🔍 검색 도구
- **search-solapi-local**: SOLAPI 내부 문서에서 빠른 검색 (기본 검색 도구)
- **search-solapi-web**: SOLAPI 웹 문서에서 실시간 검색 (웹에서 직접 검색)
- **search-solapi-examples**: MCP 내부에서 언어별 코드 예제 검색
- **get-solapi-overview**: SOLAPI 서비스 개요 정보 제공
- **get-solapi-example-detail**: 특정 예제 코드의 상세 정보 제공
- **benchmark-solapi-search**: 성능 최적화 가이드 제공
- **analyze-memory-usage**: 메모리 사용량 분석

### 사용 예시
```
SOLAPI SMS API 사용법을 알려줘
SOLAPI 알림톡 예제 코드를 찾아줘
SOLAPI 성능 최적화 방법을 알려줘
```


**SOLAPI MCP Server**로 더 효율적인 개발을 시작하세요! 🚀
