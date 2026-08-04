import { useMemo } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// project imports
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  // common header
  const mainHeader = (
    <Toolbar sx={{ minHeight: '68px !important', px: { xs: 2, sm: 3 } }}>
      <IconButton
        aria-label="open drawer"
        onClick={() => handlerDrawerOpen(!drawerOpen)}
        edge="start"
        sx={{
          color: '#ffffff',
          bgcolor: 'transparent',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
          ml: { xs: 0, lg: -2 }
        }}
      >
        {!drawerOpen ? <MenuUnfoldOutlined style={{ fontSize: '1.25rem' }} /> : <MenuFoldOutlined style={{ fontSize: '1.25rem' }} />}
      </IconButton>
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'primary',
    elevation: 2,
    sx: {
      background: 'linear-gradient(100deg, #0B559B 0%, #087DF1 100%)',
      color: '#ffffff',
      borderBottom: 'none',
      boxShadow: '0 8px 24px rgba(6, 27, 54, 0.16)',
      zIndex: 1200,
      width: { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
