import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useAuth } from 'contexts/AuthContext';
import { buildAuthorizedMenu } from 'menu-items/authorizedMenu';
import dashboard from 'menu-items/dashboard';
import NavGroup from './NavGroup';

export default function Navigation() {
  const { menu, user } = useAuth();
  const menuItems = useMemo(() => [dashboard, buildAuthorizedMenu(menu, user)].filter(Boolean), [menu, user]);

  const navGroups = menuItems.map((item) => {
    if (item.type === 'group') return <NavGroup key={item.id} item={item} />;

    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Fix - Navigation Group
      </Typography>
    );
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
