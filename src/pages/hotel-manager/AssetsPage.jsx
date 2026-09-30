import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import RecordPreviewDialog from 'components/hotel-manager/RecordPreviewDialog';
import { deleteAsset, listAssets, saveAsset, listLocations, listCategories } from 'api/hotelManagerApi';

const blank = {
  assetTag: '',
  assetName: '',
  locationId: '',
  categoryId: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  assetStatus: 'ACTIVE'
};
const tone = { ACTIVE: 'success', OUT_OF_SERVICE: 'warning', RETIRED: 'default' };

export default function AssetsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [error, setError] = useState('');
  const assets = useQuery({ queryKey: ['hm', 'assets'], queryFn: listAssets });
  const locations = useQuery({ queryKey: ['hm', 'locations'], queryFn: listLocations });
  const categories = useQuery({ queryKey: ['hm', 'categories'], queryFn: listCategories });
  const save = useMutation({
    mutationFn: saveAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hm', 'assets'] });
      setOpen(false);
    },
    onError: (e) => setError(e.response?.data?.message || 'Unable to save asset.')
  });
  const remove = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hm', 'assets'] }),
    onError: (e) => window.alert(e.response?.data?.message || 'Unable to delete asset.')
  });
  const rows = useMemo(
    () =>
      (assets.data || []).filter(
        (item) =>
          (status === 'ALL' || item.AssetStatus === status) &&
          `${item.AssetTag} ${item.AssetName} ${item.LocationName || ''} ${item.CategoryName || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [assets.data, search, status]
  );
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const begin = (item = null) => {
    setEditing(item);
    setError('');
    setForm(
      item
        ? {
            assetTag: item.AssetTag,
            assetName: item.AssetName,
            locationId: item.LocationId || '',
            categoryId: item.CategoryId || '',
            manufacturer: item.Manufacturer || '',
            model: item.Model || '',
            serialNumber: item.SerialNumber || '',
            assetStatus: item.AssetStatus
          }
        : blank
    );
    setOpen(true);
  };
  return (
    <Stack spacing={3}>
      <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, color: '#fff', background: 'linear-gradient(125deg,#10233D,#0B559B 65%,#0B8F9C)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,.75)' }}>
              Hotel equipment register
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>
              Assets
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.8)' }}>Track the equipment that supports every guest stay.</Typography>
          </Box>
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => begin()} sx={{ bgcolor: '#fff', color: '#0B559B' }}>
            Add asset
          </Button>
        </Stack>
      </Box>
      <MainCard
        title="Asset register"
        contentSX={{ p: 0 }}
        secondary={
          <Stack direction="row" spacing={1}>
            <TextField size="small" placeholder="Search assets" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="ALL">All statuses</MenuItem>
              {Object.keys(tone).map((item) => (
                <MenuItem key={item} value={item}>
                  {item.replaceAll('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        }
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Manufacturer / model</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.AssetId} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.lighter',
                        color: 'primary.main'
                      }}
                    >
                      <ToolOutlined />
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>{item.AssetName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.AssetTag}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{item.LocationName || '-'}</TableCell>
                <TableCell>{item.CategoryName || '-'}</TableCell>
                <TableCell>{[item.Manufacturer, item.Model].filter(Boolean).join(' / ') || '-'}</TableCell>
                <TableCell>
                  <Chip size="small" label={item.AssetStatus.replaceAll('_', ' ')} color={tone[item.AssetStatus]} />
                </TableCell>
                <TableCell align="right">
              <IconButton color="info" onClick={() => setViewing(item)}><EyeOutlined /></IconButton>
              <IconButton color="primary" onClick={() => begin(item)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton color="error" onClick={() => window.confirm(`Delete ${item.AssetName}?`) && remove.mutate(item.AssetId)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!assets.isLoading && !rows.length ? (
          <Typography sx={{ p: 3 }} color="text.secondary">
            No assets match these filters.
          </Typography>
        ) : null}
      </MainCard>
      <Dialog open={open} onClose={() => !save.isPending && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit asset' : 'Add asset'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField required label="Asset tag" value={form.assetTag} onChange={set('assetTag')} />
            <TextField required label="Asset name" value={form.assetName} onChange={set('assetName')} />
            <FormControl>
              <InputLabel>Location</InputLabel>
              <Select label="Location" value={form.locationId} onChange={set('locationId')}>
                <MenuItem value="">None</MenuItem>
                {(locations.data || []).map((item) => (
                  <MenuItem key={item.LocationId} value={item.LocationId}>
                    {item.LocationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={form.categoryId} onChange={set('categoryId')}>
                <MenuItem value="">None</MenuItem>
                {(categories.data || []).map((item) => (
                  <MenuItem key={item.CategoryId} value={item.CategoryId}>
                    {item.CategoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Manufacturer" value={form.manufacturer} onChange={set('manufacturer')} />
            <TextField label="Model" value={form.model} onChange={set('model')} />
            <TextField label="Serial number" value={form.serialNumber} onChange={set('serialNumber')} />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={form.assetStatus} onChange={set('assetStatus')}>
                {Object.keys(tone).map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.replaceAll('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error ? <Typography color="error">{error}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!form.assetTag || !form.assetName || save.isPending}
            onClick={() => save.mutate({ ...form, assetId: editing?.AssetId })}
          >
            Save asset
          </Button>
        </DialogActions>
      </Dialog>
      <RecordPreviewDialog open={Boolean(viewing)} onClose={() => setViewing(null)} title="Asset details" record={viewing} fields={[{ label: 'Asset tag', key: 'AssetTag' }, { label: 'Asset name', key: 'AssetName' }, { label: 'Location', key: 'LocationName' }, { label: 'Category', key: 'CategoryName' }, { label: 'Manufacturer', key: 'Manufacturer' }, { label: 'Model', key: 'Model' }, { label: 'Serial number', key: 'SerialNumber' }, { label: 'Status', key: 'AssetStatus' }]} />
    </Stack>
  );
}
