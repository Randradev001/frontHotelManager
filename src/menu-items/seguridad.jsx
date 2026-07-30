import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BranchesOutlined from '@ant-design/icons/BranchesOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

const seguridad = {
  id: 'seguridad-group',
  title: 'Administracion',
  type: 'group',
  children: [
    {
      id: 'seguridad',
      title: 'Seguridad',
      type: 'collapse',
      icon: LockOutlined,
      children: [
        { id: 'seg-usuarios', title: 'Usuarios', type: 'item', url: '/seguridad/usuarios', icon: TeamOutlined },
        { id: 'seg-roles', title: 'Roles y usuarios', type: 'item', url: '/seguridad/roles', icon: SafetyCertificateOutlined },
        { id: 'seg-sistemas', title: 'Sistemas', type: 'item', url: '/seguridad/sistemas', icon: AppstoreOutlined },
        { id: 'seg-modulos', title: 'Modulos', type: 'item', url: '/seguridad/modulos', icon: BranchesOutlined },
        { id: 'seg-programas', title: 'Programas y acciones', type: 'item', url: '/seguridad/programas', icon: AppstoreOutlined },
        { id: 'seg-asignaciones', title: 'Asignación de accesos', type: 'item', url: '/seguridad/asignaciones', icon: TeamOutlined },
        { id: 'seg-niveles', title: 'Niveles de seguridad', type: 'item', url: '/seguridad/niveles', icon: LockOutlined }
      ]
    }
  ]
};

export default seguridad;
