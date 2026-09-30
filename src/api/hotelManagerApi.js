import api from './api';

const basePath = '/backendDocker/hotel-manager';
export const getHotelDashboard = async (assignedToLogin) => (await api.get(`${basePath}/dashboard`, { params: assignedToLogin ? { assignedToLogin } : {} })).data;
export const listHotelUsers = async () => (await api.get(`${basePath}/users`)).data.data;
export const listAccessibleHotels = async () => (await api.get(`${basePath}/hotels`)).data.data;

export const listLocations = async () => (await api.get(`${basePath}/locations`)).data.data;
export const createLocation = async (payload) => (await api.post(`${basePath}/locations`, payload)).data;
export const updateLocation = async ({ locationId, ...payload }) => (await api.put(`${basePath}/locations/${locationId}`, payload)).data;
export const deleteLocation = async (locationId) => api.delete(`${basePath}/locations/${locationId}`);
export const listCategories = async () => (await api.get(`${basePath}/categories`)).data.data;
export const saveCategory = async ({ categoryId, ...payload }) => categoryId ? (await api.put(`${basePath}/categories/${categoryId}`, payload)).data : (await api.post(`${basePath}/categories`, payload)).data;
export const deleteCategory = async (categoryId) => api.delete(`${basePath}/categories/${categoryId}`);
export const listAssets=async()=>(await api.get(`${basePath}/assets`)).data.data; export const saveAsset=async({assetId,...p})=>assetId?(await api.put(`${basePath}/assets/${assetId}`,p)).data:(await api.post(`${basePath}/assets`,p)).data; export const deleteAsset=async(id)=>api.delete(`${basePath}/assets/${id}`);
export const listWorkOrders=async(hotelEmpCod)=>(await api.get(`${basePath}/work-orders`,{params:hotelEmpCod?{hotelEmpCod}:{}})).data.data; export const saveWorkOrder=async({workOrderId,...p})=>workOrderId?(await api.put(`${basePath}/work-orders/${workOrderId}`,p)).data:(await api.post(`${basePath}/work-orders`,p)).data; export const deleteWorkOrder=async(id,hotelEmpCod)=>api.delete(`${basePath}/work-orders/${id}`,{params:{hotelEmpCod}});
export const transitionWorkOrder=async(id,payload)=>(await api.post(`${basePath}/work-orders/${id}/transition`,payload)).data;
export const saveWorkOrderTasks=async(id,tasks,hotelEmpCod)=>(await api.put(`${basePath}/work-orders/${id}/tasks`,{tasks,hotelEmpCod})).data;
