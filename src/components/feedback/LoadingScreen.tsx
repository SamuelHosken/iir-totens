import { Box, CircularProgress } from '@mui/material';

export function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );
} 