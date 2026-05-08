import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Materials & Shader Lab')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  list() {
    return [
      { id: 'mat-emerald-hologram', title: 'Emerald Hologram Material', type: 'Shader Graph', performance: 'Medium' },
      { id: 'mat-clean-skin', title: 'Clean Broadcast Skin Material', type: 'Skin', performance: 'Low' },
      { id: 'mat-glass-refraction', title: 'Studio Glass Refraction', type: 'PBR', performance: 'Watch' },
    ];
  }

  @Get('presets')
  presets() {
    return ['PBR Material', 'Neon', 'Hologram', 'Glass', 'Skin', 'Makeup Blend', 'Face Occlusion', 'LUT Grade'];
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return { id, title: id.replaceAll('-', ' '), nodes: 12, textureBudgetMb: 23, liveSafe: id !== 'mat-glass-refraction' };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('mat'), ...body, createdAt: this.state.now(), status: 'draft' };
  }

  @Post('generate')
  generate(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('mat-ai'), title: 'AI Generated Material', prompt: body.prompt, status: 'ready', liveSafe: true };
  }

  @Post('validate-performance')
  validatePerformance(@Body() body: Record<string, unknown>) {
    return {
      input: body,
      score: 88,
      warnings: ['Glass/refraction can be expensive in live preview'],
      recommendations: ['Compress textures', 'Enable low-power fallback', 'Use live-safe material preset'],
    };
  }
}
