import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('VFX & Motion Lab')
@Controller('vfx')
export class VfxController {
  constructor(private readonly state: AppStateService) {}

  @Get('presets')
  presets() {
    return [
      'Confetti',
      'Sparkles',
      'Smoke',
      'Fire',
      'Rain',
      'Snow',
      'Lightning',
      'Magic dust',
      'Hologram pulse',
      'Glitch transition',
      'Cinematic reveal',
    ];
  }

  @Get('effects/:id')
  get(@Param('id') id: string) {
    return { id, title: id.replaceAll('-', ' '), emitters: 3, runtimeCost: 'Low', liveSafe: true };
  }

  @Post('effects')
  create(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('vfx'), ...body, createdAt: this.state.now(), status: 'draft' };
  }

  @Post('test')
  test(@Body() body: Record<string, unknown>) {
    return { testId: this.state.id('vfx-test'), input: body, fps: 59.1, gpuCost: 38, warnings: [], liveSafe: true };
  }
}
