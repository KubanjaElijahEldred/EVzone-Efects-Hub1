import React from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';

type ErrorBoundaryProps = React.PropsWithChildren<{
  resetKey?: string;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  lastResetKey?: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, lastResetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.lastResetKey) {
      return { hasError: false, error: undefined, lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('EVzone Effect Hub page error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box sx={{ minHeight: '70vh', p: { xs: 2, md: 4 }, display: 'grid', placeItems: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 760,
            p: { xs: 3, md: 5 },
            borderRadius: '28px',
            border: '1px solid rgba(148,163,184,.22)',
            background: 'rgba(255,255,255,.92)',
          }}
        >
          <Typography sx={{ color: '#f77f00', fontSize: 12, fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            Page recovery
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 950, letterSpacing: '-.05em' }}>
            This page hit a recoverable error.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 3 }}>
            {this.state.error?.message || 'Unknown page error'}
          </Alert>
          <Typography sx={{ color: '#667085', mb: 3 }}>
            Your EVzone project and local workspace are still safe. Reload this page or return to the Effect Creator Home.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => window.location.assign('/')}>
              Return Home
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
}
