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
import MailOutlined from '@ant-design/icons/MailOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';

export default function AuthLogin({ isDemo = false }) {
  const [remember, setRemember] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Formik
      initialValues={{ email: '', password: '', empCod: '', submit: null }}
      validationSchema={Yup.object({
        email: Yup.string()
          .trim()
          .email('Enter a valid email address')
          .max(80, 'Email can contain up to 80 characters')
          .required('Email is required'),
        password: Yup.string().max(10, 'The password can contain up to 10 characters').required('Password is required'),
        empCod: companies.length ? Yup.number().required('Select a hotel') : Yup.mixed()
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
          setErrors({ submit: error.response?.data?.message || 'Unable to sign in.' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleChange, handleSubmit, isSubmitting, setFieldTouched, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {errors.submit && (
              <Grid size={12}>
                <Alert severity="error">{errors.submit}</Alert>
              </Grid>
            )}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="user-email">Email address</InputLabel>
                <OutlinedInput
                  id="user-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onBlur={() => setFieldTouched('email', true)}
                  onChange={handleChange}
                  placeholder="name@hotel.ca"
                  autoComplete="username"
                  inputProps={{ maxLength: 80 }}
                  disabled={companies.length > 0}
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  startAdornment={
                    <InputAdornment position="start">
                      <MailOutlined aria-hidden="true" />
                    </InputAdornment>
                  }
                  sx={{ height: 52, bgcolor: 'background.paper' }}
                />
              </Stack>
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Grid>
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  id="password-login"
                  name="password"
                  value={values.password}
                  onBlur={() => setFieldTouched('password', true)}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  inputProps={{ maxLength: 10 }}
                  disabled={companies.length > 0}
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockOutlined aria-hidden="true" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  sx={{ height: 52, bgcolor: 'background.paper' }}
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Grid>
            {companies.length > 0 && (
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel id="company-login-label">Hotel</InputLabel>
                  <Select
                    labelId="company-login-label"
                    id="company-login"
                    name="empCod"
                    value={values.empCod}
                    onChange={handleChange}
                    onBlur={() => setFieldTouched('empCod', true)}
                    displayEmpty
                    error={Boolean(touched.empCod && errors.empCod)}
                    sx={{ height: 52, bgcolor: 'background.paper' }}
                  >
                    <MenuItem value="" disabled>
                      Select a hotel
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
            <Grid sx={{ mt: -0.5 }} size={12}>
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
                label={<Typography variant="body2">Keep me signed in</Typography>}
              />
            </Grid>
            <Grid size={12}>
              <AnimateButton>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  endIcon={!isSubmitting ? <ArrowRightOutlined /> : null}
                  sx={{ minHeight: 52, fontSize: '0.95rem' }}
                >
                  {isSubmitting ? <CircularProgress size={22} color="inherit" /> : companies.length ? 'Continue to hotel' : 'Sign in'}
                </Button>
              </AnimateButton>
            </Grid>
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                Need help? Contact your system administrator.
              </Typography>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
