import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 470,
        mx: 'auto',
        p: { xs: 2.5, sm: 4 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        boxShadow: '0 24px 70px rgba(6, 27, 54, 0.10)'
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

AuthCard.propTypes = { children: PropTypes.any, other: PropTypes.any };
