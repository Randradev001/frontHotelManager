import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import MainCard from 'components/MainCard';
import { getUserAssignments, listSecurityCatalog } from 'api/seguridadCatalogosApi';
import UserSystemAssignmentsDialog from './UserSystemAssignmentsDialog';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function UserAssignmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const login = String(searchParams.get('usuario') || '')
    .trim()
    .toUpperCase();
  const [systemSearch, setSystemSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const usersQuery = useQuery({
    queryKey: ['gx-seguridad', 'usuarios', 'assignment-options'],
    queryFn: () => listSecurityCatalog('usuarios', { limit: 1000 }),
    staleTime: 5 * 60 * 1000
  });
  const users = usersQuery.data?.data || [];
  const selectedUser = users.find((user) => String(user.UsuLogin).trim().toUpperCase() === login) || null;

  const assignmentsQuery = useQuery({
    queryKey: ['gx-seguridad', 'user-assignments', login],
    queryFn: () => getUserAssignments(login),
    enabled: Boolean(login)
  });
  const assignments = assignmentsQuery.data?.data;

  const rows = useMemo(() => {
    const term = systemSearch.trim().toLowerCase();
    return (assignments?.systems || []).filter(
      (system) => !term || `${system.SistCod} ${system.SistNombre || ''}`.toLowerCase().includes(term)
    );
  }, [assignments?.systems, systemSearch]);

  const columns = useMemo(
    () => [
      { field: 'SistCod', headerName: 'Código', width: 100 },
      { field: 'SistNombre', headerName: 'Sistema', flex: 1, minWidth: 230 },
      {
        field: 'assigned',
        headerName: 'Estado',
        width: 130,
        renderCell: (params) => (
          <Chip size="small" color={params.value ? 'success' : 'default'} label={params.value ? 'Asignado' : 'Sin asignar'} />
        )
      },
      {
        field: 'assignedModules',
        headerName: 'Módulos asignados',
        width: 180,
        renderCell: (params) => (
          <Button size="small" variant="text" onClick={() => setSelectedSystem(params.row)}>
            {Number(params.value || 0)} de {Number(params.row.totalModules || 0)}
          </Button>
        )
      },
      {
        field: 'assignedPrograms',
        headerName: 'Programas asignados',
        width: 190,
        renderCell: (params) => (
          <Button size="small" variant="text" onClick={() => setSelectedSystem(params.row)}>
            {Number(params.value || 0)} de {Number(params.row.totalPrograms || 0)}
          </Button>
        )
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button size="small" startIcon={<SafetyCertificateOutlined />} onClick={() => setSelectedSystem(params.row)}>
            Administrar
          </Button>
        )
      }
    ],
    []
  );

  const selectUser = (user) => {
    setSelectedSystem(null);
    setSystemSearch('');
    setSearchParams(user ? { usuario: String(user.UsuLogin).trim() } : {});
  };

  return (
    <MainCard title="Asignación de accesos">
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="body1">Seleccione un usuario para administrar sus sistemas, módulos y programas directos.</Typography>
            <Typography color="text.secondary" variant="body2">
              Los permisos recibidos mediante roles se mantienen en la pantalla Roles y usuarios.
            </Typography>
          </Box>
          <Button component={RouterLink} to="/seguridad/asignaciones/acciones" variant="outlined">
            Acciones por programa
          </Button>
        </Stack>

        <Autocomplete
          options={users}
          value={selectedUser}
          loading={usersQuery.isLoading}
          getOptionLabel={(option) => `${String(option.UsuLogin || '').trim()} - ${String(option.Usunom || '').trim()}`}
          isOptionEqualToValue={(option, value) => String(option.UsuLogin).trim() === String(value.UsuLogin).trim()}
          onChange={(event, value) => selectUser(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Usuario"
              placeholder="Buscar por usuario o nombre"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {usersQuery.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }
              }}
            />
          )}
        />

        {!login && <Alert severity="info">Seleccione un usuario para comenzar una asignación inicial o modificar sus accesos.</Alert>}

        {assignmentsQuery.isLoading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {assignmentsQuery.isError && (
          <Alert severity="error">{getErrorMessage(assignmentsQuery.error, 'No fue posible cargar las asignaciones del usuario')}</Alert>
        )}

        {assignments && (
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h5">
                  {assignments.user.UsuLogin} - {assignments.user.Usunom}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip color="primary" label={`${Number(assignments.totals.systems || 0)} sistemas`} />
                  <Chip variant="outlined" label={`${Number(assignments.totals.modules || 0)} módulos`} />
                  <Chip variant="outlined" label={`${Number(assignments.totals.programs || 0)} programas`} />
                </Stack>
              </Box>
              <TextField
                size="small"
                label="Buscar sistema"
                value={systemSearch}
                onChange={(event) => setSystemSearch(event.target.value)}
                slotProps={{ input: { startAdornment: <SearchOutlined style={{ marginRight: 8 }} /> } }}
                sx={{ minWidth: { md: 300 } }}
              />
            </Stack>

            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.SistCod}
                onRowDoubleClick={(params) => setSelectedSystem(params.row)}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                disableRowSelectionOnClick
              />
            </Box>
          </Stack>
        )}
      </Stack>

      <UserSystemAssignmentsDialog
        open={Boolean(selectedSystem)}
        login={login}
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
        onSaved={() => assignmentsQuery.refetch()}
        onNotify={(message, severity) => setSnackbar({ open: true, message, severity })}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainCard>
  );
}
