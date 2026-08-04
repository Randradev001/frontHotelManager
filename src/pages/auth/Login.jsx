import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3.5}>
        <Grid size={12}>
          <Stack sx={{ gap: 0.85 }}>
            <Typography
              component="p"
              sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}
            >
              Acceso seguro
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', sm: '2.15rem' }, fontWeight: 850, color: '#061B36' }}>
              Bienvenido a APERP
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380, lineHeight: 1.65 }}>
              Ingrese con su RUT y clave. Si pertenece a más de una empresa, podrá elegirla antes de continuar.
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
