import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Logo from 'components/logo';
import { useAuth } from 'contexts/AuthContext';
import DrawerHeaderStyled from './DrawerHeaderStyled';

export default function DrawerHeader({ open }) {
  const { company, user } = useAuth();
  const companyName = company?.nombre || 'Empresa APERP';
  const login = user?.login || 'Usuario';

  return (
    <Box sx={{ bgcolor: '#061B36', borderBottom: '1px solid rgba(125, 211, 252, 0.12)' }}>
      <DrawerHeaderStyled open={open} sx={{ minHeight: 68, width: 'initial', py: 1, px: open ? 2.25 : 1.25 }}>
        <Logo reverse isIcon={!open} sx={{ width: open ? 'auto' : 40, height: 46, justifyContent: 'center' }} />
      </DrawerHeaderStyled>
      {open && (
        <Box sx={{ px: 2.25, pb: 2, pt: 0.25 }}>
          <Typography
            variant="subtitle2"
            noWrap
            title={companyName}
            sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.02em' }}
          >
            {companyName}
          </Typography>
          <Typography variant="caption" noWrap sx={{ display: 'block', mt: 0.4, color: '#7DD3FC', fontWeight: 650 }}>
            {login}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
