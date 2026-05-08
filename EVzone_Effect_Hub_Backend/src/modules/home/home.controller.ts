import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Effect Creator Home')
@Controller('home')
export class HomeController {
  constructor(private readonly state: AppStateService) {}

  @Get('dashboard')
  dashboard() {
    return {
      welcome: 'Welcome to EVzone Effect Creator',
      studioConnection: this.state.snapshot.studioBridge,
      quickActions: [
        { label: 'Create New Effect', route: '/new-project' },
        { label: 'Open Project', route: '/projects' },
        { label: 'Create with AI', route: '/ai-creator' },
        { label: 'Browse Templates', route: '/resources' },
        { label: 'Open Live-Ready Effects', route: '/projects?status=live-ready' },
      ],
      recentProjects: this.state.snapshot.projects.slice(0, 5),
      recommendedTemplates: this.state.snapshot.resources.filter((resource) => resource.featured),
      pinnedTools: ['AI Creator', 'Editor', 'Resource Library', 'Studio Integration', 'Preview Center'],
      updateBanner: this.state.snapshot.maintenance.updateNotes[0],
    };
  }

  @Get('quick-actions')
  quickActions() {
    return [
      { id: 'new-effect', label: 'Create New Effect', route: '/new-project' },
      { id: 'open-project', label: 'Open Project', route: '/projects' },
      { id: 'ai', label: 'Create with AI', route: '/ai-creator' },
      { id: 'templates', label: 'Browse Templates', route: '/resources' },
      { id: 'live-ready', label: 'Open Live-Ready Effects', route: '/projects?status=live-ready' },
    ];
  }

  @Get('updates')
  updates() {
    return this.state.snapshot.maintenance.updateNotes;
  }
}
