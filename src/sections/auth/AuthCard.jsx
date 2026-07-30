import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 460, mx: 'auto' }} {...other}>
      {children}
    </Box>
  );
}

AuthCard.propTypes = { children: PropTypes.any, other: PropTypes.any };
