import api from './api';

export const getCompanies = async (filters = {}) => {
  const response = await api.post('/dte/getCompanies', {
    params: filters
  });

  return response.data;
};

export const createCompany = async (payload) => {
  const response = await api.post('/dte/createCompany', payload);

  return response.data;
};

export const getComunas = async () => {
  const response = await api.post('/dte/getComunas');

  return response.data;
};

// ==============================
// CAF
// ==============================

export const getCafFiles = async () => {
  const response = await api.post('/dte/getCafFiles');

  return response.data;
};

export const uploadCaf = async (formData) => {
  const response = await api.post('/dte/uploadCaf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const disableCaf = async (id) => {
  const response = await api.put(`/dte/disableCaf/${id}`);

  return response.data;
};