import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import { createEvzoneTheme } from './theme/evzoneTheme';
import { useEffectHubStore } from './store/useEffectHubStore';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RootApp() {
  const themeMode = useEffectHubStore((state) => state.themeMode);
  const theme = useMemo(() => createEvzoneTheme(themeMode), [themeMode]);

  useEffect(() => {
    document.documentElement.dataset.evzTheme = themeMode;
    document.body.dataset.evzTheme = themeMode;
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
        <Toaster richColors closeButton position="bottom-right" theme={themeMode} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  </React.StrictMode>,
);
