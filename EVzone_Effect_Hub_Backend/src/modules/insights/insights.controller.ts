import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Project Insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly state: AppStateService) {}

  @Get('projects/:projectId')
  overview(@Param('projectId') projectId: string) {
    const project = this.state.snapshot.projects.find((p) => p.id === projectId) ?? this.state.snapshot.projects[0];
    return {
      project,
      usage: this.usage(project.id),
      quality: this.quality(project.id),
      reliability: this.reliability(project.id),
      monetization: null,
      note: 'Usage and quality analytics only. No earnings, sales, payouts or marketplace analytics.',
    };
  }

  @Get('projects/:projectId/usage')
  usage(@Param('projectId') projectId: string) {
    return {
      projectId,
      timesUsed: 148,
      lastUsed: this.state.now(),
      scenesUsingEffect: ['Morning Show', 'Interview Desk', 'Guest Split', 'Countdown Scene', 'Finale'],
      camerasUsingEffect: ['Host Camera', 'Guest Camera', 'Virtual Camera'],
      triggerFrequency: [
        { name: 'Studio Button', count: 142 },
        { name: 'Scene Change', count: 94 },
        { name: 'Smile Trigger', count: 74 },
      ],
      operatorControlUsage: [
        { name: 'Start Effect', count: 118 },
        { name: 'Show Overlay', count: 86 },
        { name: 'VFX Intensity', count: 41 },
      ],
      averageRuntime: '06:24',
    };
  }

  @Get('projects/:projectId/quality')
  quality(@Param('projectId') projectId: string) {
    return {
      projectId,
      fpsHistory: [58.9, 59.2, 58.7, 59.6, 59.4],
      qualityScoreTrend: [88, 89, 90, 91, 94],
      runtimeTrend: [6.8, 6.5, 6.2, 5.8, 5.6],
      optimizationImprovements: ['Texture compression', 'Particle density tuning', 'Script timing reduced'],
    };
  }

  @Get('projects/:projectId/reliability')
  reliability(@Param('projectId') projectId: string) {
    return {
      projectId,
      crashHistory: this.state.snapshot.diagnostics.filter((d) => d.level === 'critical'),
      failedPreviewHistory: this.state.snapshot.diagnostics.filter((d) => d.source.toLowerCase().includes('preview')),
      failedExportHistory: this.state.snapshot.diagnostics.filter((d) => d.source.toLowerCase().includes('export')),
      reliabilityScore: 96,
    };
  }

  @Get('projects/:projectId/reports')
  reports(@Param('projectId') projectId: string, @Query('format') format = 'json') {
    return {
      projectId,
      format,
      reports: [
        { title: 'Internal Quality Report', type: 'PDF', status: 'Ready' },
        { title: 'Usage Analytics Snapshot', type: 'CSV', status: 'Ready' },
      ],
      excluded: ['earnings', 'sales', 'payouts', 'marketplace analytics'],
    };
  }
}
