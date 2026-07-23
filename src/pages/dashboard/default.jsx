import { Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { BarChart, LineChart, PieChart, chartsGridClasses } from '@mui/x-charts';

import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BranchesOutlined from '@ant-design/icons/BranchesOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const dailyLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const dailyOperationSeries = {
  recepcionKg: [18400, 22100, 19600, 24800, 21400, 15600, 6500],
  procesoCajas: [4820, 6340, 5980, 7210, 6860, 5220, 1680],
  despachoCajas: [3280, 4860, 5420, 6380, 7020, 4410, 1490]
};

const speciesLabels = ['Manzana', 'Cereza', 'Uva', 'Kiwi', 'Pera'];
const speciesBoxes = [14860, 11420, 7320, 5120, 4140];

const palletStatusData = [
  { id: 0, value: 186, label: 'Listos' },
  { id: 1, value: 92, label: 'En armado' },
  { id: 2, value: 74, label: 'Pendientes' },
  { id: 3, value: 34, label: 'Retenidos' }
];

const kpis = [
  {
    title: 'Recepcion fruta',
    count: '128.450 kg',
    percentage: 12.4,
    extra: '18 productores'
  },
  {
    title: 'Cajas procesadas',
    count: '42.860',
    percentage: 8.7,
    extra: '5 especies'
  },
  {
    title: 'Pallets armados',
    count: '386',
    percentage: 4.2,
    extra: '74 pendientes'
  },
  {
    title: 'Despachos hoy',
    count: '29',
    percentage: 6.8,
    extra: '7 por cerrar'
  }
];

const quickActions = [
  {
    title: 'Definicion de Empresa',
    description: 'Crear o mantener DEFEMP',
    to: '/maestros-gx/empresas',
    icon: ApartmentOutlined
  },
  {
    title: 'Temporadas',
    description: 'Abrir/cerrar TEMP01',
    to: '/maestros-gx/temporadas',
    icon: CalendarOutlined
  },
  {
    title: 'Especies',
    description: 'Mantener ESPECIES',
    to: '/maestros-gx/especies',
    icon: AppstoreOutlined
  },
  {
    title: 'Variedades',
    description: 'Segundo nivel ESPECIES1',
    to: '/maestros-gx/variedades',
    icon: BranchesOutlined
  },
  {
    title: 'Productores',
    description: 'Mantener PRODUCTORES',
    to: '/maestros-gx/productores',
    icon: TeamOutlined
  }
];

const processRows = [
  { folio: 'OP-24018', productor: 'Agricola Los Boldos', especie: 'Manzana', variedad: 'Gala', cajas: 6840, estado: 'En proceso' },
  { folio: 'OP-24019', productor: 'Fruticola Santa Rosa', especie: 'Cereza', variedad: 'Santina', cajas: 4120, estado: 'Palletizado' },
  { folio: 'OP-24020', productor: 'Exportadora Norte', especie: 'Uva', variedad: 'Thompson', cajas: 5320, estado: 'Etiquetado' },
  { folio: 'OP-24021', productor: 'Campos del Sur', especie: 'Kiwi', variedad: 'Hayward', cajas: 2160, estado: 'Recepcionado' }
];

const pendingMasters = [
  { label: 'Empresas sin codigo SAG', value: 2, color: 'warning' },
  { label: 'Especies sin PLU', value: 4, color: 'warning' },
  { label: 'Productores sin codigo SAG', value: 7, color: 'error' },
  { label: 'Temporadas activas', value: 1, color: 'success' }
];

const formatKg = (value) => `${Number(value).toLocaleString('es-CL')} kg`;
const formatBoxes = (value) => `${Number(value).toLocaleString('es-CL')} cajas`;

const getStatusColor = (status) => {
  if (status === 'Palletizado') return 'success';
  if (status === 'Etiquetado') return 'info';
  if (status === 'En proceso') return 'warning';
  return 'default';
};

function DailyOperationChart() {
  const theme = useTheme();

  return (
    <MainCard title="Recepcion, proceso y despacho">
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4">128.450 kg</Typography>
        <Typography variant="body2" color="text.secondary">
          Flujo simulado de la semana actual
        </Typography>
      </Stack>

      <LineChart
        hideLegend
        height={320}
        grid={{ horizontal: true }}
        xAxis={[{ data: dailyLabels, scaleType: 'point', disableLine: true, tickSize: 7 }]}
        yAxis={[{ disableLine: true, tickSize: 7 }]}
        series={[
          {
            id: 'recepcion',
            label: 'Recepcion kg',
            data: dailyOperationSeries.recepcionKg,
            color: theme.vars.palette.primary.main,
            showMark: false,
            area: true,
            valueFormatter: formatKg
          },
          {
            id: 'proceso',
            label: 'Proceso cajas',
            data: dailyOperationSeries.procesoCajas,
            color: theme.vars.palette.success.main,
            showMark: false,
            valueFormatter: formatBoxes
          },
          {
            id: 'despacho',
            label: 'Despacho cajas',
            data: dailyOperationSeries.despachoCajas,
            color: theme.vars.palette.warning.main,
            showMark: false,
            valueFormatter: formatBoxes
          }
        ]}
        margin={{ top: 20, bottom: 25, left: 20, right: 20 }}
        sx={{
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: theme.vars.palette.divider },
          '& .MuiChartsAxis-root.MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: 'transparent' },
          '& .MuiChartsAxis-root.MuiChartsAxis-directionY .MuiChartsAxis-tick': { stroke: 'transparent' }
        }}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label="Recepcion kg" color="primary" size="small" variant="outlined" />
        <Chip label="Proceso cajas" color="success" size="small" variant="outlined" />
        <Chip label="Despacho cajas" color="warning" size="small" variant="outlined" />
      </Stack>
    </MainCard>
  );
}

function SpeciesBoxesChart() {
  const theme = useTheme();

  return (
    <MainCard title="Cajas procesadas por especie">
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4">42.860</Typography>
        <Typography variant="body2" color="text.secondary">
          Mix de produccion para ordenes abiertas
        </Typography>
      </Stack>

      <BarChart
        hideLegend
        height={320}
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: speciesLabels,
            scaleType: 'band',
            disableLine: true,
            tickSize: 7,
            categoryGapRatio: 0.45
          }
        ]}
        yAxis={[{ disableLine: true, tickSize: 7 }]}
        series={[{ data: speciesBoxes, label: 'Cajas', color: theme.vars.palette.info.main, valueFormatter: formatBoxes }]}
        slotProps={{ bar: { rx: 5, ry: 5 } }}
        axisHighlight={{ x: 'none' }}
        margin={{ top: 20, bottom: 25, left: 20, right: 20 }}
        sx={{
          '& .MuiBarElement-root:hover': { opacity: 0.75 },
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: theme.vars.palette.divider },
          '& .MuiChartsAxis-root.MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: 'transparent' },
          '& .MuiChartsAxis-root.MuiChartsAxis-directionY .MuiChartsAxis-tick': { stroke: 'transparent' }
        }}
      />
    </MainCard>
  );
}

function PalletStatusChart() {
  const theme = useTheme();
  const colors = [
    theme.vars.palette.success.main,
    theme.vars.palette.info.main,
    theme.vars.palette.warning.main,
    theme.vars.palette.error.main
  ];

  return (
    <MainCard title="Estado de pallets">
      <PieChart
        hideLegend
        height={260}
        colors={colors}
        series={[
          {
            data: palletStatusData,
            innerRadius: 48,
            paddingAngle: 2,
            cornerRadius: 4,
            valueFormatter: (item) => `${item.value} pallets`
          }
        ]}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      />

      <Stack spacing={1}>
        {palletStatusData.map((item, index) => (
          <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors[index] }} />
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Stack>
            <Typography variant="subtitle2">{item.value}</Typography>
          </Stack>
        ))}
      </Stack>
    </MainCard>
  );
}

export default function DashboardDefault() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h5">Control de Exportaciones</Typography>
            <Typography variant="body2" color="text.secondary">
              Temporada simulada 2025-2026 - Packing y despacho de fruta
            </Typography>
          </Stack>

          <Button component={RouterLink} to="/maestros-gx/productores" variant="contained" startIcon={<PlusOutlined />}>
            Ingresar productor
          </Button>
        </Stack>
      </Grid>

      {kpis.map((item) => (
        <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <AnalyticEcommerce title={item.title} count={item.count} percentage={item.percentage} extra={item.extra} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, lg: 8 }}>
        <DailyOperationChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <PalletStatusChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 8 }}>
        <MainCard title="Operacion de planta" content={false}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Avance proceso diario</Typography>
                <Typography variant="h6">72%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={72} />
            </Stack>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 720 }} aria-label="operacion planta">
              <TableHead>
                <TableRow>
                  <TableCell>Orden proceso</TableCell>
                  <TableCell>Productor</TableCell>
                  <TableCell>Especie</TableCell>
                  <TableCell>Variedad</TableCell>
                  <TableCell align="right">Cajas</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processRows.map((row) => (
                  <TableRow key={row.folio} hover>
                    <TableCell>{row.folio}</TableCell>
                    <TableCell>{row.productor}</TableCell>
                    <TableCell>{row.especie}</TableCell>
                    <TableCell>{row.variedad}</TableCell>
                    <TableCell align="right">{row.cajas.toLocaleString('es-CL')}</TableCell>
                    <TableCell>
                      <Chip label={row.estado} color={getStatusColor(row.estado)} size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={2}>
          <MainCard title="Ingreso rapido">
            <Stack spacing={1}>
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Button
                    key={action.to}
                    component={RouterLink}
                    to={action.to}
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    startIcon={<Icon />}
                    sx={{ justifyContent: 'flex-start', py: 1 }}
                  >
                    {action.title}
                  </Button>
                );
              })}
            </Stack>
          </MainCard>

          <MainCard title="Alertas de maestros">
            <List sx={{ p: 0 }}>
              {pendingMasters.map((item) => (
                <ListItemButton key={item.label} divider>
                  <ListItemText primary={item.label} />
                  <Chip label={item.value} color={item.color} size="small" variant="outlined" />
                </ListItemButton>
              ))}
            </List>
          </MainCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <SpeciesBoxesChart />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Resumen documental">
          <Stack spacing={2}>
            <Alert severity="info" icon={<ExportOutlined />}>
              Simulacion: 14 pallets listos para packing list y 7 guias pendientes de cierre.
            </Alert>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Etiquetas emitidas</Typography>
              <Typography variant="h6">38.420</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Cajas con lectura</Typography>
              <Typography variant="h6">36.980</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Diferencia por validar</Typography>
              <Typography variant="h6">1.440</Typography>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard title="Foco migracion">
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Los maestros visibles usan nombres reales de GeneXus y respetan Empresa como llave de trabajo.
            </Typography>
            <Chip label="DEFEMP / TEMP01 / ESPECIES / ESPECIES1 / PRODUCTORES" variant="outlined" />
            <Button component={RouterLink} to="/maestros-gx/empresas" variant="contained" color="primary">
              Revisar maestros base
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
