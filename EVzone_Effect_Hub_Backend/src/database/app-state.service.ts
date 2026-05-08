import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import type { AppState, DiagnosticEntry } from '../common/types/domain.types';
import { createSeedState } from './seed-data';

@Injectable()
export class AppStateService implements OnModuleInit {
  private readonly logger = new Logger(AppStateService.name);
  private state!: AppState;
  private dataFile!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.dataFile = resolve(process.cwd(), this.config.get<string>('EVZONE_DATA_FILE') || './data/evzone-effect-hub-backend.json');
    this.load();
  }

  get snapshot(): AppState {
    return this.state;
  }

  now(): string {
    return new Date().toISOString();
  }

  id(prefix: string): string {
    return `${prefix}-${randomUUID()}`;
  }

  load() {
    try {
      if (existsSync(this.dataFile)) {
        this.state = JSON.parse(readFileSync(this.dataFile, 'utf8')) as AppState;
      } else {
        this.state = createSeedState();
        this.persist();
      }
      this.logger.log(`EVzone backend state loaded from ${this.dataFile}`);
    } catch (error) {
      this.logger.warn(`Failed to load state file. Using seed state. ${(error as Error).message}`);
      this.state = createSeedState();
      this.persist();
    }
  }

  persist() {
    mkdirSync(dirname(this.dataFile), { recursive: true });
    writeFileSync(this.dataFile, JSON.stringify(this.state, null, 2), 'utf8');
  }

  addDiagnostic(entry: Omit<DiagnosticEntry, 'id' | 'createdAt'>): DiagnosticEntry {
    const diagnostic: DiagnosticEntry = { id: this.id('diag'), createdAt: this.now(), ...entry };
    this.state.diagnostics.unshift(diagnostic);
    this.state.admin.logs.unshift(diagnostic);
    this.persist();
    return diagnostic;
  }

  search(q = '', scope = 'all') {
    const query = q.trim().toLowerCase();
    const normalizedScope = scope.trim().toLowerCase();
    const includeProjects = normalizedScope === 'all' || normalizedScope === 'projects';
    const includeResources = normalizedScope === 'all' || normalizedScope === 'resources' || normalizedScope === 'resource-library';
    const includeRoutes = normalizedScope === 'all' || normalizedScope === 'routes' || normalizedScope === 'pages';
    const results: Array<Record<string, unknown>> = [];
    if (includeProjects) {
      results.push(
        ...this.state.projects
          .filter((p) => !query || [p.name, p.type, p.category, p.status, ...p.tags].join(' ').toLowerCase().includes(query))
          .map((p) => ({ type: 'project', id: p.id, title: p.name, category: p.category, status: p.status, path: `/projects/${p.id}` })),
      );
    }
    if (includeResources) {
      results.push(
        ...this.state.resources
          .filter((r) => !query || [r.title, r.category, r.type, r.difficulty, ...r.tags].join(' ').toLowerCase().includes(query))
          .map((r) => ({ type: 'resource', id: r.id, title: r.title, category: r.category, status: 'free', path: `/resources/${r.id}` })),
      );
    }
    if (includeRoutes) {
      results.push(
        ...this.state.routes
          .filter((r) => !query || [r.title, r.shortTitle, r.group, r.description].join(' ').toLowerCase().includes(query))
          .map((r) => ({ type: 'route', id: r.id, title: r.title, category: r.group, path: r.path })),
      );
    }
    return results;
  }
}
