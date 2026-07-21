import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - sample page
const Empresas = Loadable(lazy(() => import('pages/maestros/empresas')));
const CafGrid = Loadable(lazy(() => import('pages/maestros/cafGrid')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'empresas',
      element: <Empresas />
    },
    {
      path: 'caf',
      element: <CafGrid />
    }
  ]
};

export default MainRoutes;