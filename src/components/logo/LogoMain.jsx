// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <svg
      width="214"
      height="48"
      viewBox="0 0 214 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CONEX-CO, Control de exportación"
    >
      <rect x="13" y="12" width="25" height="25" rx="5" fill={theme.vars.palette.grey[200]} />
      <rect x="2" y="20" width="27" height="27" rx="6" fill={theme.vars.palette.primary.dark} />
      <rect x="26" y="1" width="27" height="27" rx="6" fill={theme.vars.palette.primary.main} />
      <text
        x="15.5"
        y="39.5"
        fill={theme.vars.palette.common.white}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="19"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="0"
      >
        C
      </text>
      <text
        x="39.5"
        y="21"
        fill={theme.vars.palette.common.white}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="18"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="0"
      >
        O
      </text>
      <text
        x="64"
        y="25"
        fill={theme.vars.palette.primary.darker}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="0"
      >
        CONEX-CO
      </text>
      <text
        x="64"
        y="40"
        fill={theme.vars.palette.text.secondary}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="0"
      >
        CONTROL DE EXPORTACIÓN
      </text>
    </svg>
  );
}
