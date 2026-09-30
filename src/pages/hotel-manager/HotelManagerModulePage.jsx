import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import BuildOutlined from '@ant-design/icons/BuildOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';

const moduleContent = {
  dashboard: {
    title: 'Operations Dashboard',
    description: 'A live view of maintenance workload, urgent issues, and service performance for your hotel.',
    icon: BuildOutlined,
    next: 'Work orders, service-level metrics, and operational alerts will appear here.'
  },
  'work-orders': {
    title: 'Work Orders',
    description: 'Create, assign, track, and close maintenance requests with a complete audit trail.',
    icon: FileTextOutlined,
    next: 'The first work-order queue and request form are the next operational screens.'
  },
  locations: {
    title: 'Locations',
    description: 'Organize buildings, floors, rooms, public areas, and equipment rooms for this hotel.',
    icon: EnvironmentOutlined,
    next: 'This is the first HM CRUD scheduled for implementation.'
  },
  categories: {
    title: 'Maintenance Categories',
    description: 'Define the categories used to classify maintenance work and set their default priority.',
    icon: ToolOutlined,
    next: 'Categories will be managed per hotel, never shared across GECODEMP boundaries.'
  },
  assets: {
    title: 'Assets',
    description: 'Maintain the equipment that needs servicing, including its location and maintenance history.',
    icon: CalendarOutlined,
    next: 'Asset records will connect directly to locations and future work orders.'
  }
};

export default function HotelManagerModulePage({ module }) {
  const content = moduleContent[module];
  const Icon = content.icon;
  const { company } = useAuth();

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          color: '#FFFFFF',
          background: 'linear-gradient(125deg, #10233D 0%, #0B559B 58%, #0B8F9C 130%)'
        }}
      >
        <Box sx={{ position: 'absolute', right: -42, top: -58, width: 190, height: 190, borderRadius: '50%', border: '36px solid rgba(255,255,255,0.09)' }} />
        <Stack spacing={1.25} sx={{ position: 'relative' }}>
          <Chip
            label={company?.nombre || 'Active hotel'}
            sx={{ alignSelf: 'flex-start', color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          />
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Icon style={{ fontSize: 30 }} />
            <Typography variant="h2" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
              {content.title}
            </Typography>
          </Stack>
          <Typography sx={{ maxWidth: 650, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>{content.description}</Typography>
        </Stack>
      </Box>

      <MainCard contentSX={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h4" sx={{ color: '#10233D', fontWeight: 800 }}>
            Hotel Manager foundation is ready
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.7 }}>
            {content.next} The menu is secured to the active hotel from your session; no hotel identifier is accepted from the browser.
          </Typography>
          <Button component={RouterLink} to="/dashboard/default" startIcon={<ArrowLeftOutlined />} variant="outlined">
            Back to dashboard
          </Button>
        </Stack>
      </MainCard>
    </Stack>
  );
}

HotelManagerModulePage.propTypes = {
  module: PropTypes.oneOf(['dashboard', 'work-orders', 'locations', 'categories', 'assets']).isRequired
};
