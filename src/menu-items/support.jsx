// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Ingresos',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Empresas',
      type: 'item',
      url: '/empresas',
      icon: icons.ChromeOutlined
    },
        {
      id: 'caf',
      title: 'Caf Grid',
      type: 'item',
      url: '/caf',
      icon: icons.ChromeOutlined
    },
  /*  {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    } */
  ]
};

export default support;
