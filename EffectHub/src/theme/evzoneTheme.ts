import { createTheme } from '@mui/material/styles';
import { evzoneColors } from './colors';

export type EvzoneThemeMode = 'light' | 'dark';

export function createEvzoneTheme(mode: EvzoneThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: evzoneColors.green,
        contrastText: evzoneColors.white,
      },
      secondary: {
        main: evzoneColors.orange,
        contrastText: evzoneColors.white,
      },
      grey: {
        100: evzoneColors.lightGrey,
        500: evzoneColors.mediumGrey,
      },
      background: {
        default: isDark ? '#0b1628' : '#fbfefd',
        paper: isDark ? 'rgba(21,37,62,0.92)' : 'rgba(255,255,255,0.92)',
      },
      text: {
        primary: isDark ? '#e5edf9' : evzoneColors.ink,
        secondary: isDark ? '#a8b6ca' : evzoneColors.muted,
      },
      divider: isDark ? 'rgba(116,145,184,0.34)' : 'rgba(148,163,184,0.2)',
    },
    typography: {
      fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(','),
      h1: { fontWeight: 900, letterSpacing: '-0.045em' },
      h2: { fontWeight: 900, letterSpacing: '-0.035em' },
      h3: { fontWeight: 900, letterSpacing: '-0.03em' },
      button: { fontWeight: 800, textTransform: 'none' },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}

export const evzoneTheme = createEvzoneTheme('light');
