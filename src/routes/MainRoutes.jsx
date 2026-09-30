import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const GxMaestroCrud = Loadable(lazy(() => import('pages/maestros/gxMaestroCrud')));
const SecurityCatalogPage = Loadable(lazy(() => import('pages/seguridad/SecurityCatalogPage')));
const SecurityCompositePage = Loadable(lazy(() => import('pages/seguridad/SecurityCompositePage')));
const UserAssignmentsPage = Loadable(lazy(() => import('pages/seguridad/UserAssignmentsPage')));
const UserAssignmentActionsPage = Loadable(lazy(() => import('pages/seguridad/UserAssignmentActionsPage')));
const LocationsPage = Loadable(lazy(() => import('pages/hotel-manager/LocationsPage')));
const CategoriesPage = Loadable(lazy(() => import('pages/hotel-manager/CategoriesPage')));
const AssetsPage = Loadable(lazy(() => import('pages/hotel-manager/AssetsPage')));
const WorkOrdersPage = Loadable(lazy(() => import('pages/hotel-manager/WorkOrdersPage')));
const OperationsDashboard = Loadable(lazy(() => import('pages/hotel-manager/OperationsDashboard')));
const WorkBoardPage = Loadable(lazy(() => import('pages/hotel-manager/WorkBoardPage')));

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: '/', element: <OperationsDashboard /> },
    { path: 'dashboard', children: [{ path: 'default', element: <OperationsDashboard /> }] },
    { path: 'maestros-gx/empresas', element: <GxMaestroCrud key="gx-empresas" catalogName="empresas" /> },
    { path: 'maestros-gx/temporadas', element: <GxMaestroCrud key="gx-temporadas" catalogName="temporadas" /> },
    { path: 'maestros-gx/tipos-familia', element: <GxMaestroCrud key="gx-tipos-familia" catalogName="tiposFamilia" /> },
    { path: 'maestros-gx/familias', element: <GxMaestroCrud key="gx-familias" catalogName="familias" /> },
    { path: 'maestros-gx/especies', element: <GxMaestroCrud key="gx-especies" catalogName="especies" /> },
    { path: 'maestros-gx/variedades', element: <GxMaestroCrud key="gx-variedades-especies" catalogName="especies" /> },
    { path: 'maestros-gx/envases', element: <GxMaestroCrud key="gx-envases" catalogName="envases" /> },
    { path: 'maestros-gx/categorias-envase', element: <GxMaestroCrud key="gx-categorias-envases" catalogName="envases" /> },
    { path: 'maestros-gx/calibres', element: <GxMaestroCrud key="gx-calibres-especies" catalogName="especies" /> },
    { path: 'maestros-gx/productores', element: <GxMaestroCrud key="gx-productores" catalogName="productores" /> },
    { path: 'maestros-gx/cuarteles', element: <GxMaestroCrud key="gx-cuarteles-productores" catalogName="productores" /> },
    { path: 'maestros-gx/clientes', element: <GxMaestroCrud key="gx-clientes" catalogName="clientes" /> },
    { path: 'maestros-gx/agentes', element: <GxMaestroCrud key="gx-agentes" catalogName="agentes" /> },
    { path: 'maestros-gx/consignatarios', element: <GxMaestroCrud key="gx-consignatarios" catalogName="consignatarios" /> },
    { path: 'seguridad/usuarios', element: <SecurityCatalogPage catalogName="usuarios" /> },
    {
      path: 'seguridad/roles',
      element: (
        <SecurityCompositePage
          catalogs={[
            { name: 'roles', label: 'Roles' },
            { name: 'rolesUsuarios', label: 'Roles por usuario' }
          ]}
        />
      )
    },
    { path: 'seguridad/sistemas', element: <SecurityCatalogPage catalogName="sistemas" /> },
    { path: 'seguridad/modulos', element: <SecurityCatalogPage catalogName="modulos" /> },
    {
      path: 'seguridad/programas',
      element: (
        <SecurityCompositePage
          catalogs={[
            { name: 'programas', label: 'Programas' },
            { name: 'programaAcciones', label: 'Acciones' }
          ]}
        />
      )
    },
    { path: 'seguridad/asignaciones', element: <UserAssignmentsPage /> },
    { path: 'seguridad/asignaciones/acciones', element: <UserAssignmentActionsPage /> },
    { path: 'hotel-manager/dashboard', element: <OperationsDashboard /> },
    { path: 'hotel-manager/work-board', element: <WorkBoardPage /> },
    { path: 'hotel-manager/work-orders', element: <WorkOrdersPage /> },
    { path: 'hotel-manager/locations', element: <LocationsPage /> },
    { path: 'hotel-manager/categories', element: <CategoriesPage /> },
    { path: 'hotel-manager/assets', element: <AssetsPage /> }
  ]
};

export default MainRoutes;
