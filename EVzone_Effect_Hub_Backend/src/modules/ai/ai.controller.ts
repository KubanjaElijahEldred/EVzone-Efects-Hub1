import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import OpenAI from 'openai';
import type { ImageGenerateParams } from 'openai/resources/images';
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
        provider: 'openai',
        requiresApiKey: true,
        env: 'OPENAI_API_KEY',
        message: 'Add OPENAI_API_KEY to EVzone_Effect_Hub_Backend/.env to enable paid OpenAI image generation.',
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
      return {
        provider: 'openai',
        requiresApiKey: false,
        failed: true,
        message: error instanceof Error ? error.message : 'OpenAI image generation failed.',
      };
    }
  }
}
