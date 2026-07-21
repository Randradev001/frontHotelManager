import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

// icons
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  companyId: Yup.string().required('Debe seleccionar una empresa'),
  cafFile: Yup.mixed().required('Debe seleccionar un archivo CAF XML')
});

const CafForm = ({ companies = [], onSubmit, onCancel, isSubmitting = false }) => {
  const [selectedFileName, setSelectedFileName] = useState('');

  return (
    <Formik
      initialValues={{
        companyId: '',
        cafFile: null
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formData = new FormData();

        formData.append('companyId', values.companyId);
        formData.append('cafFile', values.cafFile);

        onSubmit(formData);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                id="companyId"
                name="companyId"
                label="Empresa"
                value={values.companyId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.companyId && errors.companyId)}
                helperText={touched.companyId && errors.companyId ? errors.companyId : ''}
              >
                <MenuItem value="">
                  <em>Seleccione empresa</em>
                </MenuItem>

                {companies.map((company) => (
                  <MenuItem key={company.Id} value={company.Id}>
                    {company.ComRazonSocial} - {company.ComRut}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: touched.cafFile && errors.cafFile ? 'error.main' : 'divider',
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Archivo CAF XML</Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <Button variant="outlined" component="label" startIcon={<UploadOutlined />}>
                      Seleccionar archivo
                      <input
                        hidden
                        type="file"
                        accept=".xml,text/xml,application/xml"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];

                          if (file) {
                            setFieldValue('cafFile', file);
                            setSelectedFileName(file.name);
                          }
                        }}
                      />
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      {selectedFileName || 'Ningún archivo seleccionado'}
                    </Typography>
                  </Stack>

                  {touched.cafFile && errors.cafFile && (
                    <Typography variant="caption" color="error">
                      {errors.cafFile}
                    </Typography>
                  )}

                  <Alert severity="info" sx={{ mt: 1 }}>
                    El archivo debe ser el XML CAF entregado por el SII.
                  </Alert>
                </Stack>
              </Box>
            </Grid>

            <Grid size={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={onCancel}>
                  Cancelar
                </Button>

                <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar CAF'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CafForm;