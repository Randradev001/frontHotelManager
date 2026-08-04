import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AperpMark from './AperpMark';

export default function LogoMain({ reverse = false }) {
  return (
    <Stack direction="row" spacing={1.15} alignItems="center">
      <AperpMark size={46} />
      <Box sx={{ lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            display: 'block',
            color: reverse ? '#FFFFFF' : '#061B36',
            fontSize: '1.72rem',
            fontWeight: 900,
            letterSpacing: '0.055em',
            lineHeight: 0.92
          }}
        >
          APERP
        </Typography>
        <Typography
          component="span"
          sx={{
            display: 'block',
            mt: 0.45,
            color: reverse ? '#7DD3FC' : '#24364D',
            fontSize: '0.53rem',
            fontWeight: 800,
            letterSpacing: '0.045em',
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}
        >
          IMPULSANDO TU NEGOCIO
        </Typography>
      </Box>
    </Stack>
  );
}

LogoMain.propTypes = { reverse: PropTypes.bool };
