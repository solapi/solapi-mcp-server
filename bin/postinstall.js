#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ES6 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// package.json 읽기를 위한 require 함수 생성
const require = createRequire(import.meta.url);

console.log('🚀 Setting up SOLAPI MCP server...');

/**
 * 클로드 MCP 설정 경로를 반환하는 함수
 */
function getClaudeConfigPath () {
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
  } else {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }
}

/**
 * 커서 MCP 설정 가능한 경로들을 반환하는 함수
 */
function getCursorConfigPaths () {
  const homeDir = os.homedir();
  const possiblePaths = [];

  if (process.platform === 'win32') {
    possiblePaths.push(
      path.join(process.env.APPDATA || '', 'Cursor', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'),
      path.join(homeDir, '.cursor', 'mcp.json'),
      path.join(process.env.APPDATA || '', 'cursor', 'mcp.json'),
    );
  } else if (process.platform === 'darwin') {
    possiblePaths.push(
      path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'),
      path.join(homeDir, '.cursor', 'mcp.json'),
      path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'mcp.json'),
    );
  } else {
    // Linux
    possiblePaths.push(
      path.join(homeDir, '.config', 'Cursor', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'),
      path.join(homeDir, '.cursor', 'mcp.json'),
      path.join(homeDir, '.config', 'cursor', 'mcp.json'),
    );
  }

  return possiblePaths;
}

/**
 * 실제 존재하는 Cursor 설정 파일 경로를 찾는 함수
 */
function findCursorConfigPath () {
  const possiblePaths = getCursorConfigPaths();

  // 기존 설정 파일이 있는 경로 찾기
  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      console.log(`📍 Found Cursor config at: ${configPath}`);
      return configPath;
    }
  }

  // 기존 파일이 없으면 디렉토리라도 있는지 확인
  for (const configPath of possiblePaths) {
    const configDir = path.dirname(configPath);
    if (fs.existsSync(configDir)) {
      console.log(`📍 Found Cursor directory, will create config at: ${configPath}`);
      return configPath;
    }
  }

  return null;
}

/**
 * Claude 데스크톱 앱의 MCP 설정을 구성하는 함수
 *
 * @description
 * 이 함수는 다음과 같은 작업을 수행합니다:
 * 1. Claude Desktop의 설정 파일 경로를 확인
 * 2. Claude Desktop이 설치되어 있는지 확인
 * 3. 기존 설정 파일이 있다면 읽어들임
 * 4. MCP 서버 설정을 추가 또는 업데이트
 *
 * @throws {Error} 설정 파일 읽기/쓰기 실패시 에러 발생
 *
 * @returns {boolean} 설정 성공 여부
 * - true: 설정 파일 업데이트 성공
 * - false: Claude Desktop 미설치 또는 설정 실패
 */
function setupClaudeConfig () {
  try {
    const configPath = getClaudeConfigPath();
    const configDir = path.dirname(configPath);

    // Claude Desktop 설치 확인
    if (!fs.existsSync(configDir)) {
      console.log('ℹ️  Claude Desktop not found, skipping Claude configuration');
      return false;
    }

    console.log(`📍 Claude config path: ${configPath}`);

    let config = { mcpServers: {} };

    // 기존 설정 파일이 있는 경우에만 읽기
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(content);
        if (!config.mcpServers) config.mcpServers = {};
        console.log('📖 Found existing Claude configuration');
      } catch (parseErr) {
        console.warn('⚠️  Could not parse existing Claude config, skipping');
        return false;
      }
    } else {
      console.log('ℹ️  No existing Claude config file found, skipping');
      return false;
    }

    const packageJson = require('../package.json');
    const serverName = packageJson.name.replace(/[@\/]/g, '-');

    config.mcpServers[serverName] = {
      command: 'solapi-mcp-server',
      args: [],
      env: {},
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('✅ Claude configuration updated!');
    console.log(`🔧 Added MCP server: ${serverName}`);
    return true;

  } catch (error) {
    console.log('❌ Failed to configure Claude:', error.message);
    return false;
  }
}

/**
 * Cursor IDE의 MCP 설정을 구성하는 함수
 *
 * @description
 * 이 함수는 다음과 같은 작업을 수행합니다:
 * 1. Cursor의 설정 파일 경로를 확인
 * 2. Cursor가 설치되어 있는지 확인
 * 3. 기존 설정 파일이 있다면 읽어들임
 * 4. MCP 서버 설정을 추가 또는 업데이트
 *
 * @throws {Error} 설정 파일 읽기/쓰기 실패시 에러 발생
 *
 * @returns {boolean} 설정 성공 여부
 * - true: 설정 파일 업데이트 성공
 * - false: Cursor 미설치 또는 설정 실패
 */
function setupCursorConfig () {
  try {
    const configPath = findCursorConfigPath();

    // Cursor 설치 확인 (상위 디렉토리들 체크)
    const cursorBaseDir = process.platform === 'win32'
      ? path.join(process.env.APPDATA || '', 'Cursor')
      : process.platform === 'darwin'
        ? path.join(os.homedir(), 'Library', 'Application Support', 'Cursor')
        : path.join(os.homedir(), '.config', 'Cursor');

    if (!fs.existsSync(cursorBaseDir)) {
      console.log('ℹ️  Cursor not found, skipping Cursor configuration');
      return false;
    }

    console.log(`📍 Cursor config path: ${configPath}`);

    let config = { mcpServers: {} };

    // 기존 설정 파일이 있는 경우에만 읽기
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(content);
        if (!config.mcpServers) config.mcpServers = {};
        console.log('📖 Found existing Cursor configuration');
      } catch (parseErr) {
        console.warn('⚠️  Could not parse existing Cursor config, skipping');
        return false;
      }
    } else {
      console.log('ℹ️  No existing Cursor config file found, skipping');
      return false;
    }

    const packageJson = require('../package.json');
    const serverName = packageJson.name.replace(/[@\/]/g, '-');

    config.mcpServers[serverName] = {
      command: 'solapi-mcp-server',
      args: [],
      env: {},
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('✅ Cursor configuration updated!');
    console.log(`🔧 Added MCP server: ${serverName}`);
    return true;

  } catch (error) {
    console.log('❌ Failed to configure Cursor:', error.message);
    return false;
  }
}

/**
 * 수동 설정 안내를 출력하는 함수
 */
function showManualInstructions () {
  const packageJson = require('../package.json');
  const serverName = packageJson.name.replace(/[@\/]/g, '-');

  console.log('\n📖 Manual setup instructions:');
  console.log('\n🔵 For Claude Desktop:');
  console.log('1. Open Claude Desktop');
  console.log('2. Settings → Developer → Edit Config');
  console.log('3. Add this to your claude_desktop_config.json:');

  console.log('\n🟡 For Cursor:');
  console.log('1. Open Cursor');
  console.log('2. Cmd/Ctrl + Shift + P → "Cline: Open MCP Settings"');
  console.log('3. Add this configuration:');

  console.log('\n```json');
  console.log(JSON.stringify({
    mcpServers: {
      [serverName]: {
        command: 'solapi-mcp-server',
        args: [],
        env: {},
      },
    },
  }, null, 2));
  console.log('```\n');
}

/**
 * 메인 실행 함수
 */
function main () {
  const claudeSuccess = setupClaudeConfig();
  const cursorSuccess = setupCursorConfig();

  if (claudeSuccess || cursorSuccess) {
    console.log('\n🎉 Setup completed!');
    if (claudeSuccess) console.log('📱 Restart Claude Desktop to use the MCP server');
    if (cursorSuccess) console.log('💻 Restart Cursor to use the MCP server');
  } else {
    console.log('\n⚠️  No existing configurations found');
    console.log('💡 This means Claude/Cursor are not installed or not configured yet');
    showManualInstructions();
  }
}

main();