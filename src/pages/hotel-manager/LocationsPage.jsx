import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import MainCard from 'components/MainCard';
import RecordPreviewDialog from 'components/hotel-manager/RecordPreviewDialog';
import { useAuth } from 'contexts/AuthContext';
import { createLocation, deleteLocation, listLocations, updateLocation } from 'api/hotelManagerApi';

const locationTypes = [
  ['BUILDING', 'Building'], ['FLOOR', 'Floor'], ['ROOM', 'Room'], ['AREA', 'Area'], ['EQUIPMENT_ROOM', 'Equipment room']
];
const emptyForm = { locationType: 'ROOM', locationName: '', locationCode: '', floorLabel: '', parentLocationId: '' };

export default function LocationsPage() {
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const locationsQuery = useQuery({ queryKey: ['hm', 'locations'], queryFn: listLocations });
  const createMutation = useMutation({
    mutationFn: (payload) => editing ? updateLocation({ ...payload, locationId: editing.LocationId }) : createLocation(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hm', 'locations'] }); setOpen(false); setForm(emptyForm); setEditing(null); },
    onError: (requestError) => setError(requestError.response?.data?.message || 'Unable to create the location.')
  });
  const locations = locationsQuery.data || [];
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = () => { setError(''); createMutation.mutate(form); };
  const removeMutation = useMutation({ mutationFn: deleteLocation, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hm', 'locations'] }), onError: (e) => window.alert(e.response?.data?.message || 'Unable to delete location.') });
  const visibleLocations = locations.filter((item) => `${item.LocationName} ${item.LocationCode || ''} ${item.LocationType}`.toLowerCase().includes(search.toLowerCase()));
  const startEdit = (location) => { setEditing(location); setForm({ locationType: location.LocationType, locationName: location.LocationName, locationCode: location.LocationCode || '', floorLabel: location.FloorLabel || '', parentLocationId: location.ParentLocationId || '', isActive: location.IsActive }); setOpen(true); };

  return (
    <Stack spacing={3}>
      <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, color: '#fff', background: 'linear-gradient(125deg, #10233D 0%, #0B559B 65%, #0B8F9C 135%)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em' }}>{company?.nombre || 'Active hotel'}</Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800 }}>Locations</Typography>
            <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.78)' }}>Register the spaces where maintenance work happens.</Typography>
          </Box>
          <Button variant="contained" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }} startIcon={<PlusOutlined />} sx={{ bgcolor: '#fff', color: '#0B559B', '&:hover': { bgcolor: '#eef7ff' } }}>Add location</Button>
        </Stack>
      </Box>
      <MainCard title="Location register" contentSX={{ p: 0 }} secondary={<TextField size="small" placeholder="Search locations" value={search} onChange={(e) => setSearch(e.target.value)} />}>
        {locationsQuery.isLoading ? <Typography sx={{ p: 3 }}>Loading locations...</Typography> : null}
        {locationsQuery.isError ? <Typography color="error" sx={{ p: 3 }}>Unable to load locations. Please sign in again and retry.</Typography> : null}
        {!locationsQuery.isLoading && !locationsQuery.isError && !locations.length ? (
          <Stack alignItems="center" spacing={1.5} sx={{ p: 6, color: 'text.secondary' }}><EnvironmentOutlined style={{ fontSize: 34 }} /><Typography variant="h4">No locations yet</Typography><Typography>Add your first room, floor, or operational area.</Typography></Stack>
        ) : null}
        {locations.length ? <Table size="small"><TableHead><TableRow><TableCell>Type</TableCell><TableCell>Name</TableCell><TableCell>Code</TableCell><TableCell>Floor</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{visibleLocations.map((location) => <TableRow key={location.LocationId} hover><TableCell>{location.LocationType.replace('_', ' ')}</TableCell><TableCell>{location.LocationName}</TableCell><TableCell>{location.LocationCode || '-'}</TableCell><TableCell>{location.FloorLabel || '-'}</TableCell><TableCell>{location.IsActive ? 'Active' : 'Inactive'}</TableCell><TableCell align="right"><IconButton onClick={() => setViewing(location)} color="info"><EyeOutlined /></IconButton><IconButton onClick={() => startEdit(location)} color="primary"><EditOutlined /></IconButton><IconButton onClick={() => window.confirm(`Delete ${location.LocationName}?`) && removeMutation.mutate(location.LocationId)} color="error"><DeleteOutlined /></IconButton></TableCell></TableRow>)}</TableBody></Table> : null}
      </MainCard>
      <Dialog open={open} onClose={() => !createMutation.isPending && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit location' : 'Add location'}</DialogTitle>
        <DialogContent><Stack spacing={2.25} sx={{ pt: 1 }}>
          <FormControl fullWidth><InputLabel id="location-type-label">Type</InputLabel><Select labelId="location-type-label" label="Type" value={form.locationType} onChange={update('locationType')}>{locationTypes.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</Select></FormControl>
          <TextField label="Location name" value={form.locationName} onChange={update('locationName')} required autoFocus fullWidth placeholder="Room 204" />
          <TextField label="Reference code" value={form.locationCode} onChange={update('locationCode')} fullWidth placeholder="204" />
          <TextField label="Floor" value={form.floorLabel} onChange={update('floorLabel')} fullWidth placeholder="2" />
          <FormControl fullWidth><InputLabel id="parent-location-label">Parent location</InputLabel><Select labelId="parent-location-label" label="Parent location" value={form.parentLocationId} onChange={update('parentLocationId')}><MenuItem value=""><em>No parent location</em></MenuItem>{locations.map((location) => <MenuItem key={location.LocationId} value={location.LocationId}>{location.LocationName}</MenuItem>)}</Select></FormControl>
          {error ? <Typography color="error" variant="body2">{error}</Typography> : null}
        </Stack></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}><Button onClick={() => setOpen(false)} disabled={createMutation.isPending}>Cancel</Button><Button variant="contained" onClick={submit} disabled={!form.locationName.trim() || createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save location'}</Button></DialogActions>
      </Dialog>
      <RecordPreviewDialog open={Boolean(viewing)} onClose={() => setViewing(null)} title="Location details" record={viewing} fields={[{ label: 'Type', key: 'LocationType' }, { label: 'Name', key: 'LocationName' }, { label: 'Reference code', key: 'LocationCode' }, { label: 'Floor', key: 'FloorLabel' }, { label: 'Parent location', key: 'ParentLocationName' }, { label: 'Status', render: (record) => record?.IsActive ? 'Active' : 'Inactive' }]} />
    </Stack>
  );
}
