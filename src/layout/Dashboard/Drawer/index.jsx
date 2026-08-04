import PropTypes from 'prop-types';
import { useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

// project imports
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';

import { DRAWER_WIDTH } from 'config';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

export default function MainDrawer({ window }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={drawerOpen} />, [drawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: drawerOpen ? 'block' : 'none', lg: 'none' } }}
          slotProps={{
            paper: {
              sx: {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                bgcolor: '#061B36',
                color: '#FFFFFF',
                borderRight: '1px solid rgba(125, 211, 252, 0.12)',
                boxShadow: '0 20px 50px rgba(6, 27, 54, 0.28)'
              }
            }
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

MainDrawer.propTypes = { window: PropTypes.func };
