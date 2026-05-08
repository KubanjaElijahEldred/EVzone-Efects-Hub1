import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Learning & Documentation Hub')
@Controller('learning')
export class LearningController {
  constructor(private readonly state: AppStateService) {}

  @Get('paths')
  paths() {
    return this.state.snapshot.learningPaths;
  }

  @Get('paths/:id')
  path(@Param('id') id: string) {
    return this.state.snapshot.learningPaths.find((path) => path.id === id) ?? null;
  }

  @Get('docs/search')
  searchDocs(@Query('q') q = '') {
    const query = q.toLowerCase();
    const docs = [
      'Create New Effect',
      'Open Project',
      'Editor Workspace Panels',
      'Scene Hierarchy',
      'Inspector',
      'Assets Panel',
      'Tracking Lab',
      'Visual Logic Lab',
      'Code & Developer Lab',
      'Materials & Shader Lab',
      'VFX & Motion Lab',
      'Interactive Effects Lab',
      'AI Creator Hub',
      'Free Resource Library',
      'Preview & Quality Center',
      'Studio Integration Center',
      'Send to Studio Wizard',
    ];
    return docs.filter((doc) => !query || doc.toLowerCase().includes(query)).map((title) => ({ title, type: 'documentation' }));
  }

  @Get('api-docs')
  apiDocs() {
    return [
      { title: 'Components API', detail: 'Add, update, bind and validate effect components.' },
      { title: 'Tracking API', detail: 'Face, hand, pose, segmentation and world AR hooks.' },
      { title: 'Studio Bridge API', detail: 'Scene binding, camera routing, studio events and control surfaces.' },
    ];
  }

  @Get('shortcuts')
  shortcuts() {
    return [
      ['Ctrl/Cmd + K', 'Open command palette'],
      ['Ctrl/Cmd + S', 'Save and snapshot'],
      ['Shift + F', 'Frame selected object'],
      ['F5', 'Trigger studio test event'],
      ['Shift + 2', 'Emergency disable'],
    ];
  }

  @Get('tutorials/:id')
  tutorial(@Param('id') id: string) {
    return {
      id,
      title: id.replaceAll('-', ' '),
      modules: ['Overview', 'Step by step', 'Studio preview', 'Quality check', 'Send to Studio'],
      relatedTemplates: this.state.snapshot.resources.slice(0, 3),
      relatedProjects: this.state.snapshot.projects.slice(0, 2),
    };
  }
}
