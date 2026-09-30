import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Logo from 'components/logo';
import hotelLoginImage from 'assets/images/auth/hotel-taskmanager-login.png';

const capabilities = ['Multi-hotel operations', 'Role-based security', 'Auditable maintenance'];

export default function AperpLoginHero() {
  return (
    <Box
      component="section"
      aria-label="HM TaskManager hotel operations"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { md: 5, lg: 7, xl: 8 },
        color: 'common.white',
        backgroundImage: `linear-gradient(100deg, rgba(5,24,43,.96) 0%, rgba(6,35,60,.83) 42%, rgba(6,35,60,.22) 78%), url(${hotelLoginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <Box
        sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.18), transparent 35%, rgba(3,18,32,.52))' }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Logo reverse to="/login" sx={{ justifyContent: 'flex-start' }} />
      </Box>

      <Stack spacing={3.25} sx={{ position: 'relative', zIndex: 1, maxWidth: 610 }}>
        <Typography
          component="p"
          sx={{ color: '#7FE1D1', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' }}
        >
          Hotel operations · Winnipeg
        </Typography>
        <Typography
          component="h1"
          sx={{
            maxWidth: 600,
            color: 'common.white',
            fontSize: { md: '3.2rem', lg: '4.3rem', xl: '5rem' },
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: '-0.045em'
          }}
        >
          Every task.
          <Box component="span" sx={{ display: 'block', color: '#7FE1D1' }}>
            One clear view.
          </Box>
        </Typography>
        <Typography sx={{ maxWidth: 535, color: 'rgba(255,255,255,.82)', fontSize: { md: '1rem', lg: '1.08rem' }, lineHeight: 1.7 }}>
          Coordinate maintenance, assets, locations and hotel teams with secure, real-time operational visibility.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {capabilities.map((capability) => (
            <Chip
              key={capability}
              icon={<CheckCircleOutlined />}
              label={capability}
              sx={{
                color: 'common.white',
                bgcolor: 'rgba(255,255,255,.11)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.16)',
                '& .MuiChip-icon': { color: '#7FE1D1' }
              }}
            />
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.68)' }}>
          Built for better guest experiences.
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.68)' }}>
          HM TaskManager {new Date().getFullYear()}
        </Typography>
      </Stack>
    </Box>
  );
}
