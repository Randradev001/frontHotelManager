import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
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
import { useAuth } from 'contexts/AuthContext';
import { deleteCategory, listCategories, saveCategory } from 'api/hotelManagerApi';
const blank = { categoryName: '', iconName: '', colourCode: '#087DF1', defaultPriority: 'NORMAL', isActive: true };
export default function CategoriesPage() {
  const { company } = useAuth(),
    qc = useQueryClient(),
    [open, setOpen] = useState(false),
    [viewing, setViewing] = useState(null),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(blank),
    [search, setSearch] = useState(''),
    [error, setError] = useState('');
  const q = useQuery({ queryKey: ['hm', 'categories'], queryFn: listCategories });
  const save = useMutation({
    mutationFn: saveCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'categories'] });
      setOpen(false);
    },
    onError: (e) => setError(e.response?.data?.message || 'Unable to save category.')
  });
  const del = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hm', 'categories'] }),
    onError: (e) => window.alert(e.response?.data?.message || 'Unable to delete category.')
  });
  const rows = (q.data || []).filter((x) => x.CategoryName.toLowerCase().includes(search.toLowerCase()));
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const edit = (x) => {
    setEditing(x);
    setForm({ ...x, isActive: Boolean(x.IsActive) });
    setError('');
    setOpen(true);
  };
  return (
    <Stack spacing={3}>
      <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, color: '#fff', background: 'linear-gradient(125deg,#10233D,#0B559B 65%,#0B8F9C)' }}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="overline">{company?.nombre || 'Active hotel'}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>
              Maintenance Categories
            </Typography>
            <Typography>Classify every maintenance request consistently.</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
            <Button
              variant="contained"
              sx={{ bgcolor: '#fff', color: '#0B559B' }}
              startIcon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                setForm(blank);
                setOpen(true);
              }}
            >
              Add category
            </Button>
          </Grid>
        </Grid>
      </Box>
      <MainCard
        title="Category register"
        contentSX={{ p: 0 }}
        secondary={<TextField size="small" placeholder="Search categories" value={search} onChange={(e) => setSearch(e.target.value)} />}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Default priority</TableCell>
              <TableCell>Colour</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((x) => (
              <TableRow key={x.CategoryId} hover>
                <TableCell>{x.CategoryName}</TableCell>
                <TableCell>{x.DefaultPriority}</TableCell>
                <TableCell>
                  <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: x.ColourCode || '#ccc' }} />
                </TableCell>
                <TableCell>{x.IsActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="right">
                    <IconButton color="info" onClick={() => setViewing(x)}><EyeOutlined /></IconButton>
                    <IconButton color="primary" onClick={() => edit(x)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton color="error" onClick={() => window.confirm(`Delete ${x.CategoryName}?`) && del.mutate(x.CategoryId)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!q.isLoading && !rows.length ? <Typography sx={{ p: 3 }}>No categories found.</Typography> : null}
      </MainCard>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit category' : 'Add category'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Category name" value={form.categoryName || ''} onChange={set('categoryName')} required autoFocus />
            <TextField label="Icon name" value={form.iconName || ''} onChange={set('iconName')} placeholder="tool" />
            <TextField label="Colour" value={form.colourCode || ''} onChange={set('colourCode')} placeholder="#087DF1" />
            <FormControl>
              <InputLabel>Default priority</InputLabel>
              <Select label="Default priority" value={form.defaultPriority || 'NORMAL'} onChange={set('defaultPriority')}>
                {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
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
            disabled={!form.categoryName || save.isPending}
            onClick={() => {
              setError('');
              save.mutate({ ...form, categoryId: editing?.CategoryId });
            }}
          >
            Save category
          </Button>
        </DialogActions>
      </Dialog>
      <RecordPreviewDialog open={Boolean(viewing)} onClose={() => setViewing(null)} title="Category details" record={viewing} fields={[{ label: 'Category name', key: 'CategoryName' }, { label: 'Icon name', key: 'IconName' }, { label: 'Colour', key: 'ColourCode' }, { label: 'Default priority', key: 'DefaultPriority' }, { label: 'Status', render: (record) => record?.IsActive ? 'Active' : 'Inactive' }]} />
    </Stack>
  );
}
