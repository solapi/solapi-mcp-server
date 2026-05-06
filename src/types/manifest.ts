export type Sdk = 'nodejs' | 'python' | 'go' | 'php' | 'java' | 'asp';

export type Language =
  | 'javascript'
  | 'python'
  | 'go'
  | 'php'
  | 'java'
  | 'kotlin'
  | 'asp';

export interface ManifestExample {
  id: string;
  sdk: Sdk;
  version?: 'v1' | 'v2';
  repo: string;
  ref: string;
  path: string;
  rawUrl: string;
  htmlUrl: string;
  language: Language;
  category?: string;
  title: string;
  description?: string;
}

export interface Manifest {
  schemaVersion: 1;
  generatedAt: string;
  examples: ManifestExample[];
}
