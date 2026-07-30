import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BranchesOutlined from '@ant-design/icons/BranchesOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

const icons = {
  ApartmentOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  CalendarOutlined,
  InboxOutlined,
  TeamOutlined
};

const maestros = {
  id: 'maestros-gx-group',
  title: 'CONEX-CO',
  type: 'group',
  children: [
    {
      id: 'maestros-gx',
      title: 'Maestros del Sistema',
      type: 'collapse',
      icon: icons.AppstoreOutlined,
      children: [
        {
          id: 'gx-empresas',
          title: 'Definicion de Empresa',
          type: 'item',
          url: '/maestros-gx/empresas',
          icon: icons.ApartmentOutlined
        },
        {
          id: 'gx-temporadas',
          title: 'Temporadas',
          type: 'item',
          url: '/maestros-gx/temporadas',
          icon: icons.CalendarOutlined
        },
        {
          id: 'gx-envases',
          title: 'Envases',
          type: 'item',
          url: '/maestros-gx/envases',
          icon: icons.InboxOutlined
        },
        {
          id: 'gx-especies',
          title: 'Especies',
          type: 'item',
          url: '/maestros-gx/especies',
          icon: icons.AppstoreOutlined
        },
        {
          id: 'gx-productores',
          title: 'Productores',
          type: 'item',
          url: '/maestros-gx/productores',
          icon: icons.TeamOutlined
        },
        {
          id: 'gx-clientes',
          title: 'Clientes',
          type: 'item',
          url: '/maestros-gx/clientes',
          icon: icons.TeamOutlined
        },
        {
          id: 'gx-agentes',
          title: 'Agentes',
          type: 'item',
          url: '/maestros-gx/agentes',
          icon: icons.BranchesOutlined
        },
        {
          id: 'gx-consignatarios',
          title: 'Consignatarios',
          type: 'item',
          url: '/maestros-gx/consignatarios',
          icon: icons.ApartmentOutlined
        }
      ]
    }
  ]
};

export default maestros;
