import { useEffect } from 'react';
import { Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useQuery } from '@tanstack/react-query';
import { studioBridge } from '../services/studioBridge';
import { useEffectHubStore } from '../store/useEffectHubStore';

export function StudioStatusBadge() {
  const setStudioConnected = useEffectHubStore((state) => state.setStudioConnected);
  const { data, isError, isFetching } = useQuery({
    queryKey: ['evzone', 'studio-bridge', 'status'],
    queryFn: () => studioBridge.getStatus(),
    refetchInterval: 15_000,
    retry: 1,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (typeof data?.connected === 'boolean') {
      setStudioConnected(data.connected);
      return;
    }
    if (isError) setStudioConnected(false);
  }, [data?.connected, isError, setStudioConnected]);

  const connected = Boolean(data?.connected);
  const chipColor: 'primary' | 'warning' | 'default' = isError ? 'warning' : connected ? 'primary' : 'default';
  const dotColor = isError ? 'warning.main' : connected ? 'primary.main' : 'text.secondary';
  const label = isError
    ? 'EVzone Backend Offline'
    : connected
      ? 'EVzone Studio Connected'
      : isFetching
        ? 'Checking Studio Bridge'
        : 'Studio Bridge Disconnected';

  return (
    <Chip
      icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
      label={label}
      color={chipColor}
      variant="outlined"
      sx={{
        borderRadius: 999,
        fontWeight: 900,
        bgcolor: 'rgba(3,205,140,0.08)',
        '& .MuiChip-icon': { color: dotColor },
      }}
    />
  );
}
