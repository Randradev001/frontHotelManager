// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// project imports
import { DRAWER_WIDTH } from 'config';

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  backgroundColor: '#061B36',
  color: '#ffffff',
  borderRight: '1px solid rgba(125, 211, 252, 0.12)',

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),

  overflowX: 'hidden',
  boxShadow: 'none'
});

const closedMixin = (theme) => ({
  backgroundColor: '#061B36',
  color: '#ffffff',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  overflowX: 'hidden',
  width: theme.spacing(7.5),
  borderRight: '1px solid rgba(125, 211, 252, 0.12)',
  boxShadow: theme.vars.customShadows.z1
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
    },
    {
      props: ({ open }) => !open,
      style: { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }
    }
  ]
}));

export default MiniDrawerStyled;
