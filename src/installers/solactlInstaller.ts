import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 패키지가 핀한 기본 solactl 버전.
 * 자동 다운로드 / postinstall은 이 버전을 사용한다.
 * 사용자가 SOLAPI_MCP_AUTO_UPGRADE=true 또는 upgrade_solactl 도구로 latest 또는
 * 특정 버전을 가져올 수 있다.
 */
export const SOLACTL_VERSION = '0.1.6';

const RELEASES_API = 'https://api.github.com/repos/solapi/solactl/releases/latest';
const releaseBase = (version: string) => `https://github.com/solapi/solactl/releases/download/v${version}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PlatformAsset {
  archive: string;
  binaryName: string;
  format: 'tar.gz' | 'zip';
}

function platformAsset(version: string): PlatformAsset {
  const platform = process.platform;
  const arch = process.arch === 'x64' ? 'amd64' : process.arch === 'arm64' ? 'arm64' : null;
  if (!arch) {
    throw new Error(`Unsupported architecture: ${process.arch}`);
  }

  if (platform === 'darwin' || platform === 'linux') {
    return {
      archive: `solactl_${version}_${platform}_${arch}.tar.gz`,
      binaryName: 'solactl',
      format: 'tar.gz',
    };
  }
  if (platform === 'win32') {
    return {
      archive: `solactl_${version}_windows_${arch}.zip`,
      binaryName: 'solactl.exe',
      format: 'zip',
    };
  }
  throw new Error(`Unsupported platform: ${platform}`);
}

function packageBinDir(): string {
  return path.resolve(__dirname, '..', '..', 'bin');
}

function binaryName(): string {
  return process.platform === 'win32' ? 'solactl.exe' : 'solactl';
}

export function resolveBinaryPath(): string {
  const override = process.env.SOLAPI_MCP_SOLACTL_BIN;
  if (override) return override;
  return path.join(packageBinDir(), binaryName());
}

export function isInstalled(): boolean {
  try {
    return fs.statSync(resolveBinaryPath()).isFile();
  } catch {
    return false;
  }
}

async function fetchToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status} ${res.statusText}): ${url}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function fetchChecksum(version: string, asset: string): Promise<string> {
  const text = (await fetchToBuffer(`${releaseBase(version)}/checksums.txt`)).toString('utf8');
  for (const line of text.split('\n')) {
    const [hash, name] = line.trim().split(/\s+/);
    if (name === asset) return hash!;
  }
  throw new Error(`Checksum entry not found for ${asset}`);
}

/**
 * GitHub API에서 solactl의 latest 릴리즈 태그(예: "v0.1.7")를 조회한다.
 * 반환은 leading 'v'가 제거된 순수 버전 문자열.
 */
export async function fetchLatestVersion(): Promise<string> {
  const res = await fetch(RELEASES_API, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': '@solapi/mcp-server' },
  });
  if (!res.ok) {
    throw new Error(`GitHub releases 조회 실패 (${res.status} ${res.statusText})`);
  }
  const json = (await res.json()) as { tag_name?: string };
  if (!json.tag_name) throw new Error('GitHub releases 응답에 tag_name이 없습니다.');
  return json.tag_name.replace(/^v/, '');
}

/**
 * 현재 설치된 solactl의 버전을 조회한다. 미설치/오류 시 null.
 */
export async function detectInstalledVersion(): Promise<string | null> {
  if (!isInstalled()) return null;
  const { spawn } = await import('child_process');
  return new Promise((resolve) => {
    const child = spawn(resolveBinaryPath(), ['version'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const chunks: Buffer[] = [];
    child.stdout.on('data', (d: Buffer) => chunks.push(d));
    child.on('error', () => resolve(null));
    child.on('exit', (code) => {
      if (code !== 0) {
        resolve(null);
        return;
      }
      const out = Buffer.concat(chunks).toString('utf8');
      const m = out.match(/v?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/);
      resolve(m ? m[1]! : null);
    });
  });
}

function sha256(buf: Buffer): string {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function spawnSync(cmd: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function extract(archivePath: string, format: 'tar.gz' | 'zip', destDir: string): Promise<void> {
  fs.mkdirSync(destDir, { recursive: true });
  const args = format === 'tar.gz' ? ['-xzf', archivePath, '-C', destDir] : ['-xf', archivePath, '-C', destDir];
  await spawnSync('tar', args);
}

async function findBinary(searchDir: string, binaryName: string): Promise<string | null> {
  const entries = fs.readdirSync(searchDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(searchDir, entry.name);
    if (entry.isFile() && entry.name === binaryName) return fullPath;
    if (entry.isDirectory()) {
      const nested = await findBinary(fullPath, binaryName);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * 지정 버전의 solactl을 받아 패키지 bin 경로에 설치한다.
 * (기존 파일을 덮어쓴다)
 */
export async function downloadVersion(version: string, opts: { logger?: (msg: string) => void } = {}): Promise<string> {
  const log = opts.logger ?? ((msg: string) => console.error(msg));

  if (process.env.SOLAPI_MCP_SOLACTL_BIN) {
    throw new Error(
      `SOLAPI_MCP_SOLACTL_BIN이 설정되어 있어 자동 다운로드/업그레이드를 수행하지 않습니다. ` +
        `(현재 값: ${process.env.SOLAPI_MCP_SOLACTL_BIN})`,
    );
  }

  const target = resolveBinaryPath();
  const asset = platformAsset(version);
  const binDir = packageBinDir();
  fs.mkdirSync(binDir, { recursive: true });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'solactl-'));
  const archivePath = path.join(tmpDir, asset.archive);

  log(`solactl ${version} 다운로드 중: ${asset.archive}`);
  const [archive, expectedHash] = await Promise.all([
    fetchToBuffer(`${releaseBase(version)}/${asset.archive}`),
    fetchChecksum(version, asset.archive),
  ]);

  const actualHash = sha256(archive);
  if (actualHash !== expectedHash) {
    throw new Error(
      `Checksum mismatch for ${asset.archive}: expected ${expectedHash}, got ${actualHash}`,
    );
  }

  fs.writeFileSync(archivePath, archive);
  await extract(archivePath, asset.format, tmpDir);

  const extracted = await findBinary(tmpDir, asset.binaryName);
  if (!extracted) {
    throw new Error(`Binary ${asset.binaryName} not found in extracted archive`);
  }

  fs.copyFileSync(extracted, target);
  if (process.platform !== 'win32') {
    fs.chmodSync(target, 0o755);
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });

  log(`solactl ${version} 설치 완료: ${target}`);
  return target;
}

export async function downloadIfMissing(opts: { force?: boolean; logger?: (msg: string) => void } = {}): Promise<string> {
  if (!opts.force && isInstalled()) return resolveBinaryPath();
  return downloadVersion(SOLACTL_VERSION, opts);
}

export async function ensureInstalled(): Promise<string> {
  if (isInstalled()) return resolveBinaryPath();
  return downloadIfMissing();
}

export interface UpgradeResult {
  fromVersion: string | null;
  toVersion: string;
  changed: boolean;
}

/**
 * solactl을 latest(또는 지정 버전)로 업그레이드한다.
 * - 동일 버전이 이미 설치돼 있으면 다운로드를 생략하고 changed=false 반환.
 * - SOLAPI_MCP_SOLACTL_BIN이 설정돼 있으면 throw (자동 관리 영역 아님).
 */
export async function upgradeSolactl(
  opts: { targetVersion?: string; logger?: (msg: string) => void } = {},
): Promise<UpgradeResult> {
  const target = opts.targetVersion ?? (await fetchLatestVersion());
  const current = await detectInstalledVersion();

  if (current === target) {
    return { fromVersion: current, toVersion: target, changed: false };
  }

  await downloadVersion(target, { logger: opts.logger ?? (() => {}) });
  return { fromVersion: current, toVersion: target, changed: true };
}
