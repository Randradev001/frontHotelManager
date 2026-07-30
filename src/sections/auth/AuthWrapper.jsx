import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';

import heroImage from 'assets/images/auth/conex-export-hero.webp';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(440px, 42%) minmax(0, 1fr)' },
        bgcolor: 'background.paper'
      }}
    >
      <Stack
        sx={{
          minHeight: '100dvh',
          px: { xs: 3, sm: 6, md: 6, lg: 8 },
          py: { xs: 3, sm: 4 },
          bgcolor: 'background.paper'
        }}
      >
        <Box>
          <Logo to="/" sx={{ justifyContent: 'flex-start' }} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: { xs: 5, sm: 6 } }}>
          <AuthCard>{children}</AuthCard>
        </Box>
        <AuthFooter />
      </Stack>

      <Box
        component="section"
        aria-label="Operación de packing y exportación"
        sx={{
          position: 'relative',
          display: { xs: 'none', md: 'block' },
          minHeight: '100dvh',
          overflow: 'hidden',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 58, 29, 0.02) 42%, rgba(0, 58, 29, 0.68) 100%)'
          }
        }}
      >
        <Stack sx={{ position: 'absolute', zIndex: 1, left: { md: 40, lg: 56 }, right: 40, bottom: { md: 40, lg: 56 }, gap: 1 }}>
          <Typography variant="h3" sx={{ color: 'common.white', maxWidth: 560, fontWeight: 700 }}>
            Trazabilidad desde el packing hasta el despacho
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.88)' }}>
            Operación, calidad y exportación conectadas.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
