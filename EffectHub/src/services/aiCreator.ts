import { evzoneApi } from './apiClient';

export type AIGenerationRequest = {
  prompt: string;
  target: 'effect' | 'filter' | 'background' | 'overlay' | 'vfx' | 'material' | 'script' | 'node-graph';
};

export type AIGenerationResult = {
  id: string;
  title: string;
  target: AIGenerationRequest['target'];
  prompt: string;
  status: 'ready' | 'queued' | 'running' | 'failed' | 'flagged';
  safetyStatus?: 'passed' | 'needs-review' | 'blocked' | 'pending';
  createdAt: string;
  result?: Record<string, unknown> & {
    imageDataUrl?: string;
    imageUrl?: string;
    requiresApiKey?: boolean;
    provider?: string;
  };
};

export async function createAIGeneration(request: AIGenerationRequest): Promise<AIGenerationResult> {
  try {
    return await evzoneApi<AIGenerationResult>('/ai/generate', {
      method: 'POST',
      body: request,
    });
  } catch {
    return {
      id: crypto.randomUUID(),
      title: `AI ${request.target} result`,
      target: request.target,
      prompt: request.prompt,
      status: 'queued',
      safetyStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
  }
}

export async function listAIGenerations() {
  return evzoneApi<AIGenerationResult[]>('/ai/results');
}
