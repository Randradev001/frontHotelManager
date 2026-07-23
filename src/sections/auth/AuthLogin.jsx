import PropTypes from 'prop-types';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useAuth } from 'contexts/AuthContext';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ isDemo = false }) {
  const [remember, setRemember] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Formik
      initialValues={{ login: '', password: '', empCod: '', submit: null }}
      validationSchema={Yup.object({
        login: Yup.string().trim().max(10, 'El usuario admite hasta 10 caracteres').required('El usuario es obligatorio'),
        password: Yup.string().max(128, 'La clave es demasiado extensa').required('La clave es obligatoria'),
        empCod: companies.length ? Yup.number().required('Seleccione una empresa') : Yup.mixed()
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          const result = await login({ ...values, remember });
          if (result.requiresCompany) {
            setCompanies(result.companies);
            return;
          }
          navigate(location.state?.from?.pathname || '/', { replace: true });
        } catch (error) {
          setErrors({ submit: error.response?.data?.message || 'No fue posible iniciar sesion.' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {errors.submit && (
              <Grid size={12}>
                <Alert severity="error">{errors.submit}</Alert>
              </Grid>
            )}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="user-login">Usuario</InputLabel>
                <OutlinedInput
                  id="user-login"
                  name="login"
                  value={values.login}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  disabled={companies.length > 0}
                  fullWidth
                  error={Boolean(touched.login && errors.login)}
                />
              </Stack>
              {touched.login && errors.login && <FormHelperText error>{errors.login}</FormHelperText>}
            </Grid>
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-login">Clave</InputLabel>
                <OutlinedInput
                  id="password-login"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su clave"
                  autoComplete="current-password"
                  disabled={companies.length > 0}
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                        onClick={() => setShowPassword((visible) => !visible)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        color="secondary"
                        disabled={companies.length > 0}
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Grid>
            {companies.length > 0 && (
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel id="company-login-label">Empresa</InputLabel>
                  <Select
                    labelId="company-login-label"
                    id="company-login"
                    name="empCod"
                    value={values.empCod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    displayEmpty
                    error={Boolean(touched.empCod && errors.empCod)}
                  >
                    <MenuItem value="" disabled>
                      Seleccione una empresa
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.empCod} value={company.empCod}>
                        {company.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                {touched.empCod && errors.empCod && <FormHelperText error>{errors.empCod}</FormHelperText>}
              </Grid>
            )}
            <Grid sx={{ mt: -1 }} size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    color="primary"
                    size="small"
                    disabled={companies.length > 0}
                  />
                }
                label={<Typography variant="body2">Mantener la sesion iniciada</Typography>}
              />
            </Grid>
            <Grid size={12}>
              <AnimateButton>
                <Button fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={22} color="inherit" /> : companies.length ? 'Ingresar a la empresa' : 'Ingresar'}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
