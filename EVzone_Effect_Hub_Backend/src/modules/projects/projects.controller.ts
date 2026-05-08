import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddNoteDto, CreateProjectDto, CreateVersionDto, UpdateProjectDto } from '../../common/dto/base.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { EffectProject, ProjectStatus } from '../../common/types/domain.types';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly state: AppStateService) {}

  @Get()
  list(@Query() query: PaginationQueryDto, @Query('status') status?: string, @Query('category') category?: string) {
    const q = query.q?.toLowerCase().trim();
    let items = this.state.snapshot.projects;
    if (q) items = items.filter((p) => [p.name, p.type, p.category, p.status, ...p.tags].join(' ').toLowerCase().includes(q));
    if (status) items = items.filter((p) => p.status === status);
    if (category) items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    const start = (query.page - 1) * query.limit;
    return { items: items.slice(start, start + query.limit), total: items.length, page: query.page, limit: query.limit };
  }

  @Get('recent')
  recent() {
    return [...this.state.snapshot.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12);
  }

  @Get('drafts')
  drafts() {
    return this.state.snapshot.projects.filter((p) => p.status === 'draft');
  }

  @Get('live-ready')
  liveReady() {
    return this.state.snapshot.projects.filter((p) => p.status === 'live-ready');
  }

  @Get('autosaves')
  autosaves() {
    return this.state.snapshot.projects.map((p) => ({
      id: `autosave-${p.id}`,
      projectId: p.id,
      projectName: p.name,
      createdAt: p.updatedAt,
      recoverable: true,
      summary: 'Local autosave snapshot available.',
    }));
  }

  @Post()
  create(@Body() body: CreateProjectDto) {
    const now = this.state.now();
    const project: EffectProject = {
      id: this.state.id('proj'),
      name: body.name,
      type: body.type,
      category: body.category,
      status: 'draft',
      version: 'v0.1',
      tags: body.tags,
      description: body.description,
      createdAt: now,
      updatedAt: now,
      sizeBytes: 0,
      qualityScore: 70,
      studioStatus: 'not-sent',
      cameraTarget: body.cameraTarget,
      assets: [],
      versions: [
        { id: this.state.id('ver'), version: 'v0.1', notes: 'Initial project created.', createdAt: now, qualityScore: 70, sizeBytes: 0 },
      ],
      notes: [],
    };
    this.state.snapshot.projects.unshift(project);
    this.state.persist();
    return project;
  }

  @Post('wizard/create')
  createFromWizard(@Body() body: CreateProjectDto & Record<string, unknown>) {
    const project = this.create(body);
    return { project, wizard: body, nextRoute: '/editor' };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.requireProject(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    const project = this.requireProject(id);
    Object.assign(project, body, { updatedAt: this.state.now() });
    this.state.persist();
    return project;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const before = this.state.snapshot.projects.length;
    this.state.snapshot.projects = this.state.snapshot.projects.filter((p) => p.id !== id);
    this.state.persist();
    return { deleted: before !== this.state.snapshot.projects.length, id };
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    const original = this.requireProject(id);
    const copy: EffectProject = {
      ...original,
      id: this.state.id('proj'),
      name: `${original.name} Copy`,
      status: 'draft',
      studioStatus: 'not-sent',
      createdAt: this.state.now(),
      updatedAt: this.state.now(),
      assets: original.assets.map((asset) => ({ ...asset, id: this.state.id('asset') })),
      versions: original.versions.map((version) => ({ ...version, id: this.state.id('ver') })),
      notes: [],
    };
    this.state.snapshot.projects.unshift(copy);
    this.state.persist();
    return copy;
  }

  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.setStatus(id, 'archived');
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.setStatus(id, 'draft');
  }

  @Get(':id/assets')
  assets(@Param('id') id: string) {
    return this.requireProject(id).assets;
  }

  @Get(':id/notes')
  notes(@Param('id') id: string) {
    return this.requireProject(id).notes;
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: AddNoteDto) {
    const project = this.requireProject(id);
    const note = { id: this.state.id('note'), author: body.author, note: body.note, createdAt: this.state.now() };
    project.notes.unshift(note);
    project.updatedAt = this.state.now();
    this.state.persist();
    return note;
  }

  @Get(':id/versions')
  versions(@Param('id') id: string) {
    return this.requireProject(id).versions;
  }

  @Post(':id/versions')
  createVersion(@Param('id') id: string, @Body() body: CreateVersionDto) {
    const project = this.requireProject(id);
    const nextNumber = project.versions.length + 1;
    const version = {
      id: this.state.id('ver'),
      version: `v${nextNumber}.0`,
      notes: body.notes,
      createdAt: this.state.now(),
      qualityScore: body.qualityScore,
      sizeBytes: project.sizeBytes,
    };
    project.versions.unshift(version);
    project.updatedAt = this.state.now();
    this.state.persist();
    return version;
  }

  @Post(':id/versions/:versionId/restore')
  restoreVersion(@Param('id') id: string, @Param('versionId') versionId: string) {
    const project = this.requireProject(id);
    const version = project.versions.find((v) => v.id === versionId);
    if (!version) throw new NotFoundException('Version not found');
    project.version = version.version;
    project.qualityScore = version.qualityScore;
    project.sizeBytes = version.sizeBytes;
    project.updatedAt = this.state.now();
    this.state.persist();
    return { project, restoredVersion: version };
  }

  @Get(':id/versions/compare/:fromVersionId/:toVersionId')
  compareVersions(@Param('id') id: string, @Param('fromVersionId') fromVersionId: string, @Param('toVersionId') toVersionId: string) {
    const project = this.requireProject(id);
    const from = project.versions.find((v) => v.id === fromVersionId);
    const to = project.versions.find((v) => v.id === toVersionId);
    if (!from || !to) throw new NotFoundException('One or both versions were not found');
    return {
      projectId: id,
      from,
      to,
      delta: {
        qualityScore: to.qualityScore - from.qualityScore,
        sizeBytes: to.sizeBytes - from.sizeBytes,
        notes: `${from.notes} → ${to.notes}`,
      },
    };
  }

  private setStatus(id: string, status: ProjectStatus) {
    const project = this.requireProject(id);
    project.status = status;
    project.updatedAt = this.state.now();
    this.state.persist();
    return project;
  }

  private requireProject(id: string) {
    const project = this.state.snapshot.projects.find((p) => p.id === id);
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }
}
