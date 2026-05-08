import Dexie, { type Table } from 'dexie';
import { ApiClientError, evzoneApi } from './apiClient';

export type LocalEffectProject = {
  id: string;
  name: string;
  type: string;
  category?: string;
  status: 'draft' | 'live-ready' | 'imported-to-studio' | 'archived' | 'needs-review';
  updatedAt: string;
  createdAt?: string;
  description?: string;
  tags?: string[];
  sizeBytes?: number;
  qualityScore?: number;
};

type ProjectListResponse = {
  items: LocalEffectProject[];
  total: number;
  page: number;
  limit: number;
};

class EVzoneProjectDatabase extends Dexie {
  projects!: Table<LocalEffectProject, string>;

  constructor() {
    super('evzone-effect-hub');
    this.version(1).stores({
      projects: 'id, name, type, status, updatedAt',
    });
  }
}

export const projectDatabase = new EVzoneProjectDatabase();

export async function upsertProject(project: LocalEffectProject) {
  await projectDatabase.projects.put(project);

  try {
    const remoteProject = project.id
      ? await updateRemoteProject(project)
      : await createRemoteProject(project);

    await projectDatabase.projects.put(remoteProject);
    return remoteProject;
  } catch {
    return project;
  }
}

export async function listProjects() {
  try {
    const response = await evzoneApi<ProjectListResponse | LocalEffectProject[]>('/projects', {
      query: { limit: 100 },
    });
    const projects = Array.isArray(response) ? response : response.items;
    await projectDatabase.projects.bulkPut(projects);
    return projects;
  } catch {
    return projectDatabase.projects.orderBy('updatedAt').reverse().toArray();
  }
}

export async function getProject(projectId: string) {
  try {
    const project = await evzoneApi<LocalEffectProject>(`/projects/${encodeURIComponent(projectId)}`);
    await projectDatabase.projects.put(project);
    return project;
  } catch {
    return projectDatabase.projects.get(projectId);
  }
}

export async function archiveProject(projectId: string) {
  const project = await evzoneApi<LocalEffectProject>(`/projects/${encodeURIComponent(projectId)}/archive`, {
    method: 'POST',
  });
  await projectDatabase.projects.put(project);
  return project;
}

async function updateRemoteProject(project: LocalEffectProject) {
  try {
    return await evzoneApi<LocalEffectProject>(`/projects/${encodeURIComponent(project.id)}`, {
      method: 'PATCH',
      body: project,
    });
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return createRemoteProject(project);
    }
    throw error;
  }
}

async function createRemoteProject(project: LocalEffectProject) {
  return evzoneApi<LocalEffectProject>('/projects', {
    method: 'POST',
    body: {
      name: project.name,
      type: project.type,
      category: project.category,
      tags: project.tags ?? [],
      description: project.description,
    },
  });
}
