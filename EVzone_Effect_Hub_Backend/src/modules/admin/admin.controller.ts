import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InternalAdminGuard } from '../../common/guards/internal-admin.guard';
import type { NamedRule } from '../../common/types/domain.types';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Internal Admin Center')
@UseGuards(InternalAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly state: AppStateService) {}

  @Get('system-health')
  systemHealth() {
    return {
      status: 'healthy',
      services: ['Effect Creator Core', 'EVzone Studio Bridge', 'AI Creator Services', 'Resource Library', 'Preview Runtime', 'Internal Reports'],
      bridge: this.state.snapshot.studioBridge,
      warnings: this.state.snapshot.diagnostics.filter((entry) => entry.level === 'warning'),
    };
  }

  @Get('editor-usage')
  editorUsage() {
    return [
      { label: 'Editor sessions', value: 1284, trend: '+12%' },
      { label: 'Projects opened', value: 482, trend: '+8%' },
      { label: 'Send-to-Studio runs', value: 156, trend: '+18%' },
      { label: 'Quality checks', value: 814, trend: '+22%' },
    ];
  }

  @Get('crash-reports')
  crashReports() {
    return this.state.snapshot.diagnostics.filter((entry) => entry.level === 'critical' || entry.level === 'warning');
  }

  @Get('ai-usage')
  aiUsage() {
    return {
      generations: this.state.snapshot.aiGenerations,
      summary: [
        { label: 'Prompt-to-effect', count: 214, safety: 'Passed' },
        { label: 'Prompt-to-overlay', count: 182, safety: 'Passed' },
        { label: 'Prompt-to-material', count: 76, safety: 'Watch' },
      ],
    };
  }

  @Get('resources')
  resources() {
    return this.state.snapshot.resources;
  }

  @Patch('resources/:id')
  patchResource(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const resource = this.state.snapshot.resources.find((item) => item.id === id);
    if (resource) Object.assign(resource, body);
    this.state.persist();
    return resource ?? null;
  }

  @Get('templates')
  templates() {
    return this.state.snapshot.resources.filter((resource) => resource.category.toLowerCase().includes('template'));
  }

  @Post('templates')
  createTemplate(@Body() body: Record<string, unknown>) {
    const template = {
      id: this.state.id('template'),
      title: String(body.title ?? 'New Template'),
      category: 'Template',
      type: 'template',
      difficulty: 'Beginner' as const,
      compatibleWithStudio: true,
      tags: [],
      description: String(body.description ?? ''),
      licenseNote: 'Free for EVzone Studio use.',
      createdAt: this.state.now(),
    };
    this.state.snapshot.resources.unshift(template);
    this.state.persist();
    return template;
  }

  @Patch('templates/:id')
  patchTemplate(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.patchResource(id, body);
  }

  @Get('presets')
  presets() {
    return this.state.snapshot.resources.filter((resource) => ['VFX', 'Studio Controls', 'AI Prompts'].includes(resource.category));
  }

  @Get('ai-safety/flagged-content')
  flaggedContent() {
    return this.state.snapshot.admin.flaggedContent;
  }

  @Patch('ai-safety/flagged-content/:id')
  reviewFlag(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const item = this.state.snapshot.admin.flaggedContent.find((flag) => flag.id === id);
    if (item) item.status = String(body.status ?? 'reviewed') as 'needs-review' | 'reviewed' | 'dismissed';
    this.state.persist();
    return item ?? null;
  }

  @Get('logs')
  logs() {
    return this.state.snapshot.admin.logs;
  }

  @Get('feature-flags')
  featureFlags() {
    return this.state.snapshot.admin.featureFlags;
  }

  @Patch('feature-flags/:key')
  updateFlag(@Param('key') key: string, @Body() body: Record<string, unknown>) {
    const flag = this.state.snapshot.admin.featureFlags.find((item) => item.key === key);
    if (flag) flag.enabled = Boolean(body.enabled);
    this.state.persist();
    return flag ?? null;
  }

  @Get('rules/compatibility')
  compatibilityRules() {
    return this.state.snapshot.admin.compatibilityRules;
  }

  @Put('rules/compatibility')
  setCompatibilityRules(@Body() body: Record<string, unknown>) {
    if (Array.isArray(body.rules)) this.state.snapshot.admin.compatibilityRules = body.rules as NamedRule[];
    this.state.persist();
    return this.state.snapshot.admin.compatibilityRules;
  }

  @Get('rules/runtime-budgets')
  runtimeBudgetRules() {
    return this.state.snapshot.admin.runtimeBudgetRules;
  }

  @Put('rules/runtime-budgets')
  setRuntimeBudgetRules(@Body() body: Record<string, unknown>) {
    if (Array.isArray(body.rules)) this.state.snapshot.admin.runtimeBudgetRules = body.rules as NamedRule[];
    this.state.persist();
    return this.state.snapshot.admin.runtimeBudgetRules;
  }

  @Get('rules/content-policy')
  contentPolicy() {
    return this.state.snapshot.admin.contentPolicy;
  }

  @Get('studio-connector/logs')
  connectorLogs() {
    return this.state.snapshot.diagnostics.filter((entry) => entry.source.toLowerCase().includes('bridge') || entry.source.toLowerCase().includes('studio'));
  }

  @Get('releases')
  releases() {
    return this.state.snapshot.admin.releases;
  }

  @Post('releases')
  createRelease(@Body() body: Record<string, unknown>) {
    const release = {
      id: this.state.id('release'),
      title: String(body.title ?? 'EVzone Update'),
      version: String(body.version ?? 'v1.0.0'),
      channel: String(body.channel ?? 'Internal'),
      status: 'ready' as const,
      createdAt: this.state.now(),
    };
    this.state.snapshot.admin.releases.unshift(release);
    this.state.persist();
    return release;
  }

  @Patch('releases/:id')
  updateRelease(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const release = this.state.snapshot.admin.releases.find((item) => item.id === id);
    if (release) Object.assign(release, body);
    this.state.persist();
    return release ?? null;
  }

  @Post('releases/:id/rollout')
  rollout(@Param('id') id: string) {
    const release = this.state.snapshot.admin.releases.find((item) => item.id === id);
    if (release) release.status = 'live';
    this.state.persist();
    return release ?? null;
  }
}
