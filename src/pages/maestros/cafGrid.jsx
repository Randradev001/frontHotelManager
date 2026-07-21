import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

// data-grid
import { DataGrid } from '@mui/x-data-grid';

// icons
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// react-query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// api
import { getCompanies } from 'api/siiApi';
import { getCafFiles, uploadCaf } from 'api/siiApi';

// project
import CafForm from './cafForm';

const CafGrid = () => {
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { data: companiesData, isLoading: loadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  });

  const companies = companiesData?.companies || [];

  const {
    data: cafData,
    isLoading: loadingCafFiles,
    isError: errorCafFiles
  } = useQuery({
    queryKey: ['cafFiles'],
    queryFn: getCafFiles
  });

  const rows = cafData?.cafFiles || [];

  const uploadCafMutation = useMutation({
    mutationFn: uploadCaf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cafFiles'] });

      setSnackbar({
        open: true,
        message: data?.message || 'CAF cargado correctamente',
        severity: 'success'
      });

      setOpenForm(false);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al cargar CAF',
        severity: 'error'
      });
    }
  });

  const handleSubmitCaf = (formData) => {
    uploadCafMutation.mutate(formData);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  /**
   * Botón preparado para validación criptográfica futura.
   * Después aquí puedes llamar un endpoint tipo:
   *
   * validateCafCrypto(row.Id)
   */
  const handleValidateCrypto = (row) => {
    setSnackbar({
      open: true,
      message: `Validación criptográfica pendiente para CAF ID ${row.Id}`,
      severity: 'info'
    });
  };

  const getValidationChip = (status) => {
    switch (status) {
      case 'CRYPTO_VALIDATED':
        return {
          label: 'Cripto validado',
          color: 'success'
        };

      case 'PENDING_CRYPTO':
        return {
          label: 'Pendiente cripto',
          color: 'warning'
        };

      case 'REJECTED':
        return {
          label: 'Rechazado',
          color: 'error'
        };

      case 'EXPIRED':
        return {
          label: 'Vencido',
          color: 'error'
        };

      default:
        return {
          label: status || 'Sin estado',
          color: 'default'
        };
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('es-CL');
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Validar',
      width: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const isCryptoValidated = params.row.ValidationStatus === 'CRYPTO_VALIDATED';

        return (
          <Button
            size="small"
            variant="outlined"
            disabled={isCryptoValidated}
            onClick={() => handleValidateCrypto(params.row)}
          >
            Validar
          </Button>
        );
      }
    },
        {
      field: 'Activo',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'ValidationStatus',
      headerName: 'Validación',
      width: 170,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const chip = getValidationChip(params.value);

        return <Chip label={chip.label} color={chip.color} size="small" variant="outlined" />;
      }
    },
    {
      field: 'ComRazonSocial',
      headerName: 'Empresa',
      flex: 1,
      minWidth: 220
    },
    {
      field: 'RutEmisor',
      headerName: 'RUT Emisor',
      width: 150
    },
    {
      field: 'TipoDte',
      headerName: 'Tipo DTE',
      width: 120
    },
    {
      field: 'FolioDesde',
      headerName: 'Folio Desde',
      width: 130
    },
    {
      field: 'FolioHasta',
      headerName: 'Folio Hasta',
      width: 130
    },
    {
      field: 'FolioActual',
      headerName: 'Folio Actual',
      width: 130
    },
    {
      field: 'FechaAutorizacion',
      headerName: 'Fecha Aut.',
      width: 150,
       renderCell: (params) => formatDate(params.row.FechaAutorizacion)
    },
    {
      field: 'FechaVencimiento',
      headerName: 'Vencimiento',
      width: 150,
      renderCell: (params) => formatDate(params.row.FechaVencimiento)
    },
    {
      field: 'Idk',
      headerName: 'IDK',
      width: 90
    },
    
    {
      field: 'ValidationMessage',
      headerName: 'Mensaje validación',
      minWidth: 300,
      flex: 1
    }
  ];

  return (
    <>
      <Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">Listado de CAF</Typography>

          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Cargar CAF
          </Button>
        </Stack>

        {errorCafFiles && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error cargando CAF
          </Alert>
        )}

        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loadingCafFiles}
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
      </Box>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Cargar CAF</DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <CafForm
            companies={companies}
            onSubmit={handleSubmitCaf}
            onCancel={() => setOpenForm(false)}
            isSubmitting={uploadCafMutation.isPending || loadingCompanies}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CafGrid;