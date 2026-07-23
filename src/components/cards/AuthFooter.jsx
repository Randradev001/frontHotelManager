// material-ui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import ContainerWrapper from 'components/ContainerWrapper';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <ContainerWrapper>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: { xs: 'center', sm: 'space-between' }, textAlign: { xs: 'center', sm: 'inherit' }, py: 2 }}
      >
        <Typography variant="subtitle2" color="secondary">
          Conex - Sistema de packing y exportacion
        </Typography>

        <Typography variant="subtitle2" color="secondary">
          Migracion GeneXus 8
        </Typography>
      </Stack>
    </ContainerWrapper>
  );
}
