import Typography from '@mui/material/Typography';

export default function AuthFooter() {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
      © {new Date().getFullYear()} HM TaskManager · Hotel Operations
    </Typography>
  );
}
