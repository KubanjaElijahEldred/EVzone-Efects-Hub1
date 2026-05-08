import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceActionDto } from '../../common/dto/base.dto';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Free Resource Library')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  list(@Query('q') q?: string, @Query('category') category?: string, @Query('difficulty') difficulty?: string) {
    const query = q?.toLowerCase().trim();
    return this.state.snapshot.resources.filter((resource) => {
      const searchMatch = !query || [resource.title, resource.category, resource.type, resource.difficulty, ...resource.tags].join(' ').toLowerCase().includes(query);
      const categoryMatch = !category || resource.category.toLowerCase() === category.toLowerCase();
      const difficultyMatch = !difficulty || resource.difficulty.toLowerCase() === difficulty.toLowerCase();
      return searchMatch && categoryMatch && difficultyMatch;
    });
  }

  @Get('featured')
  featured() {
    return this.state.snapshot.resources.filter((resource) => resource.featured);
  }

  @Get('categories')
  categories() {
    return [...new Set(this.state.snapshot.resources.map((resource) => resource.category))];
  }

  @Get(':id')
  get(@Param('id') id: string) {
    const resource = this.state.snapshot.resources.find((item) => item.id === id);
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  @Post(':id/import')
  importResource(@Param('id') id: string, @Body() body: ResourceActionDto) {
    const resource = this.get(id);
    return {
      imported: true,
      resource,
      projectId: body.projectId ?? null,
      addedAt: this.state.now(),
      message: 'Resource imported into local EVzone creator workspace.',
    };
  }

  @Post(':id/remix')
  remixResource(@Param('id') id: string, @Body() body: ResourceActionDto) {
    const resource = this.get(id);
    return {
      remix: true,
      resource,
      projectId: body.projectId ?? null,
      newProjectSuggestion: `${resource.title} Remix`,
      route: '/new-project',
    };
  }
}
