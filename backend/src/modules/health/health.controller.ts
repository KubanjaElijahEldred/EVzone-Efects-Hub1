import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EVZONE_BRAND, EVZONE_COLORS } from '../../common/constants/evzone-colors';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly state: AppStateService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      product: EVZONE_BRAND.product,
      studio: EVZONE_BRAND.studio,
      uptimeSeconds: process.uptime(),
      palette: EVZONE_COLORS,
      noAuth: true,
      noBilling: true,
      noMarketplace: true,
    };
  }

  @Get('health/liveness')
  liveness() {
    return { status: 'alive', timestamp: this.state.now() };
  }

  @Get('health/readiness')
  readiness() {
    const bridge = this.state.snapshot.studioBridge;
    return {
      status: bridge.connected ? 'ready' : 'degraded',
      bridge,
      projects: this.state.snapshot.projects.length,
      resources: this.state.snapshot.resources.length,
    };
  }

  @Get('health/palette')
  palette() {
    return EVZONE_BRAND;
  }
}
