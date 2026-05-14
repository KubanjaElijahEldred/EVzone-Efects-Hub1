import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaintenanceUpdateDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Maintenance / System Update')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly state: AppStateService) {}

  @Get('status')
  status() {
    return this.state.snapshot.maintenance;
  }

  @Put('status')
  updateStatus(@Body() body: MaintenanceUpdateDto) {
    this.state.snapshot.maintenance.mode = body.mode;
    if (body.message) this.state.snapshot.maintenance.message = body.message;
    if (body.estimatedRecoveryTime) this.state.snapshot.maintenance.estimatedRecoveryTime = body.estimatedRecoveryTime;
    this.state.snapshot.maintenance.updatedAt = this.state.now();
    this.state.persist();
    return this.state.snapshot.maintenance;
  }

  @Get('update-notes')
  updateNotes() {
    return this.state.snapshot.maintenance.updateNotes;
  }

  @Get('timeline')
  timeline() {
    return [
      { time: '13:20', event: 'Maintenance window opened', status: 'Complete' },
      { time: '13:23', event: 'Studio connector paused for schema refresh', status: 'Complete' },
      { time: '13:31', event: 'Runtime limit sync updating', status: 'In progress' },
      { time: '13:42', event: 'Send-to-Studio actions resume', status: 'Pending' },
    ];
  }

  @Post('local-save')
  localSave(@Body() body: Record<string, unknown>) {
    return { snapshotId: this.state.id('snapshot'), input: body, saved: true, savedAt: this.state.now() };
  }

  @Get('checklist')
  checklist() {
    return [
      { title: 'Local autosave active', complete: true },
      { title: 'Offline editor enabled', complete: true },
      { title: 'Studio connector resume', complete: this.state.snapshot.studioBridge.connected },
      { title: 'Send queue preserved', complete: true },
      { title: 'Diagnostics available', complete: true },
    ];
  }
}
