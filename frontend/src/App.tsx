import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoader } from './components/RouteLoader';
import { pageRoutes } from './routes/pageRoutes';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {pageRoutes.map(({ id, path, Component }) => (
          <Route
            key={id}
            path={path}
            element={
              <ErrorBoundary resetKey={path}>
                <Suspense fallback={<RouteLoader />}>
                  <Component />
                </Suspense>
              </ErrorBoundary>
            }
          />
        ))}

        <Route path="materials" element={<Navigate to="/materials-shaders" replace />} />
        <Route path="interactive" element={<Navigate to="/interactive-effects" replace />} />
        <Route path="ai" element={<Navigate to="/ai-creator" replace />} />
        <Route path="library" element={<Navigate to="/resources" replace />} />
        <Route path="recovery" element={<Navigate to="/recovery-diagnostics" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
