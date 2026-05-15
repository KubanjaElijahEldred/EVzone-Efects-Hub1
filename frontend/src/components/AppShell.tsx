import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import { pageGroups, pageRoutes } from '../routes/pageRoutes';
import { StudioStatusBadge } from './StudioStatusBadge';
import { evzoneColors } from '../theme/colors';
import { useEffectHubStore } from '../store/useEffectHubStore';
import { toast } from 'sonner';

const DRAWER_WIDTH = 326;
const SIDEBAR_CONTENT_GAP = 0;
const HIDDEN_NAV_ROUTE_IDS = new Set(['new-project', 'recovery-diagnostics', 'maintenance', 'missing']);
const ROUTE_ICON_BY_ID: Record<string, typeof HomeRoundedIcon> = {
  home: HomeRoundedIcon,
  'studio-connection': SensorsRoundedIcon,
  projects: FolderCopyRoundedIcon,
  'new-project': AddCircleOutlineRoundedIcon,
  editor: DashboardCustomizeRoundedIcon,
  'snap-lens-studio': CameraAltRoundedIcon,
  tracking: CenterFocusStrongRoundedIcon,
  'visual-logic': AccountTreeRoundedIcon,
  developer: TerminalRoundedIcon,
  'materials-shaders': PaletteRoundedIcon,
  'vfx-motion': AutoFixHighRoundedIcon,
  'interactive-effects': SportsEsportsRoundedIcon,
  'ai-creator': PsychologyAltRoundedIcon,
  resources: Inventory2RoundedIcon,
  'preview-quality': FactCheckRoundedIcon,
  'studio-integration': HubRoundedIcon,
  'send-to-studio': SendRoundedIcon,
  learning: SchoolRoundedIcon,
  insights: InsightsRoundedIcon,
  settings: SettingsRoundedIcon,
  'internal-admin': AdminPanelSettingsRoundedIcon,
  'recovery-diagnostics': HealthAndSafetyRoundedIcon,
  maintenance: BuildCircleRoundedIcon,
  missing: ErrorOutlineRoundedIcon,
};

function resolveAutowirePath(rawLabel: string): string | null {
  const label = rawLabel.toLowerCase();

  if (label.includes('home')) return '/';
  if (label.includes('project') || label.includes('draft') || label.includes('version')) return '/projects';
  if (label.includes('template') || label.includes('resource') || label.includes('library')) return '/resources';
  if (label.includes('new effect') || label.includes('create effect')) return '/new-project';
  if (label.includes('editor') || label.includes('apply to editor')) return '/editor';
  if (label.includes('tracking')) return '/tracking';
  if (label.includes('logic')) return '/visual-logic';
  if (label.includes('developer') || label.includes('script') || label.includes('sdk')) return '/developer';
  if (label.includes('material') || label.includes('shader')) return '/materials-shaders';
  if (label.includes('vfx') || label.includes('motion') || label.includes('particle')) return '/vfx-motion';
  if (label.includes('interactive') || label.includes('quiz') || label.includes('poll') || label.includes('game')) return '/interactive-effects';
  if (label.includes('ai')) return '/ai-creator';
  if (label.includes('preview') || label.includes('quality') || label.includes('report')) return '/preview-quality';
  if (label.includes('studio integration') || label.includes('sync to studio')) return '/studio-integration';
  if (label.includes('send to studio') || label.includes('open studio')) return '/send-to-studio';
  if (label.includes('bridge') || label.includes('readiness')) return '/studio-connection';
  if (label.includes('learning') || label.includes('docs') || label.includes('lesson')) return '/learning';
  if (label.includes('insight') || label.includes('analytics')) return '/insights';
  if (label.includes('setting')) return '/settings';
  if (label.includes('internal admin') || label.includes('admin')) return '/internal-admin';
  if (label.includes('recovery') || label.includes('diagnostic')) return '/recovery-diagnostics';
  if (label.includes('maintenance')) return '/maintenance';

  return null;
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const isDark = theme.palette.mode === 'dark';
  const themeMode = useEffectHubStore((state) => state.themeMode);
  const setThemeMode = useEffectHubStore((state) => state.setThemeMode);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest('button[data-evz-autowire="1"]') as HTMLButtonElement | null;
      if (!button) return;
      if (button.disabled || button.getAttribute('aria-disabled') === 'true') return;

      const label = (button.textContent ?? '').replace(/\s+/g, ' ').trim() || 'Action';
      const path = resolveAutowirePath(label);

      if (path) {
        if (location.pathname !== path) navigate(path);
        toast.success(`Opened: ${label}`);
        return;
      }

      toast.message(`Action ready: ${label}`);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [location.pathname, navigate]);

  const visibleRoutes = useMemo(
    () => pageRoutes.filter((route) => !HIDDEN_NAV_ROUTE_IDS.has(route.id)),
    [],
  );

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return visibleRoutes;
    return visibleRoutes.filter((route) =>
      [route.title, route.shortTitle, route.group, route.description, route.number]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search, visibleRoutes]);

  const currentRoute = useMemo(() => {
    return pageRoutes.find(r => r.path === location.pathname) || pageRoutes[0];
  }, [location.pathname]);

  const drawer = (
    <Box height="100%" display="flex" flexDirection="column" className="evzone-shell-gradient">
      <Box px={2.25} py={2.25} display="flex" alignItems="center" justifyContent="space-between">
        <Box mb={0}>
          <Box
            component="img"
            src="/assets/EV Zone EffectHub Logo (Landscape).png"
            alt="EVzone Effect Hub"
            sx={{
              display: 'block',
              width: '100%',
              maxWidth: 180,
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
        {!isDesktop && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Box>

      <Box px={2.25} mb={2}>
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
          size="small"
          placeholder="Search pages..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: isDark ? 'rgba(15,23,42,0.62)' : 'rgba(255,255,255,0.86)',
              borderRadius: 3,
            },
          }}
        />
      </Box>

      <Divider />

      <Box flex={1} overflow="auto" px={1.25} py={1.25}>
        {pageGroups.map((group) => {
          const groupRoutes = filteredRoutes.filter((route) => route.group === group);
          if (!groupRoutes.length) return null;
          return (
            <Box key={group} mb={1.5}>
              <Typography
                variant="overline"
                color="secondary"
                fontWeight={950}
                letterSpacing="0.14em"
                px={1.25}
              >
                {group}
              </Typography>
              <List dense disablePadding>
                {groupRoutes.map((route) => (
                  <ListItemButton
                    key={route.id}
                    component={NavLink}
                    to={route.path}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      my: 0.35,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(116,145,184,0.18)' : 'transparent',
                      bgcolor: isDark ? 'rgba(21,37,62,0.48)' : 'transparent',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(26,45,74,0.62)' : 'rgba(3,205,140,0.06)',
                      },
                      '&.active': {
                        bgcolor: isDark ? 'rgba(3,205,140,0.16)' : 'rgba(3,205,140,0.10)',
                        borderColor: isDark ? 'rgba(3,205,140,0.36)' : 'rgba(3,205,140,0.22)',
                        color: 'primary.main',
                        '& .MuiListItemText-secondary': { color: 'text.secondary' },
                      },
                    }}
                  >
                    {(() => {
                      const RouteIcon = ROUTE_ICON_BY_ID[route.id] ?? AutoAwesomeRoundedIcon;
                      return (
                        <Box
                          width={34}
                          height={34}
                          flex="0 0 34px"
                          borderRadius="12px"
                          display="grid"
                          mr={1.1}
                          sx={{
                            placeItems: 'center',
                            color: 'white',
                            background: evzoneColors.green,
                            boxShadow: '0 10px 18px rgba(3,205,140,0.18)',
                          }}
                        >
                          <RouteIcon sx={{ fontSize: 22 }} />
                        </Box>
                      );
                    })()}
                    <ListItemText
                      primary={route.shortTitle}
                      primaryTypographyProps={{ fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          );
        })}
      </Box>

      <Box p={2}>
        <Box className="evzone-glass" borderRadius="18px" p={1.5} display="grid" gap={1.1}>
          <StudioStatusBadge />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
            <Box minWidth={0}>
              <Typography variant="caption" color="secondary" fontWeight={950} letterSpacing="0.12em">
                THEME
              </Typography>
              <Typography variant="body2" fontWeight={900}>
                {themeMode === 'dark' ? 'Premium Dark Mode' : 'Premium Light Mode'}
              </Typography>
            </Box>
            <IconButton
              aria-label="Toggle theme"
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: isDark ? 'rgba(15,23,42,0.58)' : 'rgba(255,255,255,0.88)',
              }}
            >
              {themeMode === 'dark' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box minHeight="100vh" width="100%" overflow="clip" className="evzone-shell-gradient">
      {!isDesktop ? (
        <>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 72,
              zIndex: (muiTheme) => muiTheme.zIndex.drawer + 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              bgcolor: isDark ? 'rgba(10,18,30,0.92)' : 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid',
              borderColor: 'divider',
              pb: 'env(safe-area-inset-bottom)',
            }}
          >
            {[
              { id: 'home', icon: HomeRoundedIcon, label: 'Home', path: '/' },
              { id: 'projects', icon: FolderCopyRoundedIcon, label: 'Projects', path: '/projects' },
              { id: 'editor', icon: DashboardCustomizeRoundedIcon, label: 'Editor', path: '/editor' },
              { id: 'ai-creator', icon: PsychologyAltRoundedIcon, label: 'AI', path: '/ai-creator' },
              { id: 'settings', icon: SettingsRoundedIcon, label: 'Settings', path: '/settings' },
            ].map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Box
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:active': { transform: 'scale(0.92)' },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '14px',
                      bgcolor: isActive ? 'rgba(3,205,140,0.12)' : 'transparent',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={isActive ? 900 : 700} fontSize={10}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </>
      ) : null}

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? '#0b1628' : '#f2f2f2',
              backgroundImage: 'none',
              backdropFilter: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: Math.min(DRAWER_WIDTH, 340),
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? '#0b1628' : '#f2f2f2',
              backgroundImage: 'none',
              backdropFilter: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        ref={mainRef}
        component="main"
        className="evzone-page-frame"
        sx={{
          ml: { lg: `${DRAWER_WIDTH + SIDEBAR_CONTENT_GAP}px` },
          mt: { xs: 0, lg: 0 },
          mb: { xs: 9, lg: 0 },
          minHeight: '100vh',
          width: { lg: `calc(100% - ${DRAWER_WIDTH + SIDEBAR_CONTENT_GAP}px)` },
          maxWidth: { lg: `calc(100% - ${DRAWER_WIDTH + SIDEBAR_CONTENT_GAP}px)` },
          overflowX: 'clip',
          position: 'relative',
        }}
      >
        <Box className="evzone-route-content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
