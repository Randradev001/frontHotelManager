import PropTypes from 'prop-types';
import { useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import DownOutlined from '@ant-design/icons/DownOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

import { useGetMenuMaster } from 'api/menu';
import NavItem from './NavItem';

const hasSelectedChild = (item, pathname) =>
  (item.children || []).some(
    (child) => (child.url && matchPath({ path: child.url, end: false }, pathname)) || hasSelectedChild(child, pathname)
  );

function NavCollapseItem({ item, level = 1 }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { pathname } = useLocation();
  const [manualOpen, setManualOpen] = useState(undefined);

  const selected = hasSelectedChild(item, pathname);
  const open = manualOpen ?? selected;
  const Icon = item.icon;
  const ToggleIcon = open ? DownOutlined : RightOutlined;
  const textColor = selected ? '#ffffff' : '#A9BBD0';

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          selected={selected}
          onClick={() => setManualOpen(!open)}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 16 + 8}px` : 1.5,
            py: !drawerOpen ? 1.25 : 0.85,
            color: textColor,
            ...(drawerOpen && {
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' },
              '&.Mui-selected': {
                bgcolor: 'rgba(8, 125, 241, 0.22)',
                color: '#ffffff',
                borderLeft: '3px solid',
                borderColor: '#38BDF8',
                '&:hover': { bgcolor: 'rgba(8, 125, 241, 0.3)' }
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
                color: selected ? '#ffffff' : '#A9BBD0',
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                }),
                ...(!drawerOpen &&
                  selected && {
                    bgcolor: '#087DF1',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#087DF1' }
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
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: selected ? 600 : 400 }}>
                    {item.title}
                  </Typography>
                }
              />
              <ToggleIcon style={{ fontSize: '0.75rem', color: textColor }} />
            </>
          )}
        </ListItemButton>
      </Box>

      <Collapse in={drawerOpen && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ py: 0 }}>
          {(item.children || []).map((child) =>
            child.type === 'collapse' ? (
              <NavCollapseItem key={child.id} item={child} level={level + 1} />
            ) : (
              <NavItem key={child.id} item={child} level={level + 1} />
            )
          )}
        </List>
      </Collapse>
    </>
  );
}

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    if (menuItem.type === 'collapse') return <NavCollapseItem key={menuItem.id} item={menuItem} level={1} />;
    if (menuItem.type === 'item') return <NavItem key={menuItem.id} item={menuItem} level={1} />;

    return (
      <Typography key={menuItem.id} variant="h6" color="error" align="center">
        Fix - Group Collapse or Items
      </Typography>
    );
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#7188A3', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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

NavCollapseItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};
NavGroup.propTypes = { item: PropTypes.object };
