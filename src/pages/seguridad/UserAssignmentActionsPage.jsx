import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

import SecurityCatalogPage from './SecurityCatalogPage';

export default function UserAssignmentActionsPage() {
  return (
    <Box>
      <Button component={RouterLink} to="/seguridad/asignaciones" startIcon={<ArrowLeftOutlined />} sx={{ mb: 2 }}>
        Volver a módulos y programas
      </Button>
      <SecurityCatalogPage catalogName="asignacionesAcciones" />
    </Box>
  );
}
