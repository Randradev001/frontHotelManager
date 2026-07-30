import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import GxMaestroCrud from './gxMaestroCrud';

export default function MaestroCompositePage({ catalogs, initialCatalog }) {
  const initialIndex = Math.max(
    catalogs.findIndex((catalog) => catalog.name === initialCatalog),
    0
  );
  const [active, setActive] = useState(initialIndex);
  const selected = catalogs[active];

  return (
    <Box>
      <Tabs value={active} onChange={(event, value) => setActive(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {catalogs.map((catalog) => (
          <Tab key={catalog.name} label={catalog.label} />
        ))}
      </Tabs>

      <GxMaestroCrud key={selected.name} catalogName={selected.name} />
    </Box>
  );
}

MaestroCompositePage.propTypes = {
  catalogs: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired,
  initialCatalog: PropTypes.string.isRequired
};
