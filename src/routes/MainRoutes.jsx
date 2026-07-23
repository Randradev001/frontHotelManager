import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const GxMaestroCrud = Loadable(lazy(() => import('pages/maestros/gxMaestroCrud')));

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: 'dashboard', children: [{ path: 'default', element: <DashboardDefault /> }] },
    { path: 'maestros-gx/empresas', element: <GxMaestroCrud key="gx-empresas" catalogName="empresas" /> },
    { path: 'maestros-gx/temporadas', element: <GxMaestroCrud key="gx-temporadas" catalogName="temporadas" /> },
    { path: 'maestros-gx/especies', element: <GxMaestroCrud key="gx-especies" catalogName="especies" /> },
    { path: 'maestros-gx/variedades', element: <GxMaestroCrud key="gx-variedades" catalogName="variedades" /> },
    { path: 'maestros-gx/envases', element: <GxMaestroCrud key="gx-envases" catalogName="envases" /> },
    { path: 'maestros-gx/categorias-envase', element: <GxMaestroCrud key="gx-categorias-envase" catalogName="categoriasEnvase" /> },
    { path: 'maestros-gx/calibres', element: <GxMaestroCrud key="gx-calibres" catalogName="calibres" /> },
    { path: 'maestros-gx/productores', element: <GxMaestroCrud key="gx-productores" catalogName="productores" /> },
    { path: 'maestros-gx/cuarteles', element: <GxMaestroCrud key="gx-cuarteles" catalogName="cuarteles" /> }
  ]
};

export default MainRoutes;
