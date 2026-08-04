import api from './api';

const catalogPaths = {
  empresas: 'empresas',
  temporadas: 'temporadas',
  tiposFamilia: 'tipos-familia',
  familias: 'familias',
  especies: 'especies',
  variedades: 'variedades',
  calibres: 'calibres',
  envases: 'envases',
  categoriasEnvase: 'categorias-envase',
  productores: 'productores',
  cuarteles: 'cuarteles',
  clientes: 'clientes',
  agentes: 'agentes',
  consignatarios: 'consignatarios',
  comunas: 'comunas'
};

const getCatalogPath = (catalogName) => {
  const path = catalogPaths[catalogName];

  if (!path) {
    throw new Error(`Catalogo no configurado: ${catalogName}`);
  }

  return `/backendDocker/maestros/${path}`;
};

const cleanPayload = (payload = {}) =>
  Object.entries(payload).reduce((params, [key, value]) => {
    if (value !== undefined && value !== '') {
      params[key] = value;
    }

    return params;
  }, {});

export const listMaestro = async (catalogName, params = {}) => {
  const response = await api.get(getCatalogPath(catalogName), {
    params: cleanPayload(params)
  });

  return response.data;
};

export const insertMaestro = async (catalogName, payload) => {
  const response = await api.post(`${getCatalogPath(catalogName)}/insert`, cleanPayload(payload));

  return response.data;
};

export const updateMaestro = async (catalogName, payload) => {
  const response = await api.put(`${getCatalogPath(catalogName)}/update`, cleanPayload(payload));

  return response.data;
};

export const deleteMaestro = async (catalogName, payload) => {
  const response = await api.delete(`${getCatalogPath(catalogName)}/delete`, {
    data: cleanPayload(payload)
  });

  return response.data;
};
