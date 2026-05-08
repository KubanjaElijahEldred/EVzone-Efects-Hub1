import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudioEventDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Studio Bridge')
@Controller('studio-bridge')
export class StudioBridgeController {
  constructor(private readonly state: AppStateService) {}

  @Get('status')
  status() {
    return this.state.snapshot.studioBridge;
  }

  @Post('connect')
  connect() {
    this.state.snapshot.studioBridge.connected = true;
    this.state.snapshot.studioBridge.status = 'connected';
    this.state.snapshot.studioBridge.lastHeartbeatAt = this.state.now();
    this.state.persist();
    return this.state.snapshot.studioBridge;
  }

  @Post('reconnect')
  reconnect() {
    return this.connect();
  }

  @Post('disconnect')
  disconnect() {
    this.state.snapshot.studioBridge.connected = false;
    this.state.snapshot.studioBridge.status = 'disconnected';
    this.state.persist();
    return this.state.snapshot.studioBridge;
  }

  @Get('diagnostics')
  diagnostics() {
    return {
      bridge: this.state.snapshot.studioBridge,
      logs: this.state.snapshot.diagnostics.filter((entry) => entry.source.toLowerCase().includes('bridge')),
      checks: ['heartbeat', 'runtime-limits', 'scene-targets', 'camera-bindings', 'overlay-bindings'],
    };
  }

  @Get('runtime-limits')
  runtimeLimits() {
    return this.state.snapshot.studioBridge.runtimeLimits;
  }

  @Get('scenes')
  scenes() {
    return this.state.snapshot.studioBridge.scenes;
  }

  @Get('cameras')
  cameras() {
    return this.state.snapshot.studioBridge.cameras;
  }

  @Get('overlays')
  overlays() {
    return this.state.snapshot.studioBridge.overlays;
  }

  @Post('events')
  event(@Body() body: StudioEventDto) {
    const entry = this.state.addDiagnostic({
      level: 'info',
      source: 'Studio Bridge Event',
      message: `${body.type}: ${JSON.stringify(body.payload ?? {})}`,
    });
    return { accepted: true, event: body, diagnostic: entry };
  }
}
