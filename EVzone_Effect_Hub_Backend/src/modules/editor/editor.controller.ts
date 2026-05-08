import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Editor Workspace')
@Controller('editor')
export class EditorController {
  constructor(private readonly state: AppStateService) {}

  @Get('workspace/:projectId')
  workspace(@Param('projectId') projectId: string) {
    const project = this.state.snapshot.projects.find((p) => p.id === projectId) ?? this.state.snapshot.projects[0];
    return {
      project,
      layout: 'Premium Docked Workspace',
      panels: ['Scene Hierarchy', 'Scene Viewport', 'Preview Panel', 'Inspector', 'Assets Panel', 'Visual Scripting', 'Effect Stack', 'Timeline', 'Console'],
      runtimeBudget: { fps: 59.4, memoryMb: 286, gpuCost: 48, drawCalls: 64 },
      autosave: { enabled: true, lastSavedAt: project.updatedAt },
    };
  }

  @Put('workspace/:projectId/layout')
  saveLayout(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    return { projectId, layout: body, savedAt: this.state.now(), status: 'saved' };
  }

  @Post(':projectId/autosave')
  autosave(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    const project = this.state.snapshot.projects.find((p) => p.id === projectId);
    if (project) project.updatedAt = this.state.now();
    this.state.persist();
    return { autosaveId: this.state.id('autosave'), projectId, payload: body, savedAt: this.state.now(), recoverable: true };
  }

  @Post(':projectId/snapshot')
  snapshot(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    const project = this.state.snapshot.projects.find((p) => p.id === projectId);
    const version = {
      id: this.state.id('ver'),
      version: `v${project ? project.versions.length + 1 : 1}.0`,
      notes: String(body.notes ?? 'Editor snapshot'),
      createdAt: this.state.now(),
      qualityScore: project?.qualityScore ?? 90,
      sizeBytes: project?.sizeBytes ?? 0,
    };
    if (project) {
      project.versions.unshift(version);
      project.updatedAt = this.state.now();
    }
    this.state.persist();
    return { projectId, version };
  }

  @Get(':projectId/effect-stack')
  effectStack(@Param('projectId') projectId: string) {
    return {
      projectId,
      stack: [
        { id: 'beauty', name: 'Clean Broadcast Beauty', enabled: true, intensity: 0.72 },
        { id: 'hologram', name: 'Emerald Hologram Intro', enabled: true, intensity: 0.68 },
        { id: 'lower-third', name: 'Lower Third Reveal', enabled: true, intensity: 1 },
        { id: 'confetti', name: 'Smile Confetti Trigger', enabled: true, intensity: 0.55 },
      ],
    };
  }

  @Put(':projectId/effect-stack')
  saveEffectStack(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    return { projectId, stack: body.stack ?? [], savedAt: this.state.now(), status: 'saved' };
  }

  @Get(':projectId/console')
  console(@Param('projectId') projectId: string) {
    return this.state.snapshot.diagnostics.filter((entry) => !entry.projectId || entry.projectId === projectId);
  }

  @Post(':projectId/command')
  command(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    return { projectId, command: body.command, executedAt: this.state.now(), result: 'queued' };
  }
}
