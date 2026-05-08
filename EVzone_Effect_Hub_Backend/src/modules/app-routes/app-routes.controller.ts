import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('App Routes')
@Controller('routes')
export class AppRoutesController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  list() {
    return this.state.snapshot.routes;
  }

  @Get('groups')
  groups() {
    const groups = [...new Set(this.state.snapshot.routes.map((route) => route.group))];
    return groups.map((group) => ({ group, routes: this.state.snapshot.routes.filter((route) => route.group === group) }));
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.state.snapshot.routes.find((route) => route.id === id || route.path === id || route.shortTitle.toLowerCase() === id.toLowerCase()) ?? null;
  }
}
