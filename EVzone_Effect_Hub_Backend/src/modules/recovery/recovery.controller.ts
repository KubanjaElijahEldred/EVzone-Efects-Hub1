import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiagnosticDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Recovery & Diagnostics Center')
@Controller('recovery')
export class RecoveryController {
  constructor(private readonly state: AppStateService) {}

  @Get('issues')
  issues() {
    return [
      ...this.state.snapshot.diagnostics,
      { id: 'issue-export', level: 'critical', source: 'Export', message: 'Export failed because one dependency is missing.', createdAt: this.state.now(), fixSuggestion: 'Repair dependencies and retry export.' },
      { id: 'issue-preview', level: 'recoverable', source: 'Preview', message: 'Preview runtime failed after device frame switch.', createdAt: this.state.now(), fixSuggestion: 'Reload preview and rebuild shader cache.' },
      { id: 'issue-ai', level: 'recoverable', source: 'AI', message: 'AI generation timed out during safety validation.', createdAt: this.state.now(), fixSuggestion: 'Retry generation with a shorter prompt.' },
    ];
  }

  @Post('diagnostics')
  addDiagnostic(@Body() body: DiagnosticDto) {
    return this.state.addDiagnostic(body);
  }

  @Get('autosaves')
  autosaves() {
    return this.state.snapshot.projects.map((project) => ({
      id: `autosave-${project.id}`,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt,
      recoverable: true,
      summary: 'Local autosave snapshot available.',
    }));
  }

  @Get('autosaves/:id/compare')
  compareAutosave(@Param('id') id: string) {
    return {
      autosaveId: id,
      changes: [
        { label: 'Effect Stack', current: 'Beauty + Lower Third', recovered: 'Beauty + Hologram + Lower Third + Confetti', status: 'Changed' },
        { label: 'VFX Intensity', current: '52%', recovered: '68%', status: 'Changed' },
        { label: 'AI Node Graph', current: 'Draft v8', recovered: 'Draft v9 with smile trigger', status: 'Newer' },
      ],
    };
  }

  @Post('autosaves/:id/restore')
  restoreAutosave(@Param('id') id: string) {
    return { autosaveId: id, restored: true, restoredAt: this.state.now() };
  }

  @Post('dependencies/repair')
  repairDependencies(@Body() body: Record<string, unknown>) {
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

  @Post('retry/:issueId')
  retry(@Param('issueId') issueId: string) {
    return { issueId, retried: true, status: 'queued', queuedAt: this.state.now() };
  }

  @Get('logs')
  logs(@Query('level') level?: string) {
    return level ? this.state.snapshot.diagnostics.filter((log) => log.level === level) : this.state.snapshot.diagnostics;
  }

  @Post('support-package')
  supportPackage(@Body() body: Record<string, unknown>) {
    return {
      packageId: this.state.id('support'),
      createdAt: this.state.now(),
      status: 'ready',
      input: body,
      includes: ['diagnostic logs', 'crash/error report', 'project metadata', 'runtime profile', 'bridge diagnostics'],
      excludes: ['password', 'billing', 'profile', 'authentication data'],
    };
  }

  @Post('diagnostic-package')
  diagnosticPackage(@Body() body: Record<string, unknown>) {
    return this.supportPackage(body);
  }

  @Post('bridge/reconnect')
  reconnectBridge() {
    this.state.snapshot.studioBridge.connected = true;
    this.state.snapshot.studioBridge.status = 'connected';
    this.state.snapshot.studioBridge.lastHeartbeatAt = this.state.now();
    this.state.persist();
    return this.state.snapshot.studioBridge;
  }
}
