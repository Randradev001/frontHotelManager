// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CONEX-CO"
    >
      <rect x="11" y="11" width="22" height="22" rx="5" fill={theme.vars.palette.grey[200]} />
      <rect x="2" y="17" width="24" height="24" rx="6" fill={theme.vars.palette.primary.dark} />
      <rect x="20" y="1" width="21" height="23" rx="6" fill={theme.vars.palette.primary.main} />
      <text
        x="14"
        y="35"
        fill={theme.vars.palette.common.white}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="16"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="0"
      >
        C
      </text>
      <text
        x="30.5"
        y="18"
        fill={theme.vars.palette.common.white}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="15"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="0"
      >
        O
      </text>
    </svg>
  );
}
