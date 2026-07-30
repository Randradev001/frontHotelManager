import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SecurityCatalogPage from './SecurityCatalogPage';

export default function SecurityCompositePage({ catalogs }) {
  const [active, setActive] = useState(0);
  const selected = catalogs[active];

  return (
    <Box>
      <Tabs value={active} onChange={(event, value) => setActive(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {catalogs.map((catalog) => (
          <Tab key={catalog.name} label={catalog.label} />
        ))}
      </Tabs>
      <SecurityCatalogPage key={selected.name} catalogName={selected.name} />
    </Box>
  );
}

SecurityCompositePage.propTypes = {
  catalogs: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired
};
