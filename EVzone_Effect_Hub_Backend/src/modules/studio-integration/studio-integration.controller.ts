import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudioBindingDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Studio Integration Center')
@Controller('studio-integration')
export class StudioIntegrationController {
  constructor(private readonly state: AppStateService) {}

  @Get('status')
  status() {
    return {
      bridge: this.state.snapshot.studioBridge,
      bindings: this.state.snapshot.studioBindings,
      assetSync: 'ready',
      updateSync: 'current',
    };
  }

  @Get('bindings/:projectId')
  getBinding(@Param('projectId') projectId: string) {
    return (
      this.state.snapshot.studioBindings.find((binding) => binding.projectId === projectId) ?? {
        projectId,
        scene: 'Morning Show',
        camera: 'Host Camera',
        overlayLayer: 'Lower Third',
        trigger: 'Scene Change + Studio Button',
        controlSurface: 'EVzone Operator Surface A',
        fallbackMode: 'Keep overlay, disable heavy VFX',
        emergencyDisable: false,
        updatedAt: this.state.now(),
      }
    );
  }

  @Put('bindings/:projectId')
  upsertBinding(@Param('projectId') projectId: string, @Body() body: StudioBindingDto) {
    let binding = this.state.snapshot.studioBindings.find((item) => item.projectId === projectId);
    if (!binding) {
      binding = { projectId, ...body, updatedAt: this.state.now() };
      this.state.snapshot.studioBindings.unshift(binding);
    } else {
      Object.assign(binding, body, { updatedAt: this.state.now() });
    }
    this.state.persist();
    return binding;
  }

  @Post('triggers')
  trigger(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('trigger'), ...body, status: 'mapped', createdAt: this.state.now() };
  }

  @Get('control-surface/:projectId')
  controlSurface(@Param('projectId') projectId: string) {
    return {
      projectId,
      controls: [
        { label: 'Start Effect', type: 'Button', binding: 'Control Surface A1' },
        { label: 'Show Overlay', type: 'Toggle', binding: 'Control Surface A2' },
        { label: 'VFX Intensity', type: 'Slider', binding: 'Control Surface S1' },
        { label: 'Emergency Disable', type: 'Protected Button', binding: 'Shift + 2' },
      ],
    };
  }

  @Put('control-surface/:projectId')
  saveControlSurface(@Param('projectId') projectId: string, @Body() body: Record<string, unknown>) {
    return { projectId, ...body, savedAt: this.state.now(), status: 'saved' };
  }

  @Post('sync-assets')
  syncAssets(@Body() body: Record<string, unknown>) {
    return { syncId: this.state.id('asset-sync'), input: body, status: 'synced', assetsSynced: 5, createdAt: this.state.now() };
  }

  @Post('live-preview')
  livePreview(@Body() body: Record<string, unknown>) {
    return { previewId: this.state.id('studio-preview'), input: body, status: 'running', fps: 59.2, createdAt: this.state.now() };
  }

  @Post('emergency-disable')
  emergencyDisable(@Body() body: Record<string, unknown>) {
    return { armed: true, disabled: Boolean(body.disabled), changedAt: this.state.now(), message: 'Emergency disable state updated.' };
  }
}
