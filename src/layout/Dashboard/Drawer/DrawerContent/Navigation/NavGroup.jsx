import PropTypes from 'prop-types';
import { useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
// material-ui
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import DownOutlined from '@ant-design/icons/DownOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const hasSelectedChild = (item, pathname) =>
  (item.children || []).some((child) => child.url && matchPath({ path: child.url, end: false }, pathname));

function NavCollapseItem({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { pathname } = useLocation();
  const [manualOpen, setManualOpen] = useState(undefined);

  const selected = hasSelectedChild(item, pathname);
  const open = manualOpen ?? selected;
  const Icon = item.icon;
  const ToggleIcon = open ? DownOutlined : RightOutlined;
  const textColor = selected ? 'primary.main' : 'text.primary';

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          selected={selected}
          onClick={() => setManualOpen(!open)}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? '28px' : 1.5,
            py: !drawerOpen ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': { bgcolor: 'primary.lighter' },
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                borderRight: '2px solid',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'primary.lighter' }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
            })
          }}
        >
          {Icon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                color: textColor,
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: 'secondary.lighter' }
                }),
                ...(!drawerOpen &&
                  selected && {
                    bgcolor: 'primary.lighter',
                    '&:hover': { bgcolor: 'primary.lighter' }
                  })
              }}
            >
              <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
            </ListItemIcon>
          )}

          {drawerOpen && (
            <>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ color: textColor }}>
                    {item.title}
                  </Typography>
                }
              />
              <ToggleIcon style={{ fontSize: '0.75rem' }} />
            </>
          )}
        </ListItemButton>
      </Box>

      <Collapse in={drawerOpen && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ py: 0 }}>
          {(item.children || []).map((child) => (
            <NavItem key={child.id} item={child} level={2} />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapseItem key={menuItem.id} item={menuItem} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavCollapseItem.propTypes = { item: PropTypes.object };
NavGroup.propTypes = { item: PropTypes.object };
