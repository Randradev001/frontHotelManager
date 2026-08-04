import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Logo from 'components/logo';

const capabilities = ['Control multiempresa', 'Seguridad por roles', 'Operación trazable'];

export default function AperpLoginHero() {
  return (
    <Box
      component="section"
      aria-label="APERP, impulsando tu negocio"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { md: 5, lg: 7, xl: 8 },
        color: 'common.white',
        background: 'linear-gradient(145deg, #0B559B 0%, #073D75 48%, #061B36 100%)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.38,
          backgroundImage:
            'radial-gradient(circle at 78% 20%, rgba(56,189,248,0.55), transparent 25%), radial-gradient(circle at 18% 84%, rgba(8,125,241,0.45), transparent 32%)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '70%',
          height: '150%',
          top: '-28%',
          right: '-48%',
          transform: 'rotate(-14deg)',
          bgcolor: 'rgba(255,255,255,0.08)',
          borderLeft: '1px solid rgba(255,255,255,0.2)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          right: -160,
          bottom: -135,
          border: '72px solid rgba(21,147,255,0.13)',
          borderRadius: '50%'
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Logo reverse to="/login" sx={{ justifyContent: 'flex-start' }} />
      </Box>

      <Stack spacing={3.25} sx={{ position: 'relative', zIndex: 1, maxWidth: 650 }}>
        <Typography
          component="p"
          sx={{ color: '#7DD3FC', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' }}
        >
          APERP · Control de Bodega
        </Typography>
        <Typography
          component="h1"
          sx={{
            maxWidth: 610,
            color: 'common.white',
            fontSize: { md: '3.35rem', lg: '4.55rem', xl: '5.25rem' },
            fontWeight: 900,
            lineHeight: 0.96,
            letterSpacing: '-0.045em'
          }}
        >
          Impulsando
          <Box component="span" sx={{ display: 'block', color: '#38BDF8' }}>
            tu negocio.
          </Box>
        </Typography>
        <Typography sx={{ maxWidth: 540, color: 'rgba(255,255,255,0.76)', fontSize: { md: '1rem', lg: '1.08rem' }, lineHeight: 1.7 }}>
          Una experiencia renovada para gestionar personas, permisos y procesos operativos con el contexto de empresa siempre protegido.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {capabilities.map((capability) => (
            <Chip
              key={capability}
              icon={<CheckCircleOutlined />}
              label={capability}
              sx={{
                color: 'common.white',
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                '& .MuiChip-icon': { color: '#7DD3FC' }
              }}
            />
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
          Gestión clara. Decisiones conectadas.
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
          APERP {new Date().getFullYear()}
        </Typography>
      </Stack>
    </Box>
  );
}
