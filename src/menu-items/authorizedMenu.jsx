import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BranchesOutlined from '@ant-design/icons/BranchesOutlined';
import FileOutlined from '@ant-design/icons/FileOutlined';

export const resolveProgramRoute = (route) => {
  const value = String(route || '').trim();
  return value.startsWith('/') ? value : null;
};

const deduplicatePrograms = (programs) =>
  programs.filter((program, index) => programs.findIndex((candidate) => candidate.url === program.url) === index);

export const buildAuthorizedMenu = (systems = [], user = null) => {
  const roles = Array.isArray(user?.roles) ? user.roles.map((role) => String(role).toUpperCase()) : [];
  const canManageSecurity = roles.includes('ADMINFULL') || Number(user?.nivelSeguridad || 0) >= 900;
  const authorizedSystems = systems
    .map((system) => {
      const modules = (system.modulos || [])
        .map((module) => {
          const programs = deduplicatePrograms(
            (module.programas || [])
              .map((program) => ({ ...program, url: resolveProgramRoute(program.llamadoGX) }))
              .filter((program) => program.url)
              .map((program) => ({
                id: `program-${system.sistCod}-${module.modCod}-${program.progCod}`,
                title:
                  {
                    '/maestros-gx/especies': 'Especies',
                    '/maestros-gx/tipos-familia': 'Tipos de familia',
                    '/maestros-gx/familias': 'Familias de articulos',
                    '/maestros-gx/envases': 'Envases',
                    '/maestros-gx/productores': 'Productores',
                    '/maestros-gx/clientes': 'Clientes',
                    '/maestros-gx/agentes': 'Agentes',
                    '/maestros-gx/consignatarios': 'Consignatarios'
                  }[program.url] || program.nombre,
                type: 'item',
                url: program.url,
                target: Boolean(program.target),
                icon: FileOutlined
              }))
          );
          if (canManageSecurity && Number(system.sistCod) === 1 && Number(module.modCod) === 1) {
            programs.push({
              id: 'program-security-roles',
              title: 'Roles y usuarios',
              type: 'item',
              url: '/seguridad/roles',
              target: false,
              icon: FileOutlined
            });
          }

          if (!programs.length) return null;
          return {
            id: `module-${system.sistCod}-${module.modCod}`,
            title: module.nombre,
            type: 'collapse',
            icon: BranchesOutlined,
            children: programs
          };
        })
        .filter(Boolean);

      if (!modules.length) return null;
      return {
        id: `system-${system.sistCod}`,
        title: system.nombre,
        type: 'collapse',
        icon: AppstoreOutlined,
        children: modules
      };
    })
    .filter(Boolean);

  if (!authorizedSystems.length) return null;
  return {
    id: 'authorized-systems',
    title: 'APERP',
    type: 'group',
    children: authorizedSystems
  };
};
