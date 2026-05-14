import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreviewSessionDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Preview & Quality Center')
@Controller('preview')
export class PreviewController {
  constructor(private readonly state: AppStateService) {}

  @Get('media')
  media() {
    return [
      { id: 'presenter-face', title: 'Presenter Face', type: 'Built-in person', status: 'Ready' },
      { id: 'two-guests', title: 'Two Guests', type: 'Multiple people', status: 'Ready' },
      { id: 'hand-gesture-set', title: 'Hand Gesture Set', type: 'Gesture preview', status: 'Ready' },
      { id: 'pet-object-scene', title: 'Pet/Object Scene', type: 'Object preview', status: 'Ready' },
      { id: 'studio-background', title: 'Studio Background', type: 'Environment', status: 'Ready' },
    ];
  }

  @Post('session')
  createSession(@Body() body: PreviewSessionDto) {
    const session = {
      id: this.state.id('preview'),
      projectId: body.projectId,
      source: body.source,
      subject: body.subject,
      deviceFrame: body.deviceFrame,
      fps: 59.4,
      memoryMb: 286,
      cpuCost: 31,
      gpuCost: 48,
      qualityScore: 92,
      createdAt: this.state.now(),
    };
    this.state.snapshot.previewSessions.unshift(session);
    this.state.persist();
    return session;
  }

  @Post('upload')
  upload(@Body() body: Record<string, unknown>) {
    return { uploadId: this.state.id('media'), status: 'ready', media: body, createdAt: this.state.now() };
  }

  @Post('quality-check')
  qualityCheck(@Body() body: Record<string, unknown>) {
    return {
      input: body,
      qualityScore: 92,
      performance: { fps: 59.4, memoryMb: 286, cpuCost: 31, gpuCost: 48, drawCalls: 64, fileSizeMb: 4.8 },
      compatibility: ['EVzone Studio ready', 'Host Camera ready', 'Mobile preview warning'],
      accessibility: ['Flashing passed', 'Readability passed', 'Motion intensity review'],
      optimizationChecklist: ['Compress two textures', 'Reduce confetti density', 'Create low-power fallback'],
    };
  }

  @Post('performance-profile')
  performanceProfile(@Body() body: Record<string, unknown>) {
    return { input: body, fpsHistory: [59.1, 59.4, 59.2], memoryMb: 286, scriptMs: 6.2, textureBudgetMb: 23, createdAt: this.state.now() };
  }

  @Post('qr')
  qrPreview(@Body() body: Record<string, unknown>) {
    return { session: body, qrId: 'PREVIEW-9421', privatePreviewUrl: 'evzone://preview/PREVIEW-9421', expiresIn: '24h' };
  }

  @Get('history')
  history() {
    return this.state.snapshot.previewSessions;
  }

  @Post('feedback')
  feedback(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('feedback'), ...body, createdAt: this.state.now(), status: 'saved' };
  }
}
