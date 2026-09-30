import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import SwapOutlined from '@ant-design/icons/SwapOutlined';
import CheckSquareOutlined from '@ant-design/icons/CheckSquareOutlined';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
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
import {
  listWorkOrders,
  saveWorkOrder,
  deleteWorkOrder,
  listLocations,
  listCategories,
  listAssets,
  listHotelUsers,
  transitionWorkOrder,
  saveWorkOrderTasks,
  listAccessibleHotels
} from 'api/hotelManagerApi';
const blank = {
  title: '',
  description: '',
  priority: 'NORMAL',
  status: 'NEW',
  locationId: '',
  categoryId: '',
  assetId: '',
  assignedToLogin: '',
  startedAt: '',
  dueAt: '',
  completedAt: '',
  tasks: []
};
const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const statuses = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
const allowedTransitions = {
  NEW: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
  ON_HOLD: ['IN_PROGRESS', 'CANCELLED']
};
const transitionPrompts = {
  IN_PROGRESS: 'What will be done to resolve this work order?',
  ON_HOLD: 'Why is this work order being placed on hold?',
  COMPLETED: 'Enter the completion comments.',
  CANCELLED: 'Enter the cancellation reason.'
};
const priorityTone = { LOW: 'default', NORMAL: 'info', HIGH: 'warning', URGENT: 'error' };
const toInputDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const formatDateTime = (value) =>
  value ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-';
const isOverdue = (item) =>
  Boolean(item.DueAt) && !['COMPLETED', 'CANCELLED'].includes(item.Status) && new Date(item.DueAt).getTime() < Date.now();
export default function WorkOrdersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [userPicker, setUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [hotelFilter, setHotelFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [transition, setTransition] = useState(null);
  const [transitionStatus, setTransitionStatus] = useState('');
  const [transitionNote, setTransitionNote] = useState('');
  const [transitionAssigned, setTransitionAssigned] = useState('');
  const [transitionTasks, setTransitionTasks] = useState([]);
  const [transitionError, setTransitionError] = useState('');
  const [taskManager, setTaskManager] = useState(null);
  const [taskDraft, setTaskDraft] = useState([]);
  const [taskError, setTaskError] = useState('');
  const orders = useQuery({ queryKey: ['hm', 'orders', hotelFilter], queryFn: () => listWorkOrders(hotelFilter) });
  const hotels = useQuery({ queryKey: ['hm', 'hotels'], queryFn: listAccessibleHotels });
  const locations = useQuery({ queryKey: ['hm', 'locations'], queryFn: listLocations });
  const categories = useQuery({ queryKey: ['hm', 'categories'], queryFn: listCategories });
  const assets = useQuery({ queryKey: ['hm', 'assets'], queryFn: listAssets });
  const users = useQuery({ queryKey: ['hm', 'users'], queryFn: listHotelUsers });
  const save = useMutation({
    mutationFn: saveWorkOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'orders'] });
      setOpen(false);
    },
    onError: (e) => setError(e.response?.data?.message || 'Unable to save work order.')
  });
  const remove = useMutation({ mutationFn: ({ id, hotelEmpCod }) => deleteWorkOrder(id, hotelEmpCod), onSuccess: () => qc.invalidateQueries({ queryKey: ['hm', 'orders'] }) });
  const move = useMutation({
    mutationFn: ({ id, payload }) => transitionWorkOrder(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'orders'] });
      qc.invalidateQueries({ queryKey: ['hm', 'dashboard'] });
      setTransition(null);
    },
    onError: (e) => setTransitionError(e.response?.data?.message || 'Unable to change the work order status.')
  });
  const saveTasks = useMutation({
    mutationFn: ({ id, tasks, hotelEmpCod }) => saveWorkOrderTasks(id, tasks, hotelEmpCod),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'orders'] });
      setTaskManager(null);
    },
    onError: (e) => setTaskError(e.response?.data?.message || 'Unable to update tasks.')
  });
  const rows = useMemo(
    () =>
      (orders.data || []).filter(
        (item) =>
          (status === 'ALL' || item.Status === status) &&
          `${item.WorkOrderNumber} ${item.Title} ${item.LocationName || ''} ${item.AssignedToLogin || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [orders.data, search, status]
  );
  const selectedUser = (users.data || []).find((user) => user.Login === form.assignedToLogin);
  const matchingUsers = (users.data || []).filter((user) =>
    `${user.Name} ${user.Login} ${user.Email || ''}`.toLowerCase().includes(userSearch.toLowerCase())
  );
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const begin = (item = null) => {
    setEditing(item);
    setError('');
    setForm(
      item
        ? {
            title: item.Title,
            description: item.Description || '',
            priority: item.Priority,
            status: item.Status,
            locationId: item.LocationId || '',
            categoryId: item.CategoryId || '',
            assetId: item.AssetId || '',
            assignedToLogin: item.AssignedToLogin || '',
            startedAt: toInputDateTime(item.StartedAt),
            dueAt: toInputDateTime(item.DueAt),
            completedAt: toInputDateTime(item.CompletedAt)
            ,tasks: (item.Tasks || []).map((task) => ({
              taskId: task.TaskId,
              parentTaskId: task.ParentTaskId,
              taskDescription: task.TaskDescription,
              taskStatus: task.TaskStatus,
              responsibleLogin: task.ResponsibleLogin || ''
            }))
          }
        : blank
    );
    setOpen(true);
  };
  const beginTransition = (item) => {
    setTransition(item);
    setTransitionStatus('');
    setTransitionNote('');
    setTransitionAssigned(item.AssignedToLogin || '');
    setTransitionTasks((item.Tasks || []).map((task) => ({ taskId: task.TaskId, parentTaskId: task.ParentTaskId, taskDescription: task.TaskDescription, taskStatus: task.TaskStatus, responsibleLogin: task.ResponsibleLogin || '' })));
    setUserSearch('');
    setTransitionError('');
  };
  const submitTransition = () =>
    move.mutate({
      id: transition.WorkOrderId,
      payload: { status: transitionStatus, note: transitionNote, assignedToLogin: transitionAssigned, tasks: transitionTasks, hotelEmpCod: transition.HotelEmpCod }
    });
  return (
    <Stack spacing={3}>
      <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, color: '#fff', background: 'linear-gradient(125deg,#10233D,#0B559B 65%,#0B8F9C)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,.75)' }}>
              Maintenance operations
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>
              Work Orders
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.8)' }}>Keep every issue visible from request through resolution.</Typography>
          </Box>
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => begin()} sx={{ bgcolor: '#fff', color: '#0B559B' }}>
            New work order
          </Button>
        </Stack>
      </Box>
      <MainCard
        title="Work order register"
        contentSX={{ p: 0 }}
        secondary={
          <Stack direction="row" spacing={1}>
            <TextField size="small" placeholder="Search work orders" value={search} onChange={(e) => setSearch(e.target.value)} />
            {hotels.data?.[0]?.IsAdministrator ? <Select size="small" value={hotelFilter} onChange={(e) => setHotelFilter(e.target.value)}><MenuItem value="ALL">All hotels</MenuItem>{(hotels.data || []).map((hotel) => <MenuItem key={hotel.HotelEmpCod} value={String(hotel.HotelEmpCod)}>{hotel.HotelName}</MenuItem>)}</Select> : null}
            <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="ALL">All statuses</MenuItem>
              {statuses.map((item) => (
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
              <TableCell>Work order</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={`${item.HotelEmpCod}:${item.WorkOrderId}`} hover>
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
                      <FileTextOutlined />
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>
                        #{item.WorkOrderNumber} · {item.Title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.AssignedToLogin ? `Assigned to ${item.AssignedToLogin}` : 'Unassigned'}
                      </Typography>
                      {hotels.data?.[0]?.IsAdministrator ? <Typography variant="caption" color="primary.main" display="block">{item.HotelName}</Typography> : null}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.Tasks?.length || 0} task{item.Tasks?.length === 1 ? '' : 's'} to do
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{item.LocationName || '-'}</TableCell>
                <TableCell>{item.CategoryName || '-'}</TableCell>
                <TableCell>
                  <Chip size="small" label={item.Priority} color={priorityTone[item.Priority]} />
                </TableCell>
                <TableCell>
                  <Chip size="small" variant="outlined" label={item.Status.replaceAll('_', ' ')} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    From: {formatDateTime(item.StartedAt)}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color={isOverdue(item) ? 'error.main' : 'text.secondary'}
                    fontWeight={isOverdue(item) ? 800 : 400}
                  >
                    To: {formatDateTime(item.DueAt)} {isOverdue(item) ? '· OVERDUE' : ''}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    title="Manage tasks to do"
                    onClick={() => {
                      setTaskManager(item);
                      setTaskDraft((item.Tasks || []).map((task) => ({ taskId: task.TaskId, parentTaskId: task.ParentTaskId, taskDescription: task.TaskDescription, taskStatus: task.TaskStatus, responsibleLogin: task.ResponsibleLogin || '' })));
                      setTaskError('');
                    }}
                  >
                    <CheckSquareOutlined />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    disabled={!allowedTransitions[item.Status]?.length}
                    title="Change status"
                    onClick={() => beginTransition(item)}
                  >
                    <SwapOutlined />
                  </IconButton>
                  <IconButton color="info" onClick={() => setViewing(item)}>
                    <EyeOutlined />
                  </IconButton>
                  <IconButton color="primary" onClick={() => begin(item)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => window.confirm(`Delete work order #${item.WorkOrderNumber}?`) && remove.mutate({ id: item.WorkOrderId, hotelEmpCod: item.HotelEmpCod })}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!orders.isLoading && !rows.length ? (
          <Typography sx={{ p: 3 }} color="text.secondary">
            No work orders match these filters.
          </Typography>
        ) : null}
      </MainCard>
      <Dialog open={open} onClose={() => !save.isPending && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit work order' : 'New work order'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Title" required value={form.title} onChange={set('title')} />
            <TextField label="Description" multiline minRows={3} value={form.description} onChange={set('description')} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start date"
                value={form.startedAt}
                onChange={set('startedAt')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="Expected completion"
                value={form.dueAt}
                onChange={set('dueAt')}
                InputLabelProps={{ shrink: true }}
                error={Boolean(form.startedAt && form.dueAt && form.dueAt < form.startedAt)}
                helperText={form.startedAt && form.dueAt && form.dueAt < form.startedAt ? 'Must be after the start date.' : ''}
              />
            </Stack>
            {editing?.CompletedAt ? (
              <TextField
                type="datetime-local"
                label="Actual completion"
                value={form.completedAt}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            ) : null}
            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select label="Priority" value={form.priority} onChange={set('priority')}>
                {Object.keys(priorityTone).map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={form.status} onChange={set('status')}>
                {statuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.replaceAll('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {[
              ['locationId', 'Location', locations.data || [], 'LocationId', 'LocationName'],
              ['categoryId', 'Category', categories.data || [], 'CategoryId', 'CategoryName'],
              ['assetId', 'Asset', assets.data || [], 'AssetId', 'AssetName']
            ].map(([key, label, options, id, name]) => (
              <FormControl key={key}>
                <InputLabel>{label}</InputLabel>
                <Select label={label} value={form[key]} onChange={set(key)}>
                  <MenuItem value="">None</MenuItem>
                  {options.map((item) => (
                    <MenuItem key={item[id]} value={item[id]}>
                      {item[name]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
            <TextField
              label="Assigned user"
              value={selectedUser ? `${selectedUser.Name} (${selectedUser.Login})` : ''}
              placeholder="Select a user"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setUserSearch('');
                      setUserPicker(true);
                    }}
                  >
                    <SearchOutlined />
                  </IconButton>
                )
              }}
            />
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Box>
                  <Typography fontWeight={750}>Tasks to do</Typography>
                  <Typography variant="caption" color="text.secondary">Responsibility may be assigned now or later.</Typography>
                </Box>
                <Button size="small" startIcon={<PlusOutlined />} onClick={() => setForm((current) => ({ ...current, tasks: [...current.tasks, { taskDescription: '', taskStatus: 'TODO', responsibleLogin: '' }] }))}>Add task</Button>
              </Stack>
              <Stack spacing={1.5}>
                {form.tasks.map((task, index) => (
                  <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                    <TextField fullWidth size="small" label={`Task ${index + 1}`} value={task.taskDescription} onChange={(event) => setForm((current) => ({ ...current, tasks: current.tasks.map((value, taskIndex) => taskIndex === index ? { ...value, taskDescription: event.target.value } : value) }))} />
                    <FormControl size="small" sx={{ minWidth: 145 }}><InputLabel>Status</InputLabel><Select label="Status" value={task.taskStatus} onChange={(event) => setForm((current) => ({ ...current, tasks: current.tasks.map((value, taskIndex) => taskIndex === index ? { ...value, taskStatus: event.target.value } : value) }))}>{taskStatuses.map((value) => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}</Select></FormControl>
                    <FormControl size="small" sx={{ minWidth: 170 }}><InputLabel>Responsible</InputLabel><Select label="Responsible" value={task.responsibleLogin} onChange={(event) => setForm((current) => ({ ...current, tasks: current.tasks.map((value, taskIndex) => taskIndex === index ? { ...value, responsibleLogin: event.target.value } : value) }))}><MenuItem value="">Unassigned</MenuItem>{(users.data || []).map((user) => <MenuItem key={user.Login} value={user.Login}>{user.Name}</MenuItem>)}</Select></FormControl>
                    <IconButton color="error" onClick={() => setForm((current) => ({ ...current, tasks: current.tasks.filter((_, taskIndex) => taskIndex !== index) }))}><MinusCircleOutlined /></IconButton>
                  </Stack>
                ))}
                {!form.tasks.length ? <Typography variant="body2" color="text.secondary">No tasks added yet.</Typography> : null}
              </Stack>
            </Box>
            {error ? <Typography color="error">{error}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!form.title || form.tasks.some((task) => !task.taskDescription.trim()) || save.isPending || Boolean(form.startedAt && form.dueAt && form.dueAt < form.startedAt)}
            onClick={() => save.mutate({ ...form, workOrderId: editing?.WorkOrderId, hotelEmpCod: editing?.HotelEmpCod || (hotelFilter !== 'ALL' ? hotelFilter : undefined) })}
          >
            Save work order
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(transition)} onClose={() => !move.isPending && setTransition(null)} fullWidth maxWidth="sm">
        <DialogTitle>Change status · Work order #{transition?.WorkOrderNumber}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.lighter' }}>
              <Typography fontWeight={750}>{transition?.Title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Current status: {transition?.Status?.replaceAll('_', ' ')}
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>New status</InputLabel>
              <Select
                label="New status"
                value={transitionStatus}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  setTransitionStatus(nextStatus);
                  setTransitionNote('');
                  setTransitionAssigned(nextStatus === 'ASSIGNED' ? transition?.AssignedToLogin || '' : '');
                  setTransitionError('');
                }}
              >
                {statuses.map((item) => {
                  const isCurrent = item === transition?.Status;
                  const hasPendingTasks = transitionTasks.some((task) => task.taskStatus !== 'COMPLETED');
                  const allTasksClosed = transitionTasks.length > 0 && !transitionTasks.some((task) => ['TODO', 'IN_PROGRESS'].includes(task.taskStatus));
                  const isAllowed = allowedTransitions[transition?.Status]?.includes(item) && !(item === 'COMPLETED' && hasPendingTasks) && !(item === 'IN_PROGRESS' && allTasksClosed);
                  return (
                    <MenuItem key={item} value={item} disabled={!isAllowed}>
                      {item.replaceAll('_', ' ')}
                      {isCurrent ? ' (current)' : !isAllowed ? ' (not available)' : ''}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              All statuses are shown. Unavailable options are disabled because work orders must follow the operational workflow.
            </Typography>
            {transitionStatus !== 'COMPLETED' && transitionTasks.some((task) => task.taskStatus !== 'COMPLETED') ? (
              <Typography variant="caption" color="warning.main">Every task must be completed before completing this work order.</Typography>
            ) : null}
            {transitionTasks.length > 0 && !transitionTasks.some((task) => ['TODO', 'IN_PROGRESS'].includes(task.taskStatus)) ? (
              <Typography variant="caption" color="warning.main">Set at least one task to TO DO or IN PROGRESS before moving the work order to IN PROGRESS.</Typography>
            ) : null}
            {transitionTasks.length ? (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography fontWeight={750} sx={{ mb: 1.5 }}>Tasks to do</Typography>
                <Stack spacing={1.25}>
                  {transitionTasks.map((task, index) => (
                    <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                      <Typography sx={{ flex: 1 }}>{task.taskDescription}</Typography>
                      <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select label="Status" value={task.taskStatus} onChange={(event) => setTransitionTasks((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, taskStatus: event.target.value } : value))}>{taskStatuses.map((value) => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}</Select></FormControl>
                      <FormControl size="small" sx={{ minWidth: 190 }}><InputLabel>Responsible</InputLabel><Select label="Responsible" value={task.responsibleLogin} onChange={(event) => setTransitionTasks((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, responsibleLogin: event.target.value } : value))}><MenuItem value="">Unassigned</MenuItem>{(users.data || []).map((user) => <MenuItem key={user.Login} value={user.Login}>{user.Name}</MenuItem>)}</Select></FormControl>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ) : null}
            {transitionStatus === 'ASSIGNED' ? (
              <>
                <Typography>Select or confirm the person responsible.</Typography>
                <TextField
                  placeholder="Search name, login, or email"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
                <Box sx={{ maxHeight: 230, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  {matchingUsers.map((user) => (
                    <Box
                      key={user.Login}
                      onClick={() => setTransitionAssigned(user.Login)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: transitionAssigned === user.Login ? 'primary.lighter' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Typography fontWeight={700}>{user.Name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.Login}
                        {user.JobTitle ? ` · ${user.JobTitle}` : ''}
                        {user.Email ? ` · ${user.Email}` : ''}
                      </Typography>
                    </Box>
                  ))}
                  {!matchingUsers.length ? (
                    <Typography sx={{ p: 2 }} color="text.secondary">
                      No users found.
                    </Typography>
                  ) : null}
                </Box>
              </>
            ) : transitionStatus ? (
              <TextField
                label={transitionPrompts[transitionStatus]}
                value={transitionNote}
                onChange={(event) => setTransitionNote(event.target.value)}
                multiline
                minRows={3}
                required
              />
            ) : null}
            {transitionError ? <Typography color="error">{transitionError}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransition(null)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={
              move.isPending || !transitionStatus || (transitionStatus === 'ASSIGNED' ? !transitionAssigned : !transitionNote.trim()) || (transitionStatus === 'IN_PROGRESS' && transitionTasks.length > 0 && !transitionTasks.some((task) => ['TODO', 'IN_PROGRESS'].includes(task.taskStatus)))
            }
            onClick={submitTransition}
          >
            {move.isPending ? 'Changing...' : 'Confirm change'}
          </Button>
        </DialogActions>
      </Dialog>
      <RecordPreviewDialog
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Work order details"
        record={viewing}
        fields={[
          { label: 'Work order', render: (record) => `#${record?.WorkOrderNumber || '-'}` },
          { label: 'Title', key: 'Title' },
          { label: 'Description', key: 'Description' },
          { label: 'Location', key: 'LocationName' },
          { label: 'Asset', key: 'AssetName' },
          { label: 'Category', key: 'CategoryName' },
          { label: 'Priority', key: 'Priority' },
          { label: 'Status', key: 'Status' },
          { label: 'Assigned to', key: 'AssignedToLogin' },
          { label: 'Start date', render: (record) => formatDateTime(record?.StartedAt) },
          { label: 'Expected completion', render: (record) => formatDateTime(record?.DueAt) },
          { label: 'Actual completion', render: (record) => formatDateTime(record?.CompletedAt) }
          ,{ label: 'Tasks to do', render: (record) => (record?.Tasks || []).map((task) => `${task.TaskDescription} · ${task.TaskStatus.replaceAll('_', ' ')} · ${task.ResponsibleName || 'Unassigned'}`).join('\n') || 'No tasks' }
        ]}
      />
      <Dialog open={Boolean(taskManager)} onClose={() => !saveTasks.isPending && setTaskManager(null)} fullWidth maxWidth="md">
        <DialogTitle>Tasks to do · {taskManager?.HotelName} · Work order #{taskManager?.WorkOrderNumber}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Update progress or assign responsibility without editing the entire work order.</Typography>
          <Stack spacing={1.5}>
            {taskDraft.map((task, index) => (
              <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }}>
                <TextField fullWidth size="small" label={`Task ${index + 1}`} value={task.taskDescription} onChange={(event) => setTaskDraft((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, taskDescription: event.target.value } : value))} />
                <FormControl size="small" sx={{ minWidth: 160 }}><InputLabel>Status</InputLabel><Select label="Status" value={task.taskStatus} onChange={(event) => setTaskDraft((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, taskStatus: event.target.value } : value))}>{taskStatuses.map((value) => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}</Select></FormControl>
                <FormControl size="small" sx={{ minWidth: 210 }}><InputLabel>Responsible</InputLabel><Select label="Responsible" value={task.responsibleLogin} onChange={(event) => setTaskDraft((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, responsibleLogin: event.target.value } : value))}><MenuItem value="">Unassigned</MenuItem>{(users.data || []).map((user) => <MenuItem key={user.Login} value={user.Login}>{user.Name}</MenuItem>)}</Select></FormControl>
                <IconButton color="error" onClick={() => setTaskDraft((current) => current.filter((_, taskIndex) => taskIndex !== index))}><MinusCircleOutlined /></IconButton>
              </Stack>
            ))}
            <Button variant="outlined" startIcon={<PlusOutlined />} onClick={() => setTaskDraft((current) => [...current, { taskDescription: '', taskStatus: 'TODO', responsibleLogin: '' }])}>Add task</Button>
            {taskError ? <Typography color="error">{taskError}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setTaskManager(null)}>Cancel</Button><Button variant="contained" disabled={saveTasks.isPending || taskDraft.some((task) => !task.taskDescription.trim())} onClick={() => saveTasks.mutate({ id: taskManager.WorkOrderId, tasks: taskDraft, hotelEmpCod: taskManager.HotelEmpCod })}>{saveTasks.isPending ? 'Saving...' : 'Save tasks'}</Button></DialogActions>
      </Dialog>
      <Dialog open={userPicker} onClose={() => setUserPicker(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select assigned user</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            sx={{ my: 1 }}
            placeholder="Search name, login, or email"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          {matchingUsers.map((user) => (
            <Box
              key={user.Login}
              onClick={() => {
                setForm((current) => ({ ...current, assignedToLogin: user.Login }));
                setUserPicker(false);
              }}
              sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <Typography fontWeight={700}>{user.Name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.Login}
                {user.JobTitle ? ` · ${user.JobTitle}` : ''}
                {user.Email ? ` · ${user.Email}` : ''}
              </Typography>
            </Box>
          ))}
          {!matchingUsers.length ? (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No users found.
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setForm((current) => ({ ...current, assignedToLogin: '' }));
              setUserPicker(false);
            }}
          >
            Clear assignment
          </Button>
          <Button onClick={() => setUserPicker(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
