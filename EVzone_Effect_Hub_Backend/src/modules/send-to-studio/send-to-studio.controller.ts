import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudioBindingDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Send to Studio Wizard')
@Controller('send-to-studio')
export class SendToStudioController {
  constructor(private readonly state: AppStateService) {}

  @Get(':projectId/status')
  status(@Param('projectId') projectId: string) {
    return this.state.snapshot.sendPackages.find((pkg) => pkg.projectId === projectId) ?? { projectId, status: 'draft' };
  }

  @Post(':projectId/metadata')
  metadata(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    const pkg = this.ensurePackage(projectId);
    pkg.metadata = body;
    pkg.updatedAt = this.state.now();
    this.state.persist();
    return pkg;
  }

  @Post(':projectId/preview-assets')
  previewAssets(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    const pkg = this.ensurePackage(projectId);
    pkg.previewAssets = {
      thumbnail: body.thumbnail ?? 'captured-thumbnail.png',
      demoVideo: body.demoVideo ?? 'demo-video.mp4',
      beforeAfter: body.beforeAfter ?? 'before-after.png',
      gif: body.gif ?? 'preview.gif',
    };
    pkg.updatedAt = this.state.now();
    this.state.persist();
    return pkg;
  }

  @Post(':projectId/final-quality-check')
  qualityCheck(@Param('projectId') projectId: string) {
    const pkg = this.ensurePackage(projectId);
    pkg.status = 'checking';
    pkg.qualityCheck = {
      performance: 'pass',
      fileSize: 'pass',
      missingAssets: 'warning',
      compatibility: 'ready',
      accessibility: 'warning',
      trackingStability: 'pass',
      runtimeBudget: 'ready',
      studioReadiness: 'pass',
      qualityScore: 92,
    };
    pkg.updatedAt = this.state.now();
    this.state.persist();
    return pkg.qualityCheck;
  }

  @Post(':projectId/target')
  target(@Param('projectId') projectId: string, @Body() body: StudioBindingDto) {
    const pkg = this.ensurePackage(projectId);
    pkg.target = body;
    pkg.updatedAt = this.state.now();
    this.state.persist();
    return pkg;
  }

  @Post(':projectId/export-package')
  exportPackage(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    const pkg = this.ensurePackage(projectId);
    pkg.status = 'packaging';
    pkg.packageName = `${projectId}.evz`;
    pkg.versionNotes = String(body.versionNotes ?? 'Studio-ready package');
    pkg.qrPreview = 'PREVIEW-9421';
    pkg.privatePreviewLink = 'evzone://private-preview/PREVIEW-9421';
    pkg.updatedAt = this.state.now();
    this.state.persist();
    return pkg;
  }

  @Post(':projectId/send')
  send(@Param('projectId') projectId: string) {
    const pkg = this.ensurePackage(projectId);
    pkg.status = 'sent';
    pkg.updatedAt = this.state.now();
    const project = this.state.snapshot.projects.find((p) => p.id === projectId);
    if (project) {
      project.studioStatus = 'sent';
      project.status = 'live-ready';
      project.updatedAt = this.state.now();
    }
    this.state.persist();
    return { sent: true, package: pkg, openStudioRoute: '/studio-integration' };
  }

  private ensurePackage(projectId: string) {
    let pkg = this.state.snapshot.sendPackages.find((item) => item.projectId === projectId);
    if (!pkg) {
      pkg = {
        id: this.state.id('pkg'),
        projectId,
        status: 'draft',
        metadata: {},
        target: {},
        previewAssets: {},
        createdAt: this.state.now(),
        updatedAt: this.state.now(),
      };
      this.state.snapshot.sendPackages.unshift(pkg);
    }
    return pkg;
  }
}
