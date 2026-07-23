import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BranchesOutlined from '@ant-design/icons/BranchesOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import TagsOutlined from '@ant-design/icons/TagsOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

const icons = {
  ApartmentOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  CalendarOutlined,
  InboxOutlined,
  TagsOutlined,
  TeamOutlined
};

const maestros = {
  id: 'maestros-gx-group',
  title: 'Conex',
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
          id: 'gx-categorias-envase',
          title: 'Categorias de Envase',
          type: 'item',
          url: '/maestros-gx/categorias-envase',
          icon: icons.TagsOutlined
        },
        {
          id: 'gx-especies',
          title: 'Especies',
          type: 'item',
          url: '/maestros-gx/especies',
          icon: icons.AppstoreOutlined
        },
        {
          id: 'gx-variedades',
          title: 'Variedades',
          type: 'item',
          url: '/maestros-gx/variedades',
          icon: icons.BranchesOutlined
        },
        {
          id: 'gx-productores',
          title: 'Productores',
          type: 'item',
          url: '/maestros-gx/productores',
          icon: icons.TeamOutlined
        },
        {
          id: 'gx-cuarteles',
          title: 'Cuarteles',
          type: 'item',
          url: '/maestros-gx/cuarteles',
          icon: icons.BranchesOutlined
        },
        {
          id: 'gx-calibres',
          title: 'Calibres',
          type: 'item',
          url: '/maestros-gx/calibres',
          icon: icons.BranchesOutlined
        }
      ]
    }
  ]
};

export default maestros;
