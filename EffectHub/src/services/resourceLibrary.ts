import { evzoneApi } from './apiClient';

export type FreeResource = {
  id: string;
  title: string;
  category: string;
  type?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Studio Pro';
  compatibleWithStudio: boolean;
  tags?: string[];
  description?: string;
  licenseNote?: string;
  featured?: boolean;
  createdAt?: string;
};

export const starterResources: FreeResource[] = [
  { id: 'premium-host-intro', title: 'Premium Host Intro Template', category: 'Template', difficulty: 'Beginner', compatibleWithStudio: true },
  { id: 'evzone-confetti', title: 'EVzone Confetti Burst', category: 'VFX', difficulty: 'Beginner', compatibleWithStudio: true },
  { id: 'studio-controls', title: 'Studio Control Surface Presets', category: 'Studio Controls', difficulty: 'Studio Pro', compatibleWithStudio: true },
];

export function searchStarterResources(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return starterResources;
  return starterResources.filter((resource) => [resource.title, resource.category, resource.difficulty].join(' ').toLowerCase().includes(q));
}

export async function searchResources(query: string) {
  try {
    return await evzoneApi<FreeResource[]>('/resources', { query: { q: query } });
  } catch {
    return searchStarterResources(query);
  }
}

export async function listFeaturedResources() {
  try {
    return await evzoneApi<FreeResource[]>('/resources/featured');
  } catch {
    return starterResources.filter((resource) => resource.compatibleWithStudio);
  }
}

export async function importResource(resourceId: string, projectId?: string) {
  return evzoneApi<{ imported: boolean; resource: FreeResource; projectId: string | null; addedAt: string; message: string }>(
    `/resources/${encodeURIComponent(resourceId)}/import`,
    {
      method: 'POST',
      body: { projectId },
    },
  );
}
