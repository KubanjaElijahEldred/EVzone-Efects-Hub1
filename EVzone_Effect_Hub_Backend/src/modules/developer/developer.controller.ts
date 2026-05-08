import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Code & Developer Lab')
@Controller('developer')
export class DeveloperController {
  constructor(private readonly state: AppStateService) {}

  @Get('api-reference')
  apiReference() {
    return [
      { title: 'Components API', endpoint: '/developer/api-reference/components' },
      { title: 'Tracking API', endpoint: '/developer/api-reference/tracking' },
      { title: 'Events API', endpoint: '/developer/api-reference/events' },
      { title: 'Studio Bridge API', endpoint: '/developer/api-reference/studio-bridge' },
    ];
  }

  @Get('api-reference/:topic')
  apiTopic(@Param('topic') topic: string) {
    return {
      topic,
      examples: [
        `evzone.${topic}.create(...)`,
        `evzone.${topic}.validate(...)`,
        `evzone.${topic}.sendToStudio(...)`,
      ],
      updatedAt: this.state.now(),
    };
  }

  @Get('scripts')
  scripts() {
    return [
      { id: 'script-studio-events', name: 'studioBridgeEvents.ts', status: 'warning' },
      { id: 'script-scoreboard', name: 'scoreboardController.ts', status: 'ready' },
    ];
  }

  @Post('scripts')
  createScript(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('script'), ...body, status: 'draft', createdAt: this.state.now() };
  }

  @Post('scripts/validate')
  validate(@Body() body: Record<string, unknown>) {
    const content = String(body.content ?? '');
    const warnings = content.includes('payload.eventId') ? [] : ['Missing payload.eventId guard'];
    return { valid: warnings.length === 0, warnings, suggestedPatch: warnings.length ? 'if (!payload.eventId) return fallback();' : null };
  }

  @Post('packages/export')
  exportPackage(@Body() body: Record<string, unknown>) {
    return { packageId: this.state.id('sdk'), input: body, file: 'evzone-effect-sdk-package.zip', createdAt: this.state.now() };
  }
}
