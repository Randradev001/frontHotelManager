// material-ui
import Typography from '@mui/material/Typography';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
      © {new Date().getFullYear()} APERP · Control de Bodega
    </Typography>
  );
}
