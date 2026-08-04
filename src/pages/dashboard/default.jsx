import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

import { useAuth } from 'contexts/AuthContext';

const workspaces = [
  {
    id: 'maestros',
    eyebrow: 'Operación',
    title: 'Datos maestros',
    description: 'Administre los catálogos operativos y sus relaciones de cabecera y detalle.',
    icon: DatabaseOutlined,
    to: '/maestros-gx/especies',
    tone: '#087DF1'
  },
  {
    id: 'empresas',
    eyebrow: 'Multiempresa',
    title: 'Empresas',
    description: 'Consulte el contexto empresarial disponible para la operación APERP.',
    icon: ApartmentOutlined,
    to: '/maestros-gx/empresas',
    tone: '#0B559B'
  },
  {
    id: 'usuarios',
    eyebrow: 'Seguridad',
    title: 'Usuarios',
    description: 'Gestione usuarios de la empresa autenticada sin exponer GECODEMP en pantalla.',
    icon: TeamOutlined,
    to: '/seguridad/usuarios',
    tone: '#073D75'
  },
  {
    id: 'roles',
    eyebrow: 'Autorización',
    title: 'Roles y permisos',
    description: 'Configure plantillas de acceso y asígnelas a los usuarios correspondientes.',
    icon: SafetyCertificateOutlined,
    to: '/seguridad/roles',
    tone: '#176B87'
  },
  {
    id: 'programas',
    eyebrow: 'GeneXus',
    title: 'Programas y acciones',
    description: 'Mantenga el catálogo de programas y su segundo nivel de acciones.',
    icon: AppstoreOutlined,
    to: '/seguridad/programas',
    tone: '#286B9E'
  },
  {
    id: 'asignaciones',
    eyebrow: 'Accesos',
    title: 'Asignaciones',
    description: 'Revise permisos directos y por rol dentro de la empresa activa.',
    icon: SettingOutlined,
    to: '/seguridad/asignaciones',
    tone: '#245E8C'
  }
];

function WorkspaceCard({ item }) {
  const Icon = item.icon;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 12px 32px rgba(6, 27, 54, 0.07)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.light',
          boxShadow: '0 20px 42px rgba(6, 27, 54, 0.13)'
        }
      }}
    >
      <CardActionArea component={RouterLink} to={item.to} sx={{ height: '100%', p: 0 }}>
        <Stack spacing={2.25} sx={{ height: '100%', minHeight: 230, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                width: 52,
                height: 52,
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                bgcolor: item.tone,
                borderRadius: 2.5,
                boxShadow: `0 12px 24px ${item.tone}35`
              }}
            >
              <Icon style={{ fontSize: 25 }} />
            </Box>
            <ArrowRightOutlined style={{ color: '#718198', fontSize: 18 }} />
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Typography
              component="p"
              sx={{ color: 'primary.main', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              {item.eyebrow}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.6, color: '#10233D', fontWeight: 800 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.15, fontSize: '0.82rem', lineHeight: 1.65 }}>
              {item.description}
            </Typography>
          </Box>
          <Typography sx={{ color: 'primary.dark', fontSize: '0.76rem', fontWeight: 750 }}>Abrir módulo</Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

WorkspaceCard.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    eyebrow: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    tone: PropTypes.string.isRequired
  }).isRequired
};

export default function DashboardDefault() {
  const { user, company } = useAuth();
  const firstName = String(user?.nombre || user?.login || 'Usuario').trim().split(/\s+/)[0];

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, sm: 4, lg: 5 },
          color: '#FFFFFF',
          borderRadius: 4,
          background: 'linear-gradient(120deg, #061B36 0%, #0B559B 58%, #1593FF 130%)',
          boxShadow: '0 24px 55px rgba(6, 27, 54, 0.18)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 320,
            height: 320,
            right: -105,
            top: -170,
            borderRadius: '50%',
            border: '60px solid rgba(125,211,252,0.12)'
          }}
        />
        <Stack spacing={1.5} sx={{ position: 'relative', maxWidth: 760 }}>
          <Chip
            label={company?.nombre || 'Empresa APERP'}
            sx={{ alignSelf: 'flex-start', color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}
          />
          <Typography variant="h2" sx={{ color: '#FFFFFF', fontWeight: 850, fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
            Hola, {firstName}. ¿Dónde trabajamos hoy?
          </Typography>
          <Typography sx={{ maxWidth: 650, color: 'rgba(255,255,255,0.72)', fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.65 }}>
            Acceda a las funciones ya migradas de APERP. Los permisos y la empresa activa se aplican automáticamente desde su sesión.
          </Typography>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h3" sx={{ color: '#10233D', fontWeight: 800 }}>
          Centro de trabajo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Módulos disponibles en esta etapa de la migración.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {workspaces.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, xl: 4 }}>
            <WorkspaceCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
