import type { PageGroup } from '../routes/pageRoutes';

type PageDesign = 'wave' | 'tiles' | 'rings' | 'ribbon';

type PageDesignBackdropProps = {
  routeId: string;
  group: PageGroup;
};

const DESIGN_BY_ROUTE: Record<string, PageDesign> = {
  home: 'wave',
  'studio-connection': 'ribbon',
  projects: 'tiles',
  'new-project': 'tiles',
  editor: 'wave',
  'snap-lens-studio': 'rings',
  tracking: 'rings',
  'visual-logic': 'tiles',
  developer: 'wave',
  'materials-shaders': 'ribbon',
  'vfx-motion': 'rings',
  'interactive-effects': 'tiles',
  'ai-creator': 'wave',
  resources: 'tiles',
  'preview-quality': 'rings',
  'studio-integration': 'ribbon',
  'send-to-studio': 'ribbon',
  learning: 'tiles',
  insights: 'rings',
  settings: 'ribbon',
  'internal-admin': 'wave',
  'recovery-diagnostics': 'ribbon',
  maintenance: 'ribbon',
  missing: 'wave',
};

const DESIGN_BY_GROUP: Record<PageGroup, PageDesign> = {
  Start: 'wave',
  Creation: 'tiles',
  Labs: 'rings',
  Studio: 'ribbon',
  Resources: 'tiles',
  Quality: 'rings',
  System: 'ribbon',
};

export function PageDesignBackdrop({ routeId, group }: PageDesignBackdropProps) {
  const design = DESIGN_BY_ROUTE[routeId] ?? DESIGN_BY_GROUP[group] ?? 'wave';

  return (
    <div
      className={`evz-page-design evz-page-design--${design}`}
      data-route={routeId}
      aria-hidden="true"
    >
      <span className="evz-design-plane evz-design-plane-a" />
      <span className="evz-design-plane evz-design-plane-b" />
      <span className="evz-design-plane evz-design-plane-c" />
      <span className="evz-design-line evz-design-line-a" />
      <span className="evz-design-line evz-design-line-b" />
      <span className="evz-design-circle evz-design-circle-a" />
      <span className="evz-design-circle evz-design-circle-b" />
      <span className="evz-design-circle evz-design-circle-c" />
    </div>
  );
}
