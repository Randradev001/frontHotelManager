import api from './api';

export const login = async (credentials) => (await api.post('/backendDocker/seguridad/login', credentials)).data;
export const getSession = async () => (await api.get('/backendDocker/seguridad/session')).data;
export const logout = async () => api.post('/backendDocker/seguridad/logout');
export const changePassword = async (values) => api.put('/backendDocker/seguridad/password', values);

export default { login, getSession, logout, changePassword };
