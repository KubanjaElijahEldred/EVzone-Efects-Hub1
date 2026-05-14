import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingsUpdateDto } from '../../common/dto/base.dto';
import { EVZONE_COLORS } from '../../common/constants/evzone-colors';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Settings Center')
@Controller('settings')
export class SettingsController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  get() {
    return { ...this.state.snapshot.settings, palette: EVZONE_COLORS, noAccountSettings: true };
  }

  @Put()
  update(@Body() body: SettingsUpdateDto) {
    this.state.snapshot.settings = { ...this.state.snapshot.settings, ...body.settings };
    this.state.persist();
    return this.state.snapshot.settings;
  }

  @Patch(':section')
  updateSection(@Body() body: Record<string, unknown>) {
    this.state.snapshot.settings = { ...this.state.snapshot.settings, ...body };
    this.state.persist();
    return this.state.snapshot.settings;
  }

  @Post('reset-layout')
  resetLayout() {
    return { reset: true, layout: 'Premium Creator', savedAt: this.state.now() };
  }

  @Post('clear-cache')
  clearCache() {
    return { cleared: true, areas: ['preview', 'shader', 'ai-result'], savedAt: this.state.now() };
  }

  @Post('export-local-data')
  exportLocalData() {
    return {
      exportId: this.state.id('export'),
      createdAt: this.state.now(),
      includes: ['settings', 'workspace presets', 'local project index', 'quality reports'],
      excluded: ['password', 'profile', 'billing', 'authentication'],
    };
  }

  @Post('backup')
  backup() {
    return { backupId: this.state.id('backup'), createdAt: this.state.now(), restorePoints: 18, status: 'ready' };
  }

  @Post('restore')
  restore(@Body() body: Record<string, unknown>) {
    return { restored: true, restorePoint: body.restorePoint ?? 'latest', restoredAt: this.state.now() };
  }
}
