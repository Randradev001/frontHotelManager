import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuth } from 'contexts/AuthContext';
import MobileSection from './MobileSection';
import Profile from './Profile';

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { company } = useAuth();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', minWidth: 0, ml: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: '#FFFFFF', fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.2 }}>
          Control de Bodega
        </Typography>
        {!downLG && (
          <Typography noWrap sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.7rem', mt: 0.25 }}>
            {company?.nombre || 'APERP'}
          </Typography>
        )}
      </Box>
      {downLG ? <MobileSection /> : <Profile />}
    </Stack>
  );
}
