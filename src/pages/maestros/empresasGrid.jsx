import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
  
  import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

import { DataGrid } from '@mui/x-data-grid';
import EmpresasForm from './empresasForm';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanies, createCompany, getComunas } from 'api/siiApi';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import ListExportButtons from 'components/ListExportButtons';

const FactCompaniesGrid = () => {
const queryClient = useQueryClient();
const [openForm, setOpenForm] = useState(false);
const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success'
});
const handleOpenForm = () => {
    setOpenForm(true);
};

const handleCloseForm = () => {
    setOpenForm(false);
};

const handleSubmitCompany = (payload) => {
    createCompanyMutation.mutate(payload);
};

const createCompanyMutation = useMutation({
  mutationFn: createCompany,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['InsertCompanies'] });
    setSnackbar({
      open: true,
      message: data?.message || 'Empresa guardada correctamente',
      severity: 'success'
    });
    
    handleCloseForm();
  },
  onError: (error) => {
    setSnackbar({
      open: true,
      message: error.response?.data?.message || 'Error al guardar la empresa',
      severity: 'error'
    });
    console.error('Error creando empresa:', error);
  }
});

const handleEditCompany = (company) => {
  console.log('Editar empresa:', company);

  setSelectedCompany(company);
  setOpenForm(true);
};

const handleDeleteCompany = (company) => {
  console.log('Eliminar empresa:', company);

  // Después aquí puedes abrir modal de confirmación
  // setSelectedCompany(company);
  // setOpenDelete(true);
};


  const {
    data: comunas = []
    } = useQuery({
    queryKey: ['comunas'],
    queryFn: getComunas
    });

const {
  data,
  isLoading: loadingRows
} = useQuery({
  queryKey: ['companies'],
  queryFn: getCompanies
});

const rows = data?.companies || [];

console.log(rows);

 const columns = [
  {
    field: 'ComRut',
    headerName: 'RUT',
    width: 150
  },
  {
    field: 'ComRazonSocial',
    headerName: 'Razón Social',
    flex: 1,
    minWidth: 220
  },
  {
    field: 'ComGiro',
    headerName: 'Giro',
    flex: 1,
    minWidth: 220
  },
  {
    field: 'ComDireccion',
    headerName: 'Dirección',
    flex: 1,
    minWidth: 220
  },
  {
    field: 'Comuna',
    headerName: 'Comuna',
    width: 160
  },
  {
    field: 'Ciudad',
    headerName: 'Ciudad',
    width: 150
  },
  {
    field: 'Region',
    headerName: 'Región',
    width: 220
  },
  {
    field: 'ComActiva',
    headerName: 'Estado',
    width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value ? 'Activa' : 'Inactiva'}
        color={params.value ? 'success' : 'default'}
        size="small"
        variant="outlined"
      />
    )
  },
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
      <Stack direction="row" spacing={1}>
        <IconButton size="medium" color="primary" onClick={() => handleEditCompany(params.row)}>
          <EditOutlined />
        </IconButton>

        <IconButton size="medium" color="error" onClick={() => handleDeleteCompany(params.row)}>
          <DeleteOutlined />
        </IconButton>
      </Stack>
    )
  }
];

const exportColumns = columns
  .filter((column) => column.field !== 'actions')
  .map((column) =>
    column.field === 'ComActiva'
      ? { ...column, exportValue: (row) => (row.ComActiva ? 'Activa' : 'Inactiva') }
      : column
  );

const handleExportNotify = ({ message, severity = 'info' }) => {
  setSnackbar({ open: true, message, severity });
};

  return (
    <><Box>
          <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 2 }}
          >
              <Typography variant="h5">Listado de empresas</Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <ListExportButtons
                  title="Listado de empresas"
                  rows={rows}
                  columns={exportColumns}
                  disabled={loadingRows || rows.length === 0}
                  onNotify={handleExportNotify}
                />

                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpenForm()}>
                    Nueva Empresa
                </Button>
              </Stack>
          </Stack>

          <Box sx={{ height: 520, width: '100%' }}>
             <DataGrid
                rows={rows}
                columns={columns}
                loading={loadingRows}
                getRowId={(row) => row.Id}
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
      </Box><Dialog
          open={openForm}
          onClose={handleCloseForm}
          fullWidth
          maxWidth="md"
      >
              <DialogTitle>Nueva Empresa</DialogTitle>

              <Divider />

              <DialogContent sx={{ p: 3 }}>
                  <EmpresasForm
                    comunas={comunas}
                    onSubmit={handleSubmitCompany}
                    onCancel={handleCloseForm}
                    isSubmitting={createCompanyMutation.isPending}
                  />
              </DialogContent>
          </Dialog>
          <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseForm}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
              <Alert
                 autoHideDuration={6000}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
              >
                  {snackbar.message}
              </Alert>
          </Snackbar>
      </>
  );
};

export default FactCompaniesGrid;

