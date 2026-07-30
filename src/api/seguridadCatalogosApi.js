import api from './api';

const basePath = '/backendDocker/seguridad/catalogos';

const cleanPayload = (payload = {}) =>
  Object.entries(payload).reduce((result, [key, value]) => {
    if (value !== undefined && value !== '') result[key] = value;
    return result;
  }, {});

export const listSecurityCatalog = async (catalog, params = {}) =>
  (await api.get(`${basePath}/${catalog}`, { params: cleanPayload(params) })).data;

export const insertSecurityCatalog = async (catalog, payload) =>
  (await api.post(`${basePath}/${catalog}/insert`, cleanPayload(payload))).data;

export const updateSecurityCatalog = async (catalog, payload) =>
  (await api.put(`${basePath}/${catalog}/update`, cleanPayload(payload))).data;

export const deleteSecurityCatalog = async (catalog, payload) =>
  (await api.delete(`${basePath}/${catalog}/delete`, { data: cleanPayload(payload) })).data;

export const getRolePermissions = async (role) => (await api.get(`${basePath}/roles/${encodeURIComponent(role)}/permisos`)).data;

export const saveRolePermissions = async (role, payload) =>
  (await api.put(`${basePath}/roles/${encodeURIComponent(role)}/permisos`, payload)).data;

export const reapplyRolePermissions = async (role, payload = {}) =>
  (await api.post(`${basePath}/roles/${encodeURIComponent(role)}/reaplicar`, cleanPayload(payload))).data;

export const getUserRoles = async (login) => (await api.get(`${basePath}/usuarios/${encodeURIComponent(login)}/roles`)).data;

export const getUserAssignments = async (login) => (await api.get(`${basePath}/usuarios/${encodeURIComponent(login)}/asignaciones`)).data;

export const getUserSystemAssignments = async (login, systemCode) =>
  (await api.get(`${basePath}/usuarios/${encodeURIComponent(login)}/asignaciones/${encodeURIComponent(systemCode)}`)).data;

export const saveUserSystemAssignments = async (login, systemCode, payload) =>
  (await api.put(`${basePath}/usuarios/${encodeURIComponent(login)}/asignaciones/${encodeURIComponent(systemCode)}`, payload)).data;
