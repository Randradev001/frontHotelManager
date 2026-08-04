import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DataGrid } from '@mui/x-data-grid';

import ClearOutlined from '@ant-design/icons/ClearOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ListExportButtons from 'components/ListExportButtons';
import MainCard from 'components/MainCard';
import { deleteMaestro, insertMaestro, listMaestro, updateMaestro } from 'api/maestrosApi';
import { useAuth } from 'contexts/AuthContext';
import { gxMaestrosConfig } from './gxMaestrosConfig';

const isFilled = (value) => value !== undefined && value !== null && value !== '';

const getDisplayLabel = (label = '') => label.replace(/\s*\([^)]*\)/g, '').trim();

const getFieldDisplayLabel = (config, fieldName) => {
  const field = config.fields.find((item) => item.name === fieldName);
  return getDisplayLabel(field?.label || fieldName);
};

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

const buildInitialFilters = (config) =>
  (config.filters || []).filter((filter) => !filter.hidden).reduce((filters, filter) => {
    filters[filter.name] = '';
    return filters;
  }, {});

const getVisibleFilters = (config) => (config.filters || []).filter((filter) => !filter.hidden);

const toFormValue = (field, value) => {
  if (!isFilled(value)) return '';

  if (field.type === 'date') {
    const dateValue = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(dateValue.getTime())) return String(value);

    return dateValue.toISOString().slice(0, 10);
  }

  return String(value);
};

const toPayloadValue = (field, value) => {
  if (!isFilled(value)) return null;

  if (field.type === 'number' || field.type === 'decimal') return Number(String(value).replace(',', '.'));

  return String(value).trim();
};

const formatCellValue = (field, value) => {
  if (!isFilled(value)) return '';

  if (field.type === 'date') {
    const dateValue = new Date(value);

    if (Number.isNaN(dateValue.getTime())) return String(value);

    return dateValue.toLocaleDateString('es-CL');
  }

  if (field.type === 'decimal') {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return numberValue.toLocaleString('es-CL', { maximumFractionDigits: 4 });
  }

  return value;
};

const getRowKey = (config, row) => config.primaryKey.map((fieldName) => row[fieldName]).join('|');

const getFixedValues = (config, filters) =>
  getVisibleFilters(config).reduce((values, filter) => {
    if (isFilled(filters[filter.name])) values[filter.name] = filters[filter.name];

    return values;
  }, { ...(config.contextParams || {}) });

const buildInitialValues = (config, initialData, fixedValues) =>
  config.fields.reduce((values, field) => {
    const fixedValue = fixedValues[field.name];
    const defaultValue = initialData ? undefined : field.defaultValue;
    const sourceValue = isFilled(fixedValue) ? fixedValue : initialData?.[field.name] ?? defaultValue;

    values[field.name] = toFormValue(field, sourceValue);
    return values;
  }, {});

const buildValidationSchema = (config) => {
  const shape = {};

  for (const field of config.fields) {
    let validator;
    const label = getDisplayLabel(field.label);

    if (field.type === 'number' || field.type === 'decimal') {
      validator = Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .typeError(`${label} debe ser numerico`)
        .nullable();

      if (field.type === 'number') {
        validator = validator.integer(`${label} debe ser entero`);
      }

      if (field.min !== undefined) {
        validator = validator.min(field.min, `${label} debe ser mayor o igual a ${field.min}`);
      }

      if (field.exclusiveMin !== undefined) {
        validator = validator.moreThan(field.exclusiveMin, `${label} debe ser mayor a ${field.exclusiveMin}`);
      }

      if (field.max !== undefined) {
        validator = validator.max(field.max, `${label} debe ser menor o igual a ${field.max}`);
      }
    } else {
      validator = Yup.string().trim().nullable();
    }

    if (field.type === 'text' && field.maxLength) {
      validator = validator.max(field.maxLength, `${label} maximo ${field.maxLength} caracteres`);
    }

    if (field.required || config.primaryKey.includes(field.name)) {
      validator = validator.required(`${label} es requerido`);
    }

    shape[field.name] = validator;
  }

  return Yup.object().shape(shape);
};

const buildPayload = (config, values) =>
  config.fields.reduce((payload, field) => {
    payload[field.name] = toPayloadValue(field, values[field.name]);

    return payload;
  }, {});

const getOptionSettings = (descriptor) => descriptor.optionSource || descriptor;

const getOptions = (optionSets, descriptor) => {
  if (descriptor.options) return descriptor.options;

  const settings = getOptionSettings(descriptor);
  return optionSets[settings.source] || [];
};

const getOptionValue = (option, descriptor) => {
  const settings = getOptionSettings(descriptor);

  if (settings.valueField) return option[settings.valueField];
  return option.value;
};

const getOptionLabel = (option, descriptor) => {
  const settings = getOptionSettings(descriptor);
  const value = getOptionValue(option, descriptor);
  const label = settings.labelField ? option[settings.labelField] : option.label;

  return label ? `${value} - ${label}` : String(value);
};

const findSelectedOption = (options, descriptor, selectedValue) =>
  options.find((option) => toFormValue(descriptor, getOptionValue(option, descriptor)) === selectedValue);

const getLookupDisplayValue = (options, descriptor, selectedValue) => {
  if (!isFilled(selectedValue)) return '';

  const selectedOption = findSelectedOption(options, descriptor, selectedValue);
  if (!selectedOption) return selectedValue;

  return getOptionLabel(selectedOption, descriptor);
};

const getLookupRows = (options, descriptor, searchText) => {
  const settings = getOptionSettings(descriptor);
  const normalizedSearch = searchText.trim().toLowerCase();

  return options
    .map((option, index) => {
      const rawValue = getOptionValue(option, descriptor);
      const value = toFormValue(descriptor, rawValue);
      const label = settings.labelField ? option[settings.labelField] : option.label;
      const display = getOptionLabel(option, descriptor);

      return {
        id: `${value || 'row'}-${index}`,
        value,
        label: label || '',
        display,
        option
      };
    })
    .filter((row) => {
      if (!normalizedSearch) return true;
      return row.display.toLowerCase().includes(normalizedSearch);
    });
};

const getFilterExportValue = (filter, value, optionSets) => {
  const options = getOptions(optionSets, filter);
  const selectedOption = options.find((option) => String(getOptionValue(option, filter)) === String(value));

  return selectedOption ? getOptionLabel(selectedOption, filter) : value;
};

const usesOptionSource = (config, source) =>
  [...(config.filters || []), ...(config.fields || [])].some((descriptor) => {
    const settings = getOptionSettings(descriptor);
    return settings.source === source;
  });

const speciesVarietyColumns = [
  { field: 'VarCod', headerName: 'Codigo', width: 110 },
  { field: 'VarNom', headerName: 'Variedad', flex: 1, minWidth: 200 },
  { field: 'varnomC', headerName: 'Nombre corto', width: 140 },
  { field: 'VarPLU', headerName: 'PLU', width: 140 },
  { field: 'VarSECod', headerName: 'Codigo SE', width: 140 }
];

const speciesCalibreColumns = [
  { field: 'CalCod', headerName: 'Orden', width: 120 },
  { field: 'Calibre', headerName: 'Calibre', flex: 1, minWidth: 220 }
];

const SpeciesRelations = ({ species, empCod, editable, onNotify }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [childForm, setChildForm] = useState({ open: false, mode: 'create', catalog: 'variedades', row: null });
  const [deleteChild, setDeleteChild] = useState(null);
  const speciesCode = species?.Especod;
  const enabled = isFilled(empCod) && isFilled(speciesCode);

  const varietiesQuery = useQuery({
    queryKey: ['gx-maestros', 'especies', 'detalle', 'variedades', empCod, speciesCode],
    queryFn: () => listMaestro('variedades', { Especod: speciesCode, limit: 1000 }),
    enabled
  });
  const calibresQuery = useQuery({
    queryKey: ['gx-maestros', 'especies', 'detalle', 'calibres', empCod, speciesCode],
    queryFn: () => listMaestro('calibres', { Especod: speciesCode, limit: 1000 }),
    enabled
  });

  const varieties = varietiesQuery.data?.data || [];
  const calibres = calibresQuery.data?.data || [];
  const activeCatalog = activeTab === 0 ? 'variedades' : 'calibres';
  const activeQuery = activeTab === 0 ? varietiesQuery : calibresQuery;
  const activeRows = activeTab === 0 ? varieties : calibres;
  const activeBaseColumns = activeTab === 0 ? speciesVarietyColumns : speciesCalibreColumns;

  const invalidateDetail = async (catalog) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['gx-maestros', 'especies', 'detalle', catalog, empCod, speciesCode] }),
      queryClient.invalidateQueries({ queryKey: ['gx-maestros', catalog] })
    ]);
  };

  const saveChildMutation = useMutation({
    mutationFn: ({ catalog, mode, payload }) =>
      mode === 'edit' ? updateMaestro(catalog, payload) : insertMaestro(catalog, payload),
    onSuccess: async (data, variables) => {
      await invalidateDetail(variables.catalog);
      setChildForm({ open: false, mode: 'create', catalog: variables.catalog, row: null });
      onNotify?.(data?.message || 'Detalle guardado correctamente', 'success');
    },
    onError: (error) => onNotify?.(getErrorMessage(error, 'No fue posible guardar el detalle'), 'error')
  });

  const deleteChildMutation = useMutation({
    mutationFn: ({ catalog, row }) => {
      const detailConfig = gxMaestrosConfig[catalog];
      const payload = detailConfig.primaryKey.reduce((values, fieldName) => {
        values[fieldName] = row[fieldName];
        return values;
      }, {});
      return deleteMaestro(catalog, payload);
    },
    onSuccess: async (data, variables) => {
      await invalidateDetail(variables.catalog);
      setDeleteChild(null);
      onNotify?.(data?.message || 'Detalle eliminado correctamente', 'success');
    },
    onError: (error) => onNotify?.(getErrorMessage(error, 'No fue posible eliminar el detalle'), 'error')
  });

  const activeColumns = useMemo(() => {
    if (!editable) return activeBaseColumns;
    return [
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                color="primary"
                aria-label="Editar detalle"
                onClick={() => setChildForm({ open: true, mode: 'edit', catalog: activeCatalog, row: params.row })}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                color="error"
                aria-label="Eliminar detalle"
                onClick={() => setDeleteChild({ catalog: activeCatalog, row: params.row })}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      },
      ...activeBaseColumns
    ];
  }, [activeBaseColumns, activeCatalog, editable]);

  const childConfig = gxMaestrosConfig[childForm.catalog];
  const childLabel = childForm.catalog === 'variedades' ? 'variedad' : 'calibre';
  const closeChildForm = () => setChildForm((current) => ({ ...current, open: false, row: null }));

  return (
    <Box sx={{ mt: 3, p: { xs: 1.5, sm: 2.25 }, bgcolor: '#F8FBFF', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
      >
        <Tabs value={activeTab} onChange={(event, value) => setActiveTab(value)}>
          <Tab label={'Variedades (' + varieties.length + ')'} />
          <Tab label={'Calibres (' + calibres.length + ')'} />
        </Tabs>
        {editable && (
          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => setChildForm({ open: true, mode: 'create', catalog: activeCatalog, row: null })}
          >
            {activeTab === 0 ? 'Nueva variedad' : 'Nuevo calibre'}
          </Button>
        )}
      </Stack>

      {activeQuery.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getErrorMessage(activeQuery.error, 'No fue posible cargar los datos relacionados')}
        </Alert>
      )}

      <Box sx={{ height: 360, width: '100%', mt: 2 }}>
        <DataGrid
          rows={activeRows}
          columns={activeColumns}
          loading={activeQuery.isLoading || activeQuery.isFetching}
          getRowId={(row) =>
            activeTab === 0
              ? String(row.EmpCod) + '|' + String(row.Especod) + '|' + String(row.VarCod)
              : String(row.EmpCod) + '|' + String(row.Especod) + '|' + String(row.Calibre)
          }
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={childForm.open} onClose={saveChildMutation.isPending ? undefined : closeChildForm} fullWidth maxWidth="md">
        <DialogTitle>{childForm.mode === 'edit' ? 'Editar ' + childLabel : 'Nuevo ' + childLabel}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {childConfig && (
            <MaestroForm
              config={childConfig}
              mode={childForm.mode}
              initialData={childForm.row}
              fixedValues={{ EmpCod: empCod, Especod: speciesCode }}
              optionSets={{ especies: [species] }}
              isSubmitting={saveChildMutation.isPending}
              onCancel={closeChildForm}
              onSubmit={(payload) =>
                saveChildMutation.mutate({
                  catalog: childForm.catalog,
                  mode: childForm.mode,
                  payload:
                    childForm.catalog === 'calibres' && childForm.mode === 'edit'
                      ? { ...payload, OriginalCalibre: childForm.row.Calibre }
                      : payload
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteChild)} onClose={deleteChildMutation.isPending ? undefined : () => setDeleteChild(null)} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar {deleteChild?.catalog === 'variedades' ? 'variedad' : 'calibre'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2">
            {deleteChild?.catalog === 'variedades' ? deleteChild?.row?.VarNom : deleteChild?.row?.Calibre}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" disabled={deleteChildMutation.isPending} onClick={() => setDeleteChild(null)}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteChildMutation.isPending}
            onClick={() => deleteChildMutation.mutate(deleteChild)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const categoryColumns = [
  { field: 'Catcod', headerName: 'Codigo', width: 120 },
  { field: 'CatNom', headerName: 'Categoria', flex: 1, minWidth: 220 },
  { field: 'CatNomC', headerName: 'Nombre corto', width: 150 },
  { field: 'CatnomExt', headerName: 'Nombre externo', width: 180 },
  { field: 'CatSECod', headerName: 'Codigo SE', width: 150 }
];

const cuartelColumns = [
  { field: 'CuarCod', headerName: 'Codigo', width: 120 },
  { field: 'CuarNom', headerName: 'Cuartel', flex: 1, minWidth: 260 },
  { field: 'CuarnomC', headerName: 'Nombre corto', width: 160 }
];

const singleDetailDefinitions = {
  envases: {
    catalog: 'categoriasEnvase',
    parentField: 'EnvCod',
    optionSource: 'envases',
    title: 'Categorias',
    singular: 'categoría',
    newLabel: 'Nueva categoría',
    columns: categoryColumns,
    rowLabel: (row) => row?.CatNom
  },
  productores: {
    catalog: 'cuarteles',
    parentField: 'ProdCod',
    optionSource: 'productores',
    title: 'Cuarteles',
    singular: 'cuartel',
    newLabel: 'Nuevo cuartel',
    columns: cuartelColumns,
    rowLabel: (row) => row?.CuarNom
  }
};

const SingleDetailRelations = ({ parentCatalog, parent, empCod, editable, onNotify }) => {
  const queryClient = useQueryClient();
  const definition = singleDetailDefinitions[parentCatalog];
  const detailConfig = gxMaestrosConfig[definition.catalog];
  const parentValue = parent?.[definition.parentField];
  const enabled = isFilled(empCod) && isFilled(parentValue);
  const [childForm, setChildForm] = useState({ open: false, mode: 'create', row: null });
  const [deleteChild, setDeleteChild] = useState(null);

  const detailsQuery = useQuery({
    queryKey: ['gx-maestros', parentCatalog, 'detalle', definition.catalog, empCod, parentValue],
    queryFn: () => listMaestro(definition.catalog, { [definition.parentField]: parentValue, limit: 1000 }),
    enabled
  });
  const rows = detailsQuery.data?.data || [];

  const invalidateDetail = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['gx-maestros', parentCatalog, 'detalle', definition.catalog, empCod, parentValue] }),
      queryClient.invalidateQueries({ queryKey: ['gx-maestros', definition.catalog] })
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: ({ mode, payload }) =>
      mode === 'edit' ? updateMaestro(definition.catalog, payload) : insertMaestro(definition.catalog, payload),
    onSuccess: async (data) => {
      await invalidateDetail();
      setChildForm({ open: false, mode: 'create', row: null });
      onNotify?.(data?.message || 'Detalle guardado correctamente', 'success');
    },
    onError: (error) => onNotify?.(getErrorMessage(error, 'No fue posible guardar el detalle'), 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (row) => {
      const payload = detailConfig.primaryKey.reduce((values, fieldName) => {
        values[fieldName] = row[fieldName];
        return values;
      }, {});
      return deleteMaestro(definition.catalog, payload);
    },
    onSuccess: async (data) => {
      await invalidateDetail();
      setDeleteChild(null);
      onNotify?.(data?.message || 'Detalle eliminado correctamente', 'success');
    },
    onError: (error) => onNotify?.(getErrorMessage(error, 'No fue posible eliminar el detalle'), 'error')
  });

  const columns = useMemo(() => {
    if (!editable) return definition.columns;
    return [
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                color="primary"
                aria-label="Editar detalle"
                onClick={() => setChildForm({ open: true, mode: 'edit', row: params.row })}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton size="small" color="error" aria-label="Eliminar detalle" onClick={() => setDeleteChild(params.row)}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      },
      ...definition.columns
    ];
  }, [definition, editable]);

  const closeChildForm = () => setChildForm((current) => ({ ...current, open: false, row: null }));
  const fixedValues = { EmpCod: empCod, [definition.parentField]: parentValue };
  const optionSets = { [definition.optionSource]: [parent] };

  return (
    <Box sx={{ mt: 3, p: { xs: 1.5, sm: 2.25 }, bgcolor: '#F8FBFF', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
        sx={{ py: 1.5 }}
      >
        <Typography variant="subtitle1">{definition.title + ' (' + rows.length + ')'}</Typography>
        {editable && (
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setChildForm({ open: true, mode: 'create', row: null })}>
            {definition.newLabel}
          </Button>
        )}
      </Stack>

      {detailsQuery.isError && (
        <Alert severity="error">{getErrorMessage(detailsQuery.error, 'No fue posible cargar los datos relacionados')}</Alert>
      )}

      <Box sx={{ height: 360, width: '100%', mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={detailsQuery.isLoading || detailsQuery.isFetching}
          getRowId={(row) => detailConfig.primaryKey.map((fieldName) => row[fieldName]).join('|')}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={childForm.open} onClose={saveMutation.isPending ? undefined : closeChildForm} fullWidth maxWidth="md">
        <DialogTitle>{childForm.mode === 'edit' ? 'Editar ' + definition.singular : definition.newLabel}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <MaestroForm
            config={detailConfig}
            mode={childForm.mode}
            initialData={childForm.row}
            fixedValues={fixedValues}
            optionSets={optionSets}
            isSubmitting={saveMutation.isPending}
            onCancel={closeChildForm}
            onSubmit={(payload) => saveMutation.mutate({ mode: childForm.mode, payload })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteChild)} onClose={deleteMutation.isPending ? undefined : () => setDeleteChild(null)} fullWidth maxWidth="xs">
        <DialogTitle>{'Eliminar ' + definition.singular}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2">{definition.rowLabel(deleteChild)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" disabled={deleteMutation.isPending} onClick={() => setDeleteChild(null)}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteChild)}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const MaestroForm = ({ config, mode, initialData, fixedValues, optionSets, isSubmitting, formId, hideActions = false, onCancel, onSubmit }) => {
  const [lookupState, setLookupState] = useState({ field: null, searchText: '' });
  const validationSchema = useMemo(() => buildValidationSchema(config), [config]);
  const initialValues = useMemo(() => buildInitialValues(config, initialData, fixedValues), [config, initialData, fixedValues]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => {
        onSubmit(buildPayload(config, values));
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue, setFieldTouched }) => {
        const lookupField = lookupState.field;
        const lookupOptions = lookupField ? getOptions(optionSets, lookupField) : [];
        const lookupRows = lookupField ? getLookupRows(lookupOptions, lookupField, lookupState.searchText) : [];
        const closeLookup = () => setLookupState({ field: null, searchText: '' });
        const selectLookupRow = (row) => {
          setFieldValue(lookupField.name, row.value);
          setFieldTouched(lookupField.name, true, false);
          closeLookup();
        };

        return (
        <form id={formId} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {config.fields.filter((field) => !field.hidden && !field.formHidden).map((field) => {
              const isKey = config.primaryKey.includes(field.name);
              const displayLabel = getDisplayLabel(field.label);
              const isFixed = isFilled(fixedValues[field.name]);
              const isRequired = field.required || isKey;
              const hasSelectOptions = Boolean(field.options || field.optionSource);
              const options = hasSelectOptions ? getOptions(optionSets, field) : [];
              const disabled =
                mode === 'view' || field.readOnly || (mode === 'edit' && isKey && !field.editableOnUpdate) || isFixed || (field.contextOnly && !field.optionSource);
              const usesLookup = Boolean(field.optionSource?.lookup);
              const selectedValue = values[field.name];
              const selectedValueHasOption =
                hasSelectOptions &&
                options.some((option) => toFormValue(field, getOptionValue(option, field)) === selectedValue);

              return (
                <Grid key={field.name} size={field.formSize || { xs: 12, md: 6 }}>
                  {usesLookup ? (
                    <TextField
                      fullWidth
                      id={`${field.name}-lookup`}
                      name={field.name}
                      label={displayLabel}
                      value={getLookupDisplayValue(options, field, values[field.name])}
                      onBlur={handleBlur}
                      disabled={disabled}
                      required={isRequired}
                      error={Boolean(touched[field.name] && errors[field.name])}
                      helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            {!isRequired && isFilled(values[field.name]) && (
                              <IconButton
                                edge="end"
                                disabled={disabled}
                                onClick={() => {
                                  setFieldValue(field.name, '');
                                  setFieldTouched(field.name, true, false);
                                }}
                                aria-label={`Limpiar ${displayLabel}`}
                              >
                                <ClearOutlined />
                              </IconButton>
                            )}
                            <IconButton
                              edge="end"
                              disabled={disabled}
                              onClick={() => setLookupState({ field, searchText: '' })}
                              aria-label={`Buscar ${displayLabel}`}
                            >
                              <SearchOutlined />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      select={hasSelectOptions}
                      id={field.name}
                      name={field.name}
                      label={displayLabel}
                      type={!hasSelectOptions ? (field.type === 'number' || field.type === 'decimal' ? 'number' : field.type) : undefined}
                      value={values[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={disabled}
                      required={isRequired}
                      error={Boolean(touched[field.name] && errors[field.name])}
                      helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
                      inputProps={{
                        ...(field.maxLength ? { maxLength: field.maxLength } : {}),
                        ...(field.type === 'decimal' ? { step: '0.0001' } : {}),
                        ...(field.min !== undefined ? { min: field.min } : {}),
                        ...(field.max !== undefined ? { max: field.max } : {}),
                        ...(field.exclusiveMin !== undefined ? { min: Number(field.exclusiveMin) + 0.0001 } : {})
                      }}
                      InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                    >
                      {hasSelectOptions && !isRequired && (
                        <MenuItem value="">
                          <em>Sin valor</em>
                        </MenuItem>
                      )}

                      {hasSelectOptions && isFilled(selectedValue) && !selectedValueHasOption && (
                        <MenuItem value={selectedValue}>{selectedValue}</MenuItem>
                      )}

                      {hasSelectOptions &&
                        options.map((option) => {
                          const optionValue = toFormValue(field, getOptionValue(option, field));

                          return (
                            <MenuItem key={`${field.name}-${optionValue}`} value={optionValue}>
                              {getOptionLabel(option, field)}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  )}
                </Grid>
              );
            })}

            {!hideActions && (
              <Grid size={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ClearOutlined />}
                    onClick={() => {
                      resetForm();
                      onCancel();
                    }}
                  >
                    {mode === 'view' ? 'Cerrar' : 'Cancelar'}
                  </Button>

                  {mode !== 'view' && (
                    <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={isSubmitting}>
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                  )}
                </Stack>
              </Grid>
            )}
          </Grid>

          <Dialog open={Boolean(lookupField)} onClose={closeLookup} fullWidth maxWidth="sm">
            <DialogTitle>{lookupField ? `Seleccionar ${getDisplayLabel(lookupField.label)}` : 'Seleccionar'}</DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  autoFocus
                  label="Buscar"
                  value={lookupState.searchText}
                  onChange={(event) => setLookupState((prev) => ({ ...prev, searchText: event.target.value }))}
                />

                <Box sx={{ height: 420, width: '100%' }}>
                  <DataGrid
                    rows={lookupRows}
                    columns={[
                      { field: 'value', headerName: 'Codigo', width: 140 },
                      { field: 'label', headerName: 'Descripcion', flex: 1, minWidth: 220 },
                      {
                        field: 'select',
                        headerName: '',
                        width: 130,
                        sortable: false,
                        filterable: false,
                        disableColumnMenu: true,
                        renderCell: (params) => (
                          <Button size="small" variant="text" onClick={() => selectLookupRow(params.row)}>
                            Seleccionar
                          </Button>
                        )
                      }
                    ]}
                    onRowDoubleClick={(params) => selectLookupRow(params.row)}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          page: 0,
                          pageSize: 10
                        }
                      }
                    }}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button color="secondary" onClick={closeLookup}>
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </form>
        );
      }}
    </Formik>
  );
};

const GxMaestroCrud = ({ catalogName }) => {
  const baseConfig = gxMaestrosConfig[catalogName];
  const { company } = useAuth();
  const config = useMemo(() => {
    if (!baseConfig?.contextParams || baseConfig.contextParams.EmpCod === undefined) return baseConfig;

    return {
      ...baseConfig,
      contextParams: { ...baseConfig.contextParams, EmpCod: company?.empCod },
      fields: baseConfig.fields.map((field) =>
        field.name === 'EmpCod' ? { ...field, defaultValue: company?.empCod } : field
      )
    };
  }, [baseConfig, company?.empCod]);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState(() => buildInitialFilters(config));
  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, mode: 'create', row: null });
  const [deleteRow, setDeleteRow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const visibleFilters = useMemo(() => getVisibleFilters(config), [config]);
  const scopedEmpCod = config.contextParams?.EmpCod;
  const needsEmpresasOptions = useMemo(() => usesOptionSource(config, 'empresas'), [config]);
  const needsTiposFamiliaOptions = useMemo(() => usesOptionSource(config, 'tiposFamilia'), [config]);
  const needsEspeciesOptions = useMemo(() => usesOptionSource(config, 'especies'), [config]);
  const needsEnvasesOptions = useMemo(() => usesOptionSource(config, 'envases'), [config]);
  const needsComunasOptions = useMemo(() => usesOptionSource(config, 'comunas'), [config]);
  const needsProductoresOptions = useMemo(() => usesOptionSource(config, 'productores'), [config]);

  const requiredFiltersReady = useMemo(
    () => visibleFilters.every((filter) => !filter.required || isFilled(filters[filter.name])),
    [visibleFilters, filters]
  );

  const listParams = useMemo(
    () => ({
      limit: 500,
      ...(config.contextParams || {}),
      q: activeSearch,
      ...filters
    }),
    [activeSearch, config.contextParams, filters]
  );

  const empresasQuery = useQuery({
    queryKey: ['gx-maestros', 'empresas', 'options'],
    queryFn: () => listMaestro('empresas', { limit: 1000 }),
    enabled: needsEmpresasOptions,
    staleTime: 5 * 60 * 1000
  });

  const tiposFamiliaQuery = useQuery({
    queryKey: ['gx-maestros', 'tiposFamilia', 'options', scopedEmpCod],
    queryFn: () => listMaestro('tiposFamilia', { EmpCod: scopedEmpCod, limit: 1000 }),
    enabled: needsTiposFamiliaOptions && isFilled(scopedEmpCod),
    staleTime: 5 * 60 * 1000
  });

  const especiesOptionsQuery = useQuery({
    queryKey: ['gx-maestros', 'especies', 'options', scopedEmpCod],
    queryFn: () => listMaestro('especies', { EmpCod: scopedEmpCod, limit: 1000 }),
    enabled: needsEspeciesOptions && isFilled(scopedEmpCod),
    staleTime: 5 * 60 * 1000
  });

  const envasesQuery = useQuery({
    queryKey: ['gx-maestros', 'envases', 'options', scopedEmpCod],
    queryFn: () => listMaestro('envases', { EmpCod: scopedEmpCod, limit: 1000 }),
    enabled: needsEnvasesOptions && isFilled(scopedEmpCod),
    staleTime: 5 * 60 * 1000
  });

  const comunasQuery = useQuery({
    queryKey: ['gx-maestros', 'comunas', 'options'],
    queryFn: () => listMaestro('comunas', { limit: 1000 }),
    enabled: needsComunasOptions,
    staleTime: 5 * 60 * 1000
  });

  const productoresQuery = useQuery({
    queryKey: ['gx-maestros', 'productores', 'options', scopedEmpCod],
    queryFn: () => listMaestro('productores', { EmpCod: scopedEmpCod, limit: 1000 }),
    enabled: needsProductoresOptions && isFilled(scopedEmpCod),
    staleTime: 5 * 60 * 1000
  });

  const optionSets = useMemo(
    () => ({
      empresas: empresasQuery.data?.data || [],
      tiposFamilia: tiposFamiliaQuery.data?.data || [],
      especies: especiesOptionsQuery.data?.data || [],
      envases: envasesQuery.data?.data || [],
      comunas: comunasQuery.data?.data || [],
      productores: productoresQuery.data?.data || []
    }),
    [empresasQuery.data, tiposFamiliaQuery.data, especiesOptionsQuery.data, envasesQuery.data, comunasQuery.data, productoresQuery.data]
  );

  const rowsQuery = useQuery({
    queryKey: ['gx-maestros', catalogName, 'rows', listParams],
    queryFn: () => listMaestro(config.apiName, listParams),
    enabled: requiredFiltersReady
  });

  const rows = rowsQuery.data?.data || [];
  const canExport = requiredFiltersReady && rows.length > 0 && !rowsQuery.isFetching;
  const fixedValues = useMemo(() => getFixedValues(config, filters), [config, filters]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const invalidateCurrentCatalog = () => {
    queryClient.invalidateQueries({ queryKey: ['gx-maestros', catalogName] });
    queryClient.invalidateQueries({ queryKey: ['gx-maestros', config.apiName] });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => insertMaestro(config.apiName, payload),
    onSuccess: (data) => {
      invalidateCurrentCatalog();
      queryClient.invalidateQueries({ queryKey: ['gx-maestros', config.apiName, 'options'] });
      setFormState({ open: false, mode: 'create', row: null });
      setSnackbar({
        open: true,
        message: data?.message || 'Registro creado',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: getErrorMessage(error, 'Error creando registro'),
        severity: 'error'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateMaestro(config.apiName, payload),
    onSuccess: (data) => {
      invalidateCurrentCatalog();
      setFormState({ open: false, mode: 'create', row: null });
      setSnackbar({
        open: true,
        message: data?.message || 'Registro actualizado',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: getErrorMessage(error, 'Error actualizando registro'),
        severity: 'error'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (row) => {
      const payload = config.primaryKey.reduce((values, fieldName) => {
        values[fieldName] = row[fieldName];
        return values;
      }, {});

      return deleteMaestro(config.apiName, payload);
    },
    onSuccess: (data) => {
      invalidateCurrentCatalog();
      setDeleteRow(null);
      setSnackbar({
        open: true,
        message: data?.message || 'Registro eliminado',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: getErrorMessage(error, 'Error eliminando registro'),
        severity: 'error'
      });
    }
  });

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: 'Acciones',
        width: config.allowDelete === false ? 116 : 168,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Visualizar">
              <Button
                size="small"
                variant="text"
                color="secondary"
                onClick={() => setFormState({ open: true, mode: 'view', row: params.row })}
                sx={{ minWidth: 36 }}
                aria-label="Visualizar registro"
              >
                <EyeOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Actualizar">
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => setFormState({ open: true, mode: 'edit', row: params.row })}
                sx={{ minWidth: 36 }}
                aria-label="Actualizar registro"
              >
                <EditOutlined />
              </Button>
            </Tooltip>

            {config.allowDelete !== false && (
              <Tooltip title="Eliminar">
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  onClick={() => setDeleteRow(params.row)}
                  sx={{ minWidth: 36 }}
                  aria-label="Eliminar registro"
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            )}
          </Stack>
        )
      },
      ...config.fields.filter((field) => !field.hidden && !field.listHidden).map((field) => ({
        field: field.name,
        headerName: getDisplayLabel(field.label),
        width: field.width,
        minWidth: field.minWidth,
        flex: field.flex,
        valueFormatter: (value) => formatCellValue(field, value)
      }))
    ],
    [config.allowDelete, config.fields]
  );

  const exportColumns = useMemo(
    () =>
      config.fields
        .filter((field) => !field.hidden && !field.listHidden)
        .map((field) => ({
          field: field.name,
          headerName: getDisplayLabel(field.label),
          exportValue: (row) => formatCellValue(field, row[field.name])
        })),
    [config.fields]
  );

  const exportFilters = useMemo(() => {
    const activeFilters = visibleFilters
      .filter((filter) => isFilled(filters[filter.name]))
      .map((filter) => `${getDisplayLabel(filter.label)}: ${getFilterExportValue(filter, filters[filter.name], optionSets)}`);

    if (isFilled(activeSearch)) activeFilters.push(`Buscar: ${activeSearch}`);

    return activeFilters;
  }, [activeSearch, filters, optionSets, visibleFilters]);

  const missingFilter = visibleFilters.find((filter) => filter.required && !isFilled(filters[filter.name]));

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [filterName]: value
      };

      for (const filter of visibleFilters) {
        if (filter.dependsOn === filterName) next[filter.name] = '';
      }

      return next;
    });
  };

  const handleClearFilters = () => {
    setFilters(buildInitialFilters(config));
    setSearchText('');
    setActiveSearch('');
  };

  const handleSubmit = (payload) => {
    if (formState.mode === 'edit') {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  const handleOpenCreate = () => {
    setFormState({ open: true, mode: 'create', row: null });
  };

  const handleExportNotify = ({ message, severity = 'info' }) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeForm = () => setFormState({ open: false, mode: 'create', row: null });
  const showHeaderDetails = ['especies', 'envases', 'productores'].includes(catalogName)
    && formState.open
    && ['view', 'edit'].includes(formState.mode)
    && Boolean(formState.row);
  const headerDetailLabel = { especies: 'especie', envases: 'envase', productores: 'productor' }[catalogName];

  if (!config) {
    return (
      <MainCard title="Maestro">
        <Alert severity="error">Catalogo no configurado</Alert>
      </MainCard>
    );
  }

  return (
    <MainCard title={config.title}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', lg: 'center' }}
          spacing={2}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1 }}>
            {visibleFilters.map((filter) => {
              const options = getOptions(optionSets, filter);
              const disabled = filter.dependsOn && !isFilled(filters[filter.dependsOn]);

              if (filter.type === 'text') {
                return (
                  <TextField
                    key={filter.name}
                    fullWidth
                    label={getDisplayLabel(filter.label)}
                    value={filters[filter.name] || ''}
                    onChange={(event) => handleFilterChange(filter.name, event.target.value)}
                    disabled={disabled}
                  />
                );
              }

              return (
                <TextField
                  key={filter.name}
                  select
                  fullWidth
                  label={getDisplayLabel(filter.label)}
                  value={filters[filter.name] || ''}
                  onChange={(event) => handleFilterChange(filter.name, event.target.value)}
                  disabled={disabled}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>

                  {options.map((option) => (
                    <MenuItem key={option[filter.valueField]} value={option[filter.valueField]}>
                      {getOptionLabel(option, filter)}
                    </MenuItem>
                  ))}
                </TextField>
              );
            })}

            <TextField
              fullWidth
              label="Buscar"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setActiveSearch(searchText);
              }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<SearchOutlined />} disabled={!requiredFiltersReady} onClick={() => setActiveSearch(searchText)}>
              Buscar
            </Button>

            <Button variant="outlined" color="secondary" startIcon={<ClearOutlined />} onClick={handleClearFilters}>
              Limpiar
            </Button>

            <ListExportButtons
              title={config.title}
              rows={rows}
              columns={exportColumns}
              filters={exportFilters}
              disabled={!canExport}
              onNotify={handleExportNotify}
            />

            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              Nuevo
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={config.level === 2 ? 'Detalle de cabecera' : 'Cabecera'} size="small" variant="outlined" color="primary" />
          {config.parentTable && config.level === 2 && <Chip label={`Contexto: ${config.parentTable}`} size="small" variant="outlined" />}
        </Stack>

        {!requiredFiltersReady && missingFilter && (
          <Alert severity="info">Seleccione {getDisplayLabel(missingFilter.label)} para listar {config.title}</Alert>
        )}

        {rowsQuery.isError && (
          <Alert severity="error">{getErrorMessage(rowsQuery.error, `Error cargando ${config.title}`)}</Alert>
        )}

        <Box sx={{ height: 560, width: '100%' }}>
          <DataGrid
            rows={requiredFiltersReady ? rows : []}
            columns={columns}
            loading={rowsQuery.isLoading || rowsQuery.isFetching}
            getRowId={(row) => getRowKey(config, row)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10
                }
              }
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Stack>

      <Dialog open={formState.open} onClose={closeForm} fullWidth maxWidth={showHeaderDetails ? 'lg' : 'md'}>
        <DialogTitle>
          {showHeaderDetails
            ? (formState.mode === 'edit' ? 'Editar ' : 'Visualizar ') + headerDetailLabel
            : (formState.mode === 'view' ? 'Visualizar' : formState.mode === 'edit' ? 'Editar' : 'Nuevo') + ' registro'}
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <MaestroForm
            config={config}
            mode={formState.mode}
            initialData={formState.row}
            fixedValues={fixedValues}
            optionSets={optionSets}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            formId={showHeaderDetails ? 'parent-header-form' : undefined}
            hideActions={showHeaderDetails}
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />

          {showHeaderDetails && catalogName === 'especies' && (
            <SpeciesRelations
              species={formState.row}
              empCod={company?.empCod}
              editable={formState.mode === 'edit'}
              onNotify={(message, severity = 'info') => setSnackbar({ open: true, message, severity })}
            />
          )}

          {showHeaderDetails && ['envases', 'productores'].includes(catalogName) && (
            <SingleDetailRelations
              parentCatalog={catalogName}
              parent={formState.row}
              empCod={company?.empCod}
              editable={formState.mode === 'edit'}
              onNotify={(message, severity = 'info') => setSnackbar({ open: true, message, severity })}
            />
          )}
        </DialogContent>

        {showHeaderDetails && (
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button color="secondary" variant="outlined" startIcon={<ClearOutlined />} onClick={closeForm}>
              {formState.mode === 'edit' ? 'Cancelar' : 'Cerrar'}
            </Button>
            {formState.mode === 'edit' && (
              <Button
                type="submit"
                form="parent-header-form"
                variant="contained"
                startIcon={<SaveOutlined />}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Guardando...' : 'Guardar cabecera'}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      <Dialog open={config.allowDelete !== false && Boolean(deleteRow)} onClose={() => setDeleteRow(null)} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar registro</DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2">
            {config.primaryKey.map((fieldName) => `${getFieldDisplayLabel(config, fieldName)}: ${deleteRow?.[fieldName]}`).join(' / ')}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={() => setDeleteRow(null)}>
            Cancelar
          </Button>

          <Button color="error" variant="contained" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteRow)}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default GxMaestroCrud;
