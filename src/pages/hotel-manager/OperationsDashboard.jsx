import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import AlertOutlined from '@ant-design/icons/AlertOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import ThunderboltOutlined from '@ant-design/icons/ThunderboltOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import { Alert, Box, Button, Chip, Grid, LinearProgress, MenuItem, Select, Skeleton, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';
import { getHotelDashboard, listHotelUsers } from 'api/hotelManagerApi';

const statusColours = {
  NEW: '#536D8A',
  ASSIGNED: '#087DF1',
  IN_PROGRESS: '#0B8F9C',
  ON_HOLD: '#E49B21',
  COMPLETED: '#2E7D32',
  CANCELLED: '#8793A6'
};
const priorityColours = { LOW: '#8793A6', NORMAL: '#087DF1', HIGH: '#E49B21', URGENT: '#D32F2F' };
const number = (value) => Number(value || 0);
const percent = (part, total) => (number(total) ? Math.round((number(part) / number(total)) * 100) : 0);
const shortMonth = (period) => new Intl.DateTimeFormat('en-CA', { month: 'short' }).format(new Date(`${period}-01T12:00:00`));
const dueLabel = (value) => (value ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(new Date(value)) : 'No due date');

function Metric({ label, value, icon: Icon, colour, helper }) {
  return (
    <MainCard contentSX={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '.06em' }}>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 850 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 2.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${colour}16`,
            color: colour
          }}
        >
          <Icon style={{ fontSize: 22 }} />
        </Box>
      </Stack>
    </MainCard>
  );
}

function Ranking({ rows, valueKey = 'OpenCount', colour = '#087DF1', empty = 'No data available.' }) {
  const max = Math.max(1, ...(rows || []).map((item) => number(item[valueKey])));
  return (
    <Stack spacing={1.65}>
      {(rows || []).map((item) => (
        <Box key={`${item.Name}-${item.LocationId || item.AssetId || ''}`}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="body2" noWrap>
              {item.Name}
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {number(item[valueKey])}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(number(item[valueKey]) / max) * 100}
            sx={{ mt: 0.6, height: 7, borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: colour, borderRadius: 5 } }}
          />
        </Box>
      ))}
      {!(rows || []).length ? <Typography color="text.secondary">{empty}</Typography> : null}
    </Stack>
  );
}

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  colour: PropTypes.string.isRequired,
  helper: PropTypes.string.isRequired
};
Ranking.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  valueKey: PropTypes.string,
  colour: PropTypes.string,
  empty: PropTypes.string
};

export default function OperationsDashboard() {
  const { company } = useAuth();
  const [assignedToLogin, setAssignedToLogin] = useState('');
  const users = useQuery({ queryKey: ['hm', 'users'], queryFn: listHotelUsers });
  const query = useQuery({ queryKey: ['hm', 'dashboard', assignedToLogin], queryFn: () => getHotelDashboard(assignedToLogin) });
  const data = query.data || {},
    summary = data.summary || {};
  const status = useMemo(() => Object.fromEntries((data.byStatus || []).map((item) => [item.Status, number(item.Total)])), [data.byStatus]);
  const priority = useMemo(
    () => Object.fromEntries((data.byPriority || []).map((item) => [item.Priority, number(item.Total)])),
    [data.byPriority]
  );
  const completionRate = percent(summary.CompletedOrders, summary.TotalOrders),
    slaRate = percent(summary.CompletedOnTime, summary.CompletedOrders),
    overdueRate = percent(summary.OverdueOrders, summary.OpenOrders);
  const trend = data.trend || [],
    topLocation = data.byLocation?.[0],
    topAsset = data.byAsset?.find((item) => item.AssetId),
    topCategory = data.byCategory?.[0];
  const executiveConclusion = number(summary.OverdueOrders)
    ? `${summary.OverdueOrders} open order${number(summary.OverdueOrders) === 1 ? ' is' : 's are'} overdue (${overdueRate}% of the active backlog). Focus management attention on ${topLocation?.Name || 'the highest-volume locations'} and clear unassigned work first.`
    : number(summary.OpenOrders)
      ? `The active backlog contains ${summary.OpenOrders} work order${number(summary.OpenOrders) === 1 ? '' : 's'} with no overdue items. Prioritize the ${summary.DueSoonOrders || 0} due within three days.`
      : 'The maintenance backlog is clear. This is the best window to schedule preventive inspections and verify asset records.';

  if (query.isLoading)
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={190} />
        <Skeleton variant="rounded" height={400} />
      </Stack>
    );
  if (query.isError)
    return <Alert severity="error">Unable to load the management dashboard. Please refresh or contact your system administrator.</Alert>;

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          color: '#fff',
          background: 'linear-gradient(125deg,#10233D,#0B559B 62%,#0B8F9C)',
          boxShadow: '0 22px 50px rgba(16,35,61,.18)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            right: -90,
            top: -150,
            border: '48px solid rgba(255,255,255,.08)',
            borderRadius: '50%'
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          spacing={2}
          sx={{ position: 'relative' }}
        >
          <Stack spacing={1}>
            <Chip
              label={company?.nombre || 'Active hotel'}
              sx={{ alignSelf: 'flex-start', color: '#fff', bgcolor: 'rgba(255,255,255,.13)' }}
            />
            <Typography variant="h2" sx={{ fontWeight: 850 }}>
              Management Intelligence
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.8)', maxWidth: 720 }}>
              Executive maintenance performance, risk signals and operational priorities for your hotel.
            </Typography>
          </Stack>
          <Select
            value={assignedToLogin}
            onChange={(event) => setAssignedToLogin(event.target.value)}
            size="small"
            displayEmpty
            sx={{
              minWidth: 260,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,.12)',
              '& .MuiSvgIcon-root': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,.38)' }
            }}
          >
            <MenuItem value="">All users</MenuItem>
            {(users.data || []).map((user) => (
              <MenuItem key={user.Login} value={user.Login}>
                {user.Name} ({user.Login})
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Metric
            label="ACTIVE BACKLOG"
            value={number(summary.OpenOrders)}
            helper={`${number(summary.UnassignedOrders)} unassigned`}
            icon={FileTextOutlined}
            colour="#087DF1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Metric
            label="OVERDUE"
            value={number(summary.OverdueOrders)}
            helper={`${overdueRate}% of open work`}
            icon={AlertOutlined}
            colour="#D32F2F"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Metric
            label="ON-TIME COMPLETION"
            value={`${slaRate}%`}
            helper={`${number(summary.CompletedOnTime)} completed within target`}
            icon={CheckCircleOutlined}
            colour="#2E7D32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Metric
            label="AVG. RESOLUTION"
            value={summary.AvgResolutionHours == null ? '—' : `${number(summary.AvgResolutionHours)}h`}
            helper="Created to completed"
            icon={ClockCircleOutlined}
            colour="#0B8F9C"
          />
        </Grid>
      </Grid>

      <MainCard
        title="Executive conclusion"
        secondary={<Chip label={assignedToLogin ? 'User view' : 'Hotel-wide view'} color="primary" variant="outlined" />}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2.5,
              bgcolor: number(summary.OverdueOrders) ? 'error.lighter' : 'success.lighter',
              color: number(summary.OverdueOrders) ? 'error.main' : 'success.main'
            }}
          >
            <ThunderboltOutlined style={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography fontWeight={800}>{executiveConclusion}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Overall completion is {completionRate}%. The hotel has {number(summary.ActiveAssets)} active assets across{' '}
              {number(summary.ActiveLocations)} active locations.
            </Typography>
          </Box>
        </Stack>
      </MainCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <MainCard title="Six-month demand trend">
            <Box sx={{ height: 310 }}>
              <LineChart
                xAxis={[{ scaleType: 'point', data: trend.map((item) => shortMonth(item.Period)) }]}
                series={[
                  { data: trend.map((item) => number(item.Created)), label: 'Created', color: '#087DF1', area: true },
                  { data: trend.map((item) => number(item.Completed)), label: 'Completed', color: '#2E7D32' }
                ]}
                grid={{ horizontal: true }}
                margin={{ left: 45, right: 20, top: 30, bottom: 30 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Conclusion:{' '}
              {trend.length < 2
                ? 'More history is needed to establish a reliable demand trend.'
                : number(trend.at(-1)?.Created) > number(trend.at(-2)?.Created)
                  ? 'New maintenance demand increased in the latest period; verify staffing capacity before backlog grows.'
                  : 'New maintenance demand is stable or declining compared with the previous period.'}
            </Typography>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <MainCard title="Work order lifecycle">
            <Box sx={{ height: 270 }}>
              <PieChart
                series={[
                  {
                    innerRadius: 58,
                    outerRadius: 100,
                    paddingAngle: 2,
                    data: Object.entries(statusColours).map(([key, colour], id) => ({
                      id,
                      value: status[key] || 0,
                      label: key.replaceAll('_', ' '),
                      color: colour
                    }))
                  }
                ]}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Conclusion:{' '}
              {number(summary.InProgress)
                ? `${summary.InProgress} order${number(summary.InProgress) === 1 ? ' is' : 's are'} actively being resolved.`
                : 'No work is currently marked In Progress; review assigned orders for execution.'}
            </Typography>
          </MainCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MainCard title="Priority exposure">
            <Box sx={{ height: 270 }}>
              <BarChart
                layout="horizontal"
                yAxis={[{ scaleType: 'band', data: Object.keys(priorityColours) }]}
                series={[{ data: Object.keys(priorityColours).map((key) => priority[key] || 0), color: '#0B559B', label: 'Open orders' }]}
                grid={{ vertical: true }}
                margin={{ left: 85, right: 20, top: 25, bottom: 30 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Conclusion:{' '}
              {number(summary.UrgentOrders)
                ? `${summary.UrgentOrders} urgent order${number(summary.UrgentOrders) === 1 ? '' : 's'} require immediate attention.`
                : 'There are no urgent open orders; current priority exposure is controlled.'}
            </Typography>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MainCard title="Team workload">
            <Ranking rows={data.byAssignee} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Conclusion:{' '}
              {number(summary.UnassignedOrders)
                ? `${summary.UnassignedOrders} open order${number(summary.UnassignedOrders) === 1 ? ' has' : 's have'} no owner and should be assigned before execution capacity is evaluated.`
                : 'Every open work order has an accountable owner.'}
            </Typography>
          </MainCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Locations requiring attention">
            <Ranking rows={data.byLocation} colour="#D97706" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Conclusion:{' '}
              {topLocation
                ? `${topLocation.Name} has the largest active workload with ${number(topLocation.OpenCount)} open order${number(topLocation.OpenCount) === 1 ? '' : 's'}.`
                : 'No location concentration is currently visible.'}
            </Typography>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Most reported assets">
            <Ranking rows={data.byAsset} valueKey="Total" colour="#0B8F9C" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Conclusion:{' '}
              {topAsset
                ? `${topAsset.Name} is the most frequently reported asset; consider a preventive inspection or replacement review.`
                : 'Asset-linked history is not yet sufficient for reliability analysis.'}
            </Typography>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Maintenance categories">
            <Ranking rows={data.byCategory} valueKey="Total" colour="#6D5BD0" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Conclusion:{' '}
              {topCategory
                ? `${topCategory.Name} is the leading maintenance demand category with ${number(topCategory.Total)} order${number(topCategory.Total) === 1 ? '' : 's'}.`
                : 'Categorize work orders to identify recurring maintenance demand.'}
            </Typography>
          </MainCard>
        </Grid>
      </Grid>

      <MainCard
        title="Management attention queue"
        secondary={
          <Button component={RouterLink} to="/hotel-manager/work-orders" endIcon={<ArrowRightOutlined />}>
            Open work orders
          </Button>
        }
      >
        <Stack spacing={1.25}>
          {(data.attention || []).map((item) => {
            const overdue = item.DueAt && new Date(item.DueAt) < new Date();
            return (
              <Box
                key={item.WorkOrderId}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: overdue ? 'error.main' : 'divider',
                  bgcolor: overdue ? 'error.lighter' : 'transparent',
                  borderRadius: 2
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                  <Box>
                    <Typography fontWeight={750}>
                      #{item.WorkOrderNumber} · {item.Title}
                    </Typography>
                    <Typography variant="caption" color={overdue ? 'error.main' : 'text.secondary'}>
                      {item.AssignedToLogin ? `Assigned to ${item.AssignedToLogin}` : 'Unassigned'} · Due {dueLabel(item.DueAt)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Chip
                      size="small"
                      label={item.Priority}
                      sx={{ color: priorityColours[item.Priority], borderColor: priorityColours[item.Priority] }}
                      variant="outlined"
                    />
                    {overdue ? (
                      <Chip size="small" label="OVERDUE" color="error" />
                    ) : (
                      <Chip size="small" label={item.Status.replaceAll('_', ' ')} />
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}
          {!(data.attention || []).length ? (
            <Typography color="text.secondary">No open work orders require management attention.</Typography>
          ) : null}
        </Stack>
      </MainCard>
    </Stack>
  );
}
