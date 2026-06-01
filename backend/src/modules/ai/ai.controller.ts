import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import OpenAI from 'openai/index.js';
import type { ImageGenerateParams } from 'openai/resources/images.js';
import { AIGenerateDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('AI Creator')
@Controller('ai')
export class AiController {
  constructor(
    private readonly state: AppStateService,
    private readonly config: ConfigService,
  ) {}

  @Post('generate')
  async generate(@Body() body: AIGenerateDto) {
    const openAiImage = await this.tryGenerateOpenAiImage(body);
    const generation = {
      id: this.state.id('ai'),
      title: `AI ${body.target} result`,
      target: body.target,
      prompt: body.prompt,
      status: openAiImage?.imageDataUrl || openAiImage?.imageUrl ? 'ready' as const : 'queued' as const,
      safetyStatus: body.prompt.toLowerCase().includes('flash') ? 'needs-review' as const : 'passed' as const,
      createdAt: this.state.now(),
      result: {
        summary: `Generated ${body.target} from prompt.`,
        nextActions: ['Open in editor', 'Regenerate', 'Save preset'],
        context: body.context ?? {},
        ...openAiImage,
      },
    };
    this.state.snapshot.aiGenerations.unshift(generation);
    this.state.persist();
    return generation;
  }

  @Get('results')
  results() {
    return this.state.snapshot.aiGenerations;
  }

  @Get('results/:id')
  result(@Param('id') id: string) {
    const result = this.state.snapshot.aiGenerations.find((item) => item.id === id);
    if (!result) throw new NotFoundException('AI result not found');
    return result;
  }

  @Post('results/:id/remix')
  async remix(@Param('id') id: string) {
    const original = this.result(id);
    return this.generate({ prompt: `${original.prompt} -- premium EVzone remix`, target: original.target, context: { remixOf: id } });
  }

  @Post('results/:id/open-in-editor')
  openInEditor(@Param('id') id: string) {
    const result = this.result(id);
    return { result, route: '/editor', openedAt: this.state.now() };
  }

  @Post('optimize')
  optimize(@Body() body: Record<string, unknown>) {
    return {
      optimizationId: this.state.id('opt'),
      createdAt: this.state.now(),
      input: body,
      improvements: ['Compress textures', 'Reduce draw calls', 'Enable live-safe fallback', 'Lower particle density'],
      expectedGain: '20-35% runtime improvement',
    };
  }

  @Post('fix-error')
  fixError(@Body() body: Record<string, unknown>) {
    return {
      fixId: this.state.id('fix'),
      createdAt: this.state.now(),
      error: body,
      patch: 'if (!payload.eventId) return fallback();',
      recommendation: 'Apply patch in Code & Developer Lab, then rerun validation.',
    };
  }

  @Post('safety-check')
  safetyCheck(@Body() body: Record<string, unknown>) {
    const prompt = JSON.stringify(body).toLowerCase();
    const warnings = [];
    if (prompt.includes('flash')) warnings.push('Flashing / rapid motion warning');
    if (prompt.includes('distort')) warnings.push('Face-safe beauty limit review');
    return { passed: warnings.length === 0, warnings, checkedAt: this.state.now() };
  }

  @Get('prompts')
  promptPresets() {
    return [
      { id: 'prompt-effect', title: 'Prompt-to-effect starter', prompt: 'Create a premium live-safe EVzone host camera effect...' },
      { id: 'prompt-overlay', title: 'Prompt-to-overlay starter', prompt: 'Create a clean lower-third overlay for EVzone Studio...' },
      { id: 'prompt-material', title: 'Prompt-to-material starter', prompt: 'Create an emerald broadcast-safe hologram material...' },
    ];
  }

  private async tryGenerateOpenAiImage(body: AIGenerateDto) {
    const imageTargets = new Set(['effect', 'filter', 'background', 'overlay', 'vfx', 'material', 'texture']);
    if (!imageTargets.has(body.target)) {
      return { provider: 'evzone-local', requiresApiKey: false };
    }

    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      return {
        provider: 'evzone-local-fallback',
        requiresApiKey: true,
        env: 'OPENAI_API_KEY',
        message: 'OpenAI key is missing. Generated local EVzone preview image. Add OPENAI_API_KEY for paid OpenAI output.',
        imageDataUrl: this.buildLocalFallbackImage(body, 'OpenAI key missing'),
      };
    }

    const model = this.config.get<string>('OPENAI_IMAGE_MODEL') || 'gpt-image-1.5';
    const size = this.config.get<string>('OPENAI_IMAGE_SIZE') || '1024x1024';
    const quality = this.config.get<string>('OPENAI_IMAGE_QUALITY') || 'medium';
    const prompt = [
      body.prompt,
      'EVzone Effect Hub output requirements: premium live-studio style, creator-safe face effects, no public marketplace, no billing UI, polished preview asset.',
    ].join('\n');

    const client = new OpenAI({ apiKey });
    try {
      const response = await client.images.generate({
        model,
        prompt,
        size: size as ImageGenerateParams['size'],
        quality: quality as ImageGenerateParams['quality'],
        n: 1,
      });
      const firstImage = response.data?.[0];
      const imageDataUrl = firstImage?.b64_json ? `data:image/png;base64,${firstImage.b64_json}` : undefined;
      return {
        provider: 'openai',
        requiresApiKey: false,
        model,
        imageDataUrl,
        imageUrl: firstImage?.url,
        revisedPrompt: firstImage?.revised_prompt,
      };
    } catch (error) {
      const openAiMessage = this.extractOpenAiErrorMessage(error);
      if (this.isOpenAiBillingOrQuotaError(error, openAiMessage)) {
        return {
          provider: 'evzone-local-fallback',
          requiresApiKey: false,
          model,
          fallbackReason: 'billing-or-quota-limit',
          message: `OpenAI billing/quota limit reached. Generated local EVzone preview image instead. (${openAiMessage})`,
          imageDataUrl: this.buildLocalFallbackImage(body, 'Billing limit reached'),
          openAiError: openAiMessage,
        };
      }
      return {
        provider: 'openai',
        requiresApiKey: false,
        failed: true,
        message: openAiMessage || 'OpenAI image generation failed.',
      };
    }
  }

  private extractOpenAiErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      return error.message;
    }
    return 'OpenAI image generation failed.';
  }

  private isOpenAiBillingOrQuotaError(error: unknown, message: string) {
    const lowerMessage = message.toLowerCase();
    const details =
      error && typeof error === 'object'
        ? (error as {
            status?: number;
            code?: string;
            type?: string;
            error?: { code?: string; type?: string; message?: string };
          })
        : {};
    const errorCode = String(details.code || details.error?.code || '').toLowerCase();
    const errorType = String(details.type || details.error?.type || '').toLowerCase();
    const status = Number(details.status || 0);
    const indicatesBillingText =
      lowerMessage.includes('billing hard limit') ||
      lowerMessage.includes('insufficient_quota') ||
      lowerMessage.includes('exceeded your current quota') ||
      lowerMessage.includes('quota');
    const indicatesBillingCode =
      errorCode === 'insufficient_quota' ||
      errorType === 'insufficient_quota' ||
      errorCode.includes('quota');
    return indicatesBillingCode || (indicatesBillingText && (status === 400 || status === 402 || status === 429));
  }

  private buildLocalFallbackImage(body: AIGenerateDto, subtitle: string) {
    const title = `EVzone ${String(body.target || 'effect').toUpperCase()} Preview`;
    const prompt = String(body.prompt || '').trim();
    const promptSnippet = prompt.slice(0, 110) + (prompt.length > 110 ? '...' : '');
    const escapedTitle = this.escapeSvgText(title);
    const escapedSubtitle = this.escapeSvgText(subtitle);
    const escapedPrompt = this.escapeSvgText(promptSnippet || 'No prompt provided');
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f2a44"/>
      <stop offset="55%" stop-color="#114b4f"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
    <radialGradient id="glowA" cx="26%" cy="22%" r="42%">
      <stop offset="0%" stop-color="rgba(3,205,140,0.38)"/>
      <stop offset="100%" stop-color="rgba(3,205,140,0)"/>
    </radialGradient>
    <radialGradient id="glowB" cx="74%" cy="82%" r="45%">
      <stop offset="0%" stop-color="rgba(247,127,0,0.30)"/>
      <stop offset="100%" stop-color="rgba(247,127,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <rect width="1024" height="1024" fill="url(#glowA)"/>
  <rect width="1024" height="1024" fill="url(#glowB)"/>
  <g opacity="0.25">
    <path d="M0 170h1024M0 340h1024M0 510h1024M0 680h1024M0 850h1024" stroke="#9ca3af" stroke-width="1"/>
    <path d="M170 0v1024M340 0v1024M510 0v1024M680 0v1024M850 0v1024" stroke="#9ca3af" stroke-width="1"/>
  </g>
  <rect x="118" y="176" width="788" height="668" rx="34" fill="rgba(15,23,42,0.56)" stroke="rgba(255,255,255,0.18)"/>
  <text x="154" y="256" fill="#03cd8c" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700">${escapedTitle}</text>
  <text x="154" y="306" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="24" opacity="0.86">${escapedSubtitle}</text>
  <text x="154" y="374" fill="#e5e7eb" font-family="Inter, Arial, sans-serif" font-size="22" opacity="0.9">${escapedPrompt}</text>
  <circle cx="512" cy="560" r="104" fill="rgba(247,127,0,0.22)" stroke="rgba(247,127,0,0.7)" stroke-width="2"/>
  <circle cx="512" cy="560" r="158" fill="none" stroke="rgba(3,205,140,0.48)" stroke-width="2"/>
  <rect x="360" y="730" width="304" height="58" rx="29" fill="rgba(3,205,140,0.18)" stroke="rgba(3,205,140,0.72)"/>
  <text x="512" y="767" text-anchor="middle" fill="#03cd8c" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Local Fallback Preview</text>
</svg>`.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private escapeSvgText(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
