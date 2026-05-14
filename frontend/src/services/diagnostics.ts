import { evzoneApi } from './apiClient';

export type DiagnosticEntry = {
  id: string;
  level: 'info' | 'warning' | 'critical' | 'recoverable';
  source: string;
  message: string;
  createdAt: string;
};

const diagnostics: DiagnosticEntry[] = [];

export function addDiagnostic(entry: Omit<DiagnosticEntry, 'id' | 'createdAt'>) {
  const diagnostic: DiagnosticEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  diagnostics.unshift(diagnostic);
  void evzoneApi<DiagnosticEntry>('/recovery/diagnostics', {
    method: 'POST',
    body: entry,
  }).catch(() => undefined);
  return diagnostic;
}

export function getDiagnostics() {
  return [...diagnostics];
}

export async function fetchDiagnostics() {
  try {
    const remoteDiagnostics = await evzoneApi<DiagnosticEntry[]>('/recovery/logs');
    return remoteDiagnostics.length ? remoteDiagnostics : getDiagnostics();
  } catch {
    return getDiagnostics();
  }
}

export function createDiagnosticPackage() {
  const diagnosticPackage = {
    createdAt: new Date().toISOString(),
    app: 'EVzone Effect Hub',
    diagnostics: getDiagnostics(),
    environment: {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    },
  };

  void evzoneApi('/recovery/support-package', {
    method: 'POST',
    body: diagnosticPackage,
  }).catch(() => undefined);

  return diagnosticPackage;
}
