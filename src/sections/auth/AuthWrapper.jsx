import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AperpLoginHero from './AperpLoginHero';
import AuthCard from './AuthCard';

export default function AuthWrapper({ children }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 58%) minmax(420px, 42%)' },
        bgcolor: '#F4F7FB'
      }}
    >
      <AperpLoginHero />

      <Stack
        sx={{
          minHeight: '100dvh',
          px: { xs: 2.5, sm: 6, md: 4.5, lg: 7 },
          py: { xs: 2.5, sm: 4 },
          bgcolor: { xs: '#F4F7FB', md: '#FFFFFF' },
          backgroundImage: { xs: 'radial-gradient(circle at 90% 0%, rgba(8,125,241,0.12), transparent 34%)', md: 'none' }
        }}
      >
        <Logo to="/login" sx={{ alignSelf: 'flex-start' }} />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: { xs: 4, sm: 5 } }}>
          <AuthCard>{children}</AuthCard>
        </Box>
        <AuthFooter />
      </Stack>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
