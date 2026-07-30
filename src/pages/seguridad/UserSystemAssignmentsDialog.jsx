import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserSystemAssignments, saveUserSystemAssignments } from 'api/seguridadCatalogosApi';

const moduleKey = (row) => String(row.Modcod);
const programKey = (row) => `${row.Modcod}|${row.ProgCod}`;
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function UserSystemAssignmentsDialog({ open, login, system, onClose, onSaved, onNotify }) {
  const queryClient = useQueryClient();
  const systemCode = system?.SistCod;
  const [systemAssigned, setSystemAssigned] = useState(false);
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [selectedPrograms, setSelectedPrograms] = useState(new Set());
  const [activeModuleCode, setActiveModuleCode] = useState('');
  const [search, setSearch] = useState('');
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const assignmentsQuery = useQuery({
    queryKey: ['gx-seguridad', 'user-assignments', login, systemCode],
    queryFn: () => getUserSystemAssignments(login, systemCode),
    enabled: open && Boolean(login) && systemCode !== undefined
  });
  const assignments = assignmentsQuery.data?.data;

  useEffect(() => {
    if (!open || !assignments) return;

    const assignedModules = assignments.modules.filter((module) => Boolean(module.assigned));
    const firstModule =
      assignedModules.find((module) => Number(module.assignedPrograms) > 0) || assignedModules[0] || assignments.modules[0];

    setSystemAssigned(Boolean(assignments.system.assigned));
    setSelectedModules(new Set(assignedModules.map(moduleKey)));
    setSelectedPrograms(new Set(assignments.programs.filter((program) => Boolean(program.assigned)).map(programKey)));
    setActiveModuleCode(firstModule ? moduleKey(firstModule) : '');
    setSearch('');
    setDirty(false);
    setConfirmClose(false);
  }, [assignments, open]);

  const activeModule = assignments?.modules.find((module) => moduleKey(module) === activeModuleCode);
  const visiblePrograms = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (assignments?.programs || []).filter((program) => {
      if (String(program.Modcod) !== activeModuleCode) return false;
      return !term || `${program.ProgCod} ${program.ProgDes || ''}`.toLowerCase().includes(term);
    });
  }, [activeModuleCode, assignments?.programs, search]);

  const selectedByModule = useMemo(() => {
    const totals = new Map();
    for (const program of assignments?.programs || []) {
      if (!selectedPrograms.has(programKey(program))) continue;
      const key = moduleKey(program);
      totals.set(key, (totals.get(key) || 0) + 1);
    }
    return totals;
  }, [assignments?.programs, selectedPrograms]);

  const allVisibleSelected = visiblePrograms.length > 0 && visiblePrograms.every((program) => selectedPrograms.has(programKey(program)));

  const toggleSystem = (checked) => {
    setSystemAssigned(checked);
    if (!checked) {
      setSelectedModules(new Set());
      setSelectedPrograms(new Set());
    }
    setDirty(true);
  };

  const toggleModule = (module, checked) => {
    const key = moduleKey(module);
    setSelectedModules((current) => {
      const next = new Set(current);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });

    if (checked) {
      setSystemAssigned(true);
    } else {
      setSelectedPrograms((current) => {
        const next = new Set(current);
        for (const program of assignments?.programs || []) {
          if (moduleKey(program) === key) next.delete(programKey(program));
        }
        return next;
      });
    }
    setDirty(true);
  };

  const toggleProgram = (program, checked) => {
    setSelectedPrograms((current) => {
      const next = new Set(current);
      if (checked) next.add(programKey(program));
      else next.delete(programKey(program));
      return next;
    });

    if (checked) {
      setSystemAssigned(true);
      setSelectedModules((current) => new Set(current).add(moduleKey(program)));
    }
    setDirty(true);
  };

  const toggleVisiblePrograms = () => {
    setSelectedPrograms((current) => {
      const next = new Set(current);
      for (const program of visiblePrograms) {
        if (allVisibleSelected) next.delete(programKey(program));
        else next.add(programKey(program));
      }
      return next;
    });

    if (!allVisibleSelected && activeModule) {
      setSystemAssigned(true);
      setSelectedModules((current) => new Set(current).add(moduleKey(activeModule)));
    }
    setDirty(true);
  };

  const buildPayload = () => ({
    assigned: systemAssigned,
    modules: (assignments?.modules || [])
      .filter((module) => selectedModules.has(moduleKey(module)))
      .map((module) => ({
        Modcod: Number(module.Modcod),
        programs: (assignments?.programs || [])
          .filter((program) => moduleKey(program) === moduleKey(module) && selectedPrograms.has(programKey(program)))
          .map((program) => Number(program.ProgCod))
      }))
  });

  const saveMutation = useMutation({
    mutationFn: () => saveUserSystemAssignments(login, systemCode, buildPayload()),
    onSuccess: async (response) => {
      setDirty(false);
      queryClient.setQueryData(['gx-seguridad', 'user-assignments', login, systemCode], { data: response.data });
      await queryClient.invalidateQueries({ queryKey: ['gx-seguridad', 'user-assignments', login] });
      onSaved?.(response.data);
      onNotify?.(response?.message || 'Asignaciones guardadas correctamente', 'success');
    },
    onError: (error) => onNotify?.(getErrorMessage(error, 'No fue posible guardar las asignaciones'), 'error')
  });

  const requestClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  const discardAndClose = () => {
    setConfirmClose(false);
    setDirty(false);
    onClose();
  };

  const assignedModuleCount = selectedModules.size;
  const assignedProgramCount = selectedPrograms.size;

  return (
    <>
      <Dialog open={open} onClose={saveMutation.isPending ? undefined : requestClose} fullWidth maxWidth="lg">
        <DialogTitle>Asignar módulos y programas</DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 3 }}>
          {assignmentsQuery.isLoading && (
            <Stack alignItems="center" sx={{ py: 8 }}>
              <CircularProgress size={32} />
            </Stack>
          )}

          {assignmentsQuery.isError && (
            <Alert severity="error">{getErrorMessage(assignmentsQuery.error, 'No fue posible cargar las asignaciones')}</Alert>
          )}

          {assignments && (
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography variant="h5">
                    {assignments.system.SistCod} - {assignments.system.SistNombre}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {assignments.user.UsuLogin} - {assignments.user.Usunom}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    color={systemAssigned ? 'success' : 'default'}
                    label={systemAssigned ? 'Sistema asignado' : 'Sin asignar'}
                  />
                  <Chip size="small" variant="outlined" label={`${assignedModuleCount} módulos`} />
                  <Chip size="small" variant="outlined" label={`${assignedProgramCount} programas`} />
                </Stack>
              </Stack>

              <FormControlLabel
                control={<Switch checked={systemAssigned} onChange={(event) => toggleSystem(event.target.checked)} />}
                label={systemAssigned ? 'Sistema habilitado para el usuario' : 'Asignar este sistema al usuario'}
              />

              {dirty && (
                <Alert severity="info">
                  Hay cambios sin guardar. Al quitar un módulo o sistema también se quitarán sus programas y acciones directas.
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px minmax(0, 1fr)' }, gap: 2, minHeight: 440 }}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1.5 }}>
                    Módulos del sistema
                  </Typography>
                  <Divider />
                  <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                    {assignments.modules.map((module) => {
                      const key = moduleKey(module);
                      const checked = selectedModules.has(key);
                      const selectedCount = selectedByModule.get(key) || 0;
                      return (
                        <ListItemButton
                          key={key}
                          selected={key === activeModuleCode}
                          onClick={() => {
                            setActiveModuleCode(key);
                            setSearch('');
                          }}
                        >
                          <Checkbox
                            edge="start"
                            checked={checked}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => toggleModule(module, event.target.checked)}
                            inputProps={{ 'aria-label': `Asignar módulo ${module.ModDes}` }}
                          />
                          <ListItemText
                            primary={`${module.Modcod} - ${module.ModDes}`}
                            secondary={`${selectedCount} de ${Number(module.totalPrograms || 0)} programas`}
                          />
                        </ListItemButton>
                      );
                    })}
                    {!assignments.modules.length && (
                      <Typography color="text.secondary" sx={{ p: 2 }}>
                        El sistema no tiene módulos configurados.
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, minWidth: 0, overflow: 'hidden' }}>
                  <Stack spacing={1.5} sx={{ p: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2">Programas{activeModule ? ` de ${activeModule.ModDes}` : ''}</Typography>
                        {activeModule && (
                          <Typography color="text.secondary" variant="caption">
                            Marcar un programa asigna automáticamente su módulo y sistema.
                          </Typography>
                        )}
                      </Box>
                      <Button size="small" disabled={!visiblePrograms.length} onClick={toggleVisiblePrograms}>
                        {allVisibleSelected ? 'Quitar visibles' : 'Asignar visibles'}
                      </Button>
                    </Stack>
                    <TextField
                      size="small"
                      fullWidth
                      label="Buscar programa"
                      value={search}
                      disabled={!activeModule}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </Stack>
                  <Divider />

                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {visiblePrograms.map((program) => {
                      const key = programKey(program);
                      const checked = selectedPrograms.has(key);
                      return (
                        <ListItemButton key={key} divider selected={checked} onClick={() => toggleProgram(program, !checked)}>
                          <Checkbox
                            edge="start"
                            checked={checked}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => toggleProgram(program, event.target.checked)}
                            inputProps={{ 'aria-label': `Asignar programa ${program.ProgDes}` }}
                          />
                          <ListItemText primary={`${program.ProgCod} - ${program.ProgDes}`} />
                        </ListItemButton>
                      );
                    })}
                    {activeModule && !visiblePrograms.length && (
                      <Typography color="text.secondary" sx={{ p: 2 }}>
                        No hay programas para mostrar.
                      </Typography>
                    )}
                    {!activeModule && (
                      <Typography color="text.secondary" sx={{ p: 2 }}>
                        Seleccione un módulo para ver sus programas.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" disabled={saveMutation.isPending} onClick={requestClose}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            disabled={saveMutation.isPending || !assignments || !dirty}
            onClick={() => saveMutation.mutate()}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)} fullWidth maxWidth="xs">
        <DialogTitle>Descartar cambios</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Typography>Hay cambios de asignación sin guardar.</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setConfirmClose(false)}>
            Continuar editando
          </Button>
          <Button color="error" variant="contained" onClick={discardAndClose}>
            Descartar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserSystemAssignmentsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  login: PropTypes.string,
  system: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
  onNotify: PropTypes.func
};
