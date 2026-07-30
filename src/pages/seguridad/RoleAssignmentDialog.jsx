import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DataGrid } from '@mui/x-data-grid';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import UserDeleteOutlined from '@ant-design/icons/UserDeleteOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteSecurityCatalog, getUserRoles, insertSecurityCatalog, reapplyRolePermissions } from 'api/seguridadCatalogosApi';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function RoleAssignmentDialog({ open, user, companyCode, onClose, onChanged, onConfigureRole, onNotify }) {
  const queryClient = useQueryClient();
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [operationError, setOperationError] = useState('');
  const [reapplyRole, setReapplyRole] = useState(null);
  const login = String(user?.UsuLogin || '').trim();

  useEffect(() => {
    if (!open) return;
    setAvailableSearch('');
    setAssignedSearch('');
    setOperationError('');
    setReapplyRole(null);
  }, [open, login]);

  const assignmentsQuery = useQuery({
    queryKey: ['gx-seguridad', 'user-roles', companyCode, login],
    queryFn: () => getUserRoles(login),
    enabled: open && Boolean(login),
    refetchOnMount: 'always'
  });

  const userRoles = assignmentsQuery.data?.data;

  const assignedRows = useMemo(
    () =>
      (userRoles?.roles || [])
        .filter((role) => Boolean(role.assigned))
        .map((role) => ({
          ...role,
          ROLCod: String(role.ROLCod || '').trim(),
          ROLNombre: String(role.ROLNombre || '').trim()
        })),
    [userRoles?.roles]
  );

  const availableRows = useMemo(
    () =>
      (userRoles?.roles || [])
        .filter((role) => !role.assigned)
        .map((role) => ({
          ...role,
          ROLCod: String(role.ROLCod || '').trim(),
          ROLNombre: String(role.ROLNombre || '').trim()
        })),
    [userRoles?.roles]
  );

  const filterRows = (rows, search) => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => (row.ROLCod + ' ' + row.ROLNombre).toLowerCase().includes(term));
  };

  const refreshAssignments = async () => {
    await queryClient.invalidateQueries({ queryKey: ['gx-seguridad', 'user-roles', companyCode, login] });
    await queryClient.invalidateQueries({ queryKey: ['gx-seguridad', 'rolesUsuarios'] });
    await queryClient.invalidateQueries({ queryKey: ['gx-seguridad', 'roles'] });
    onChanged?.();
  };

  const assignMutation = useMutation({
    mutationFn: (role) => insertSecurityCatalog('rolesUsuarios', { UsuLogin: login, ROLCod: role.ROLCod }),
    onSuccess: async (data) => {
      setOperationError('');
      await refreshAssignments();
      onNotify?.(data?.message || 'Rol asignado correctamente', 'success');
    },
    onError: (error) => {
      setOperationError(getErrorMessage(error, 'No fue posible asignar el rol'));
    }
  });

  const removeMutation = useMutation({
    mutationFn: (role) => deleteSecurityCatalog('rolesUsuarios', { UsuLogin: login, ROLCod: role.ROLCod }),
    onSuccess: async (data) => {
      setOperationError('');
      await refreshAssignments();
      onNotify?.(data?.message || 'Rol quitado correctamente', 'success');
    },
    onError: (error) => {
      setOperationError(getErrorMessage(error, 'No fue posible quitar el rol'));
    }
  });

  const reapplyMutation = useMutation({
    mutationFn: (role) => reapplyRolePermissions(role.ROLCod, { UsuLogin: login }),
    onSuccess: async (data) => {
      setOperationError('');
      setReapplyRole(null);
      await queryClient.invalidateQueries({ queryKey: ['gx-seguridad'] });
      onNotify?.(data?.message || 'Permisos del usuario actualizados correctamente', 'success');
    },
    onError: (error) => {
      setOperationError(getErrorMessage(error, 'No fue posible reaplicar el rol'));
      setReapplyRole(null);
    }
  });

  const busy = assignMutation.isPending || removeMutation.isPending || reapplyMutation.isPending;
  const userLabel = userRoles?.user?.Usunom ? login + ' - ' + String(userRoles.user.Usunom).trim() : login;
  const totals = userRoles?.totals || {};

  const baseColumns = [
    { field: 'ROLCod', headerName: 'Rol', width: 140 },
    { field: 'ROLNombre', headerName: 'Nombre del rol', flex: 1, minWidth: 190 }
  ];

  const availableColumns = [
    ...baseColumns,
    {
      field: 'assign',
      headerName: '',
      width: 64,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="Asignar rol">
          <span>
            <IconButton
              color="primary"
              size="small"
              disabled={busy}
              onClick={() => assignMutation.mutate(params.row)}
              aria-label={'Asignar rol ' + params.row.ROLCod}
            >
              <UserAddOutlined />
            </IconButton>
          </span>
        </Tooltip>
      )
    }
  ];

  const assignedColumns = [
    ...baseColumns,
    {
      field: 'configure',
      headerName: '',
      width: 52,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="Configurar plantilla del rol">
          <IconButton
            color="secondary"
            size="small"
            disabled={busy}
            onClick={() => onConfigureRole?.(params.row)}
            aria-label={'Configurar permisos del rol ' + params.row.ROLCod}
          >
            <SafetyCertificateOutlined />
          </IconButton>
        </Tooltip>
      )
    },
    {
      field: 'reapply',
      headerName: '',
      width: 52,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="Reaplicar permisos al usuario">
          <IconButton
            color="primary"
            size="small"
            disabled={busy}
            onClick={() => setReapplyRole(params.row)}
            aria-label={'Reaplicar rol ' + params.row.ROLCod + ' a ' + login}
          >
            <ReloadOutlined />
          </IconButton>
        </Tooltip>
      )
    },
    {
      field: 'remove',
      headerName: '',
      width: 64,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="Quitar rol">
          <span>
            <IconButton
              color="error"
              size="small"
              disabled={busy}
              onClick={() => removeMutation.mutate(params.row)}
              aria-label={'Quitar rol ' + params.row.ROLCod}
            >
              <UserDeleteOutlined />
            </IconButton>
          </span>
        </Tooltip>
      )
    }
  ];

  return (
    <>
      <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="lg">
        <DialogTitle>Administrar roles del usuario</DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Typography variant="subtitle1">{userLabel || 'Usuario no seleccionado'}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" color="primary" label={`${Number(totals.assignedRoles || 0)} roles`} />
                <Chip size="small" variant="outlined" label={`${Number(totals.directSystems || 0)} sistemas directos`} />
                <Chip size="small" variant="outlined" label={`${Number(totals.directModules || 0)} módulos directos`} />
                <Chip size="small" variant="outlined" label={`${Number(totals.directPrograms || 0)} programas directos`} />
              </Stack>
            </Stack>

            {Number(totals.directPrograms || 0) > 0 && (
              <Alert severity="info">Los accesos directos se mantienen separados de los roles y no se modifican desde este diálogo.</Alert>
            )}

            {(operationError || assignmentsQuery.isError) && (
              <Alert severity="error">
                {operationError || getErrorMessage(assignmentsQuery.error, 'No fue posible consultar los roles del usuario')}
              </Alert>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                minHeight: 470
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">Roles disponibles ({availableRows.length})</Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Buscar rol disponible"
                  value={availableSearch}
                  onChange={(event) => setAvailableSearch(event.target.value)}
                />
                <Box sx={{ height: 410, width: '100%' }}>
                  <DataGrid
                    rows={filterRows(availableRows, availableSearch)}
                    columns={availableColumns}
                    getRowId={(row) => row.ROLCod}
                    loading={assignmentsQuery.isLoading}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Roles asignados ({assignedRows.length})</Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Buscar rol asignado"
                  value={assignedSearch}
                  onChange={(event) => setAssignedSearch(event.target.value)}
                />
                <Box sx={{ height: 410, width: '100%' }}>
                  <DataGrid
                    rows={filterRows(assignedRows, assignedSearch)}
                    columns={assignedColumns}
                    getRowId={(row) => row.ROLCod}
                    loading={assignmentsQuery.isLoading}
                    localeText={{ noRowsLabel: 'Este usuario no tiene roles asignados en la empresa actual' }}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="secondary" disabled={busy} onClick={onClose}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(reapplyRole)} onClose={busy ? undefined : () => setReapplyRole(null)} fullWidth maxWidth="sm">
        <DialogTitle>Verificar rol del usuario</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="info">
            Los permisos de {login} se calculan desde sus asignaciones GX8 y todos sus roles vigentes, sin modificar permisos directos.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" disabled={busy} onClick={() => setReapplyRole(null)}>
            Cancelar
          </Button>
          <Button color="warning" variant="contained" disabled={busy} onClick={() => reapplyMutation.mutate(reapplyRole)}>
            Verificar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

RoleAssignmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  companyCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func,
  onConfigureRole: PropTypes.func,
  onNotify: PropTypes.func
};
