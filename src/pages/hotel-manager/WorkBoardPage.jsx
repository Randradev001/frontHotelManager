import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserOutlined from '@ant-design/icons/UserOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { listAccessibleHotels, listHotelUsers, listWorkOrders, saveWorkOrderTasks, transitionWorkOrder } from 'api/hotelManagerApi';

const lanes = [
  ['NEW', 'New', '#536D8A'],
  ['ASSIGNED', 'Assigned', '#087DF1'],
  ['IN_PROGRESS', 'In Progress', '#0B8F9C'],
  ['ON_HOLD', 'On Hold', '#E49B21'],
  ['COMPLETED', 'Completed', '#2E7D32'],
  ['CANCELLED', 'Cancelled', '#8793A6']
];
const allowed = {
  NEW: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
  ON_HOLD: ['IN_PROGRESS', 'CANCELLED']
};
const promptFor = {
  IN_PROGRESS: 'What will be done to resolve this work order?',
  ON_HOLD: 'Why is this work order being placed on hold?',
  COMPLETED: 'Enter the completion comments.',
  CANCELLED: 'Enter the cancellation reason.'
};
const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const formatDateTime = (value) =>
  value ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not set';
const isOverdue = (item) =>
  Boolean(item.DueAt) && !['COMPLETED', 'CANCELLED'].includes(item.Status) && new Date(item.DueAt).getTime() < Date.now();

export default function WorkBoardPage() {
  const qc = useQueryClient(),
    [transition, setTransition] = useState(null),
    [note, setNote] = useState(''),
    [assigned, setAssigned] = useState(''),
    [tasks, setTasks] = useState([]),
    [taskDialog, setTaskDialog] = useState(null),
    [taskDraft, setTaskDraft] = useState([]),
    [hotelFilter, setHotelFilter] = useState('ALL'),
    [userSearch, setUserSearch] = useState(''),
    [error, setError] = useState('');
  const orders = useQuery({ queryKey: ['hm', 'orders', hotelFilter], queryFn: () => listWorkOrders(hotelFilter) }),
    hotels = useQuery({ queryKey: ['hm', 'hotels'], queryFn: listAccessibleHotels }),
    users = useQuery({ queryKey: ['hm', 'users'], queryFn: listHotelUsers });
  const move = useMutation({
    mutationFn: ({ id, payload }) => transitionWorkOrder(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'orders'] });
      qc.invalidateQueries({ queryKey: ['hm', 'dashboard'] });
      setTransition(null);
    },
    onError: (e) => setError(e.response?.data?.message || 'Unable to move this work order.')
  });
  const updateTasks = useMutation({
    mutationFn: ({ id, values, hotelEmpCod }) => saveWorkOrderTasks(id, values, hotelEmpCod),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hm', 'orders'] });
      qc.invalidateQueries({ queryKey: ['hm', 'dashboard'] });
      setTaskDialog(null);
    },
    onError: (e) => setError(e.response?.data?.message || 'Unable to update tasks.')
  });
  const openTasks = (item) => {
    setTaskDialog(item);
    setTaskDraft((item.Tasks || []).map((task) => ({ taskId: task.TaskId, parentTaskId: task.ParentTaskId, taskDescription: task.TaskDescription, taskStatus: task.TaskStatus, responsibleLogin: task.ResponsibleLogin || '' })));
    setError('');
  };
  const requestMove = (item, target) => {
    if (item.Status === target) return;
    if (!allowed[item.Status]?.includes(target)) {
      setError(`Cannot move from ${item.Status.replaceAll('_', ' ')} to ${target.replaceAll('_', ' ')}.`);
      setTransition({ item, target, invalid: true });
      return;
    }
    setNote('');
    setUserSearch('');
    setAssigned(target === 'ASSIGNED' ? item.AssignedToLogin || '' : '');
    setTasks((item.Tasks || []).map((task) => ({ taskId: task.TaskId, parentTaskId: task.ParentTaskId, taskDescription: task.TaskDescription, taskStatus: task.TaskStatus, responsibleLogin: task.ResponsibleLogin || '' })));
    setError('');
    setTransition({ item, target });
  };
  const matching = (users.data || []).filter((u) =>
    `${u.Name} ${u.Login} ${u.Email || ''}`.toLowerCase().includes(userSearch.toLowerCase())
  );
  const submit = () =>
    move.mutate({ id: transition.item.WorkOrderId, payload: { status: transition.target, note, assignedToLogin: assigned, tasks, hotelEmpCod: transition.item.HotelEmpCod } });
  return (
    <Stack spacing={3}>
      <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, color: '#fff', background: 'linear-gradient(125deg,#10233D,#0B559B 65%,#0B8F9C)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box><Typography variant="overline" sx={{ color: 'rgba(255,255,255,.75)' }}>
          Visual maintenance workflow
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          Work Board
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,.8)' }}>
          Drag each work order to its next valid stage. Every transition is audited.
        </Typography>
        </Box>{hotels.data?.[0]?.IsAdministrator ? <FormControl size="small" sx={{ minWidth: 250, bgcolor: '#fff', borderRadius: 1.5 }}><InputLabel>Hotel</InputLabel><Select label="Hotel" value={hotelFilter} onChange={(event) => setHotelFilter(event.target.value)}><MenuItem value="ALL">All hotels</MenuItem>{(hotels.data || []).map((hotel) => <MenuItem key={hotel.HotelEmpCod} value={String(hotel.HotelEmpCod)}>{hotel.HotelName}</MenuItem>)}</Select></FormControl> : null}</Stack>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(6,minmax(280px,1fr))' }, gap: 2, overflowX: 'auto', pb: 2 }}>
        {lanes.map(([key, label, color]) => (
          <Box
            key={key}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const [hotelEmpCod, id] = e.dataTransfer.getData('text/plain').split(':');
              const item = (orders.data || []).find((x) => String(x.WorkOrderId) === id && String(x.HotelEmpCod) === hotelEmpCod);
              if (item) requestMove(item, key);
            }}
            sx={{ minHeight: 520, bgcolor: '#F5F7FA', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 1.5 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                <Typography fontWeight={800}>{label}</Typography>
              </Stack>
              <Chip size="small" label={(orders.data || []).filter((x) => x.Status === key).length} />
            </Stack>
            <Stack spacing={1.25}>
              {(orders.data || [])
                .filter((x) => x.Status === key)
                .map((item) => {
                  const completedTasks = (item.Tasks || []).filter((task) => task.TaskStatus === 'COMPLETED').length;
                  const pendingTasks = (item.Tasks || []).length - completedTasks;
                  const totalTasks = (item.Tasks || []).length;
                  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  return (
                  <Box
                    key={`${item.HotelEmpCod}:${item.WorkOrderId}`}
                    draggable={Boolean(allowed[item.Status])}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', `${item.HotelEmpCod}:${item.WorkOrderId}`);
                    }}
                    onClick={() => openTasks(item)}
                    sx={{
                      p: 1.1,
                      bgcolor: isOverdue(item) ? '#FFF1F0' : `${color}14`,
                      border: '1px solid',
                      borderColor: isOverdue(item) ? 'error.main' : `${color}55`,
                      borderRadius: 2,
                      boxShadow: '0 6px 18px rgba(16,35,61,.07)',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: isOverdue(item) ? '#FFE4E1' : `${color}24`, borderColor: color, boxShadow: `0 9px 24px ${color}26` }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800} noWrap sx={{ minWidth: 0, flex: 1 }}>
                        #{item.WorkOrderNumber}{totalTasks ? ` · ${pendingTasks}/${totalTasks} pending · ${progress}%` : ' · No tasks'}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        {isOverdue(item) ? <Chip size="small" label="OVERDUE" color="error" /> : null}
                        <Chip
                          size="small"
                          label={item.Priority}
                          color={item.Priority === 'URGENT' ? 'error' : item.Priority === 'HIGH' ? 'warning' : 'default'}
                        />
                      </Stack>
                    </Stack>
                    <Typography variant="body2" fontWeight={750} noWrap sx={{ mt: 0.55 }}>
                      {item.Title}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={750} display="block" noWrap sx={{ mt: 0.25 }}>{item.HotelName}</Typography>
                    <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mt: 0.3 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center"><EnvironmentOutlined /><Typography variant="caption" color="text.secondary">{item.LocationName || 'No location'}</Typography></Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center"><UserOutlined /><Typography variant="caption" color="text.secondary">{item.AssignedToLogin || 'Unassigned'}</Typography></Stack>
                    </Stack>
                    <Box
                      sx={{
                        mt: 0.55,
                        pt: 0.45,
                        borderTop: '1px solid',
                        borderColor: isOverdue(item) ? 'error.light' : 'divider'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={1}><Typography variant="caption" color="text.secondary">From: {formatDateTime(item.StartedAt)}</Typography><Typography variant="caption" color={isOverdue(item) ? 'error.main' : 'text.secondary'} fontWeight={isOverdue(item) ? 800 : 400}>To: {formatDateTime(item.DueAt)}</Typography></Stack>
                    </Box>
                  </Box>
                  );
                })}
            </Stack>
          </Box>
        ))}
      </Box>
      <Dialog open={Boolean(transition)} onClose={() => !move.isPending && setTransition(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {transition?.invalid
            ? 'Transition not allowed'
            : `Move #${transition?.item?.WorkOrderNumber} to ${transition?.target?.replaceAll('_', ' ')}`}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {transition?.invalid ? null : transition?.target === 'ASSIGNED' ? (
              <>
                <Typography>Select or confirm the person responsible.</Typography>
                <TextField placeholder="Search users" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                <Box sx={{ maxHeight: 230, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  {matching.map((user) => (
                    <Box
                      key={user.Login}
                      onClick={() => setAssigned(user.Login)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: assigned === user.Login ? 'primary.lighter' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Typography fontWeight={700}>{user.Name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.Login}
                        {user.JobTitle ? ` · ${user.JobTitle}` : ''}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <TextField
                label={promptFor[transition?.target] || 'Comment'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                minRows={3}
                required
              />
            )}
            {!transition?.invalid && tasks.length ? (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography fontWeight={750} sx={{ mb: 1.5 }}>Tasks to do</Typography>
                <Stack spacing={1.25}>
                  {tasks.map((task, index) => (
                    <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                      <Typography sx={{ flex: 1 }}>{task.taskDescription}</Typography>
                      <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select label="Status" value={task.taskStatus} onChange={(event) => setTasks((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, taskStatus: event.target.value } : value))}>{taskStatuses.map((value) => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}</Select></FormControl>
                      <FormControl size="small" sx={{ minWidth: 190 }}><InputLabel>Responsible</InputLabel><Select label="Responsible" value={task.responsibleLogin} onChange={(event) => setTasks((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, responsibleLogin: event.target.value } : value))}><MenuItem value="">Unassigned</MenuItem>{(users.data || []).map((user) => <MenuItem key={user.Login} value={user.Login}>{user.Name}</MenuItem>)}</Select></FormControl>
                    </Stack>
                  ))}
                </Stack>
                {transition?.target === 'COMPLETED' && tasks.some((task) => task.taskStatus !== 'COMPLETED') ? <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1.5 }}>Every task must be completed before completing the work order.</Typography> : null}
                {transition?.target === 'IN_PROGRESS' && tasks.length > 0 && !tasks.some((task) => ['TODO', 'IN_PROGRESS'].includes(task.taskStatus)) ? <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1.5 }}>Set at least one task to TO DO or IN PROGRESS before starting the work order.</Typography> : null}
              </Box>
            ) : null}
            {error ? <Typography color="error">{error}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransition(null)}>Cancel</Button>
          {!transition?.invalid ? (
            <Button
              variant="contained"
              disabled={move.isPending || (transition?.target === 'ASSIGNED' ? !assigned : !note.trim()) || (transition?.target === 'COMPLETED' && tasks.some((task) => task.taskStatus !== 'COMPLETED')) || (transition?.target === 'IN_PROGRESS' && tasks.length > 0 && !tasks.some((task) => ['TODO', 'IN_PROGRESS'].includes(task.taskStatus)))}
              onClick={submit}
            >
              {move.isPending ? 'Moving...' : 'Confirm move'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(taskDialog)} onClose={() => !updateTasks.isPending && setTaskDialog(null)} fullWidth maxWidth="md">
        <DialogTitle>Tasks to do · {taskDialog?.HotelName} · Work order #{taskDialog?.WorkOrderNumber}</DialogTitle>
        <DialogContent>
          <Typography fontWeight={750}>{taskDialog?.Title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Update task status and responsibility directly from the board.</Typography>
          <Stack spacing={1.5}>
            {taskDraft.map((task, index) => (
              <Box key={task.taskId || index} sx={{ p: 1.5, ml: task.parentTaskId ? 3 : 0, border: '1px solid', borderColor: task.parentTaskId ? 'primary.lighter' : 'divider', borderRadius: 2, bgcolor: task.parentTaskId ? 'grey.50' : 'background.paper' }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>{task.taskDescription}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select label="Status" value={task.taskStatus} onChange={(event) => setTaskDraft((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, taskStatus: event.target.value } : value))}>{taskStatuses.map((value) => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}</Select></FormControl>
                  <FormControl fullWidth size="small"><InputLabel>Responsible</InputLabel><Select label="Responsible" value={task.responsibleLogin} onChange={(event) => setTaskDraft((current) => current.map((value, taskIndex) => taskIndex === index ? { ...value, responsibleLogin: event.target.value } : value))}><MenuItem value="">Unassigned</MenuItem>{(users.data || []).map((user) => <MenuItem key={user.Login} value={user.Login}>{user.Name}</MenuItem>)}</Select></FormControl>
                </Stack>
              </Box>
            ))}
            {!taskDraft.length ? <Typography color="text.secondary">This work order has no tasks to do.</Typography> : null}
            {error ? <Typography color="error">{error}</Typography> : null}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setTaskDialog(null)}>Cancel</Button><Button variant="contained" disabled={updateTasks.isPending || !taskDraft.length} onClick={() => updateTasks.mutate({ id: taskDialog.WorkOrderId, values: taskDraft, hotelEmpCod: taskDialog.HotelEmpCod })}>{updateTasks.isPending ? 'Saving...' : 'Save task changes'}</Button></DialogActions>
      </Dialog>
    </Stack>
  );
}
