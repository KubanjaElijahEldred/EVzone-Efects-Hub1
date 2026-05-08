import { Box, CircularProgress, Typography } from '@mui/material';

export function RouteLoader() {
  return (
    <Box
      minHeight="55vh"
      display="grid"
      sx={{ placeItems: 'center' }}
      className="evzone-shell-gradient"
    >
      <Box textAlign="center" className="evzone-glass" borderRadius="28px" px={4} py={4}>
        <CircularProgress color="primary" />
        <Typography variant="h6" mt={2} fontWeight={900}>
          Loading EVzone Effect Hub
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.75}>
          Preparing the creator workspace...
        </Typography>
      </Box>
    </Box>
  );
}
