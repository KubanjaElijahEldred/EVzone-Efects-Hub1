import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  list(@Query('projectId') projectId?: string, @Query('status') status?: string) {
    const assets = this.state.snapshot.projects.flatMap((project) => project.assets);
    return assets.filter((asset) => (!projectId || asset.projectId === projectId) && (!status || asset.status === status));
  }

  @Get('supported-formats')
  supportedFormats() {
    return ['PNG', 'JPG', 'KTX2', 'GLB', 'WAV', 'MP3', 'JSON', 'EVZ', 'EVZ Graph', 'CUBE LUT', 'Lottie'];
  }

  @Post('upload')
  upload(@Body() body: Record<string, unknown>) {
    const projectId = String(body.projectId ?? '');
    const project = this.state.snapshot.projects.find((p) => p.id === projectId) ?? this.state.snapshot.projects[0];
    const asset = {
      id: this.state.id('asset'),
      projectId: project.id,
      name: String(body.name ?? 'uploaded_asset.bin'),
      type: String(body.type ?? 'Unknown'),
      sizeBytes: Number(body.sizeBytes ?? 0),
      status: Number(body.sizeBytes ?? 0) > 10_000_000 ? 'oversized' as const : 'ready' as const,
      owner: String(body.owner ?? 'Local Import'),
      createdAt: this.state.now(),
    };
    project.assets.unshift(asset);
    this.state.persist();
    return asset;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    const asset = this.state.snapshot.projects.flatMap((project) => project.assets).find((item) => item.id === id);
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  @Post('validate')
  validate(@Body() body: Record<string, unknown>) {
    const projectId = String(body.projectId ?? '');
    const project = this.state.snapshot.projects.find((p) => p.id === projectId);
    const assets = project ? project.assets : this.state.snapshot.projects.flatMap((p) => p.assets);
    return {
      projectId: project?.id ?? null,
      total: assets.length,
      missing: assets.filter((asset) => asset.status === 'missing'),
      oversized: assets.filter((asset) => asset.status === 'oversized'),
      needsReview: assets.filter((asset) => asset.status === 'needs-review'),
      valid: assets.every((asset) => asset.status === 'ready' || asset.status === 'repaired'),
    };
  }

  @Post('repair')
  repair(@Body() body: Record<string, unknown>) {
    const projectId = String(body.projectId ?? '');
    const assets = this.state.snapshot.projects
      .filter((project) => !projectId || project.id === projectId)
      .flatMap((project) => project.assets);
    assets.forEach((asset) => {
      if (['missing', 'oversized'].includes(asset.status)) asset.status = 'repaired';
    });
    this.state.persist();
    return { repaired: assets.filter((asset) => asset.status === 'repaired').length, assets };
  }
}
