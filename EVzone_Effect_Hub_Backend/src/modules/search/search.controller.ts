import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchQueryDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Global Search')
@Controller('search')
export class SearchController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  search(@Query() query: SearchQueryDto) {
    return this.state.search(query.q ?? '', query.scope ?? 'all');
  }

  @Get('404')
  missingPageSearch(@Query() query: SearchQueryDto) {
    return {
      message: 'Safe 404 recovery search results',
      home: '/',
      openStudio: '/studio-connection',
      recovery: '/recovery-diagnostics',
      results: this.state.search(query.q ?? '', query.scope ?? 'all'),
    };
  }
}
