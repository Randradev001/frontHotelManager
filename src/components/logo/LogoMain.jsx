// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <svg width="128" height="36" viewBox="0 0 128 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conex">
      <rect x="1" y="4" width="28" height="28" rx="7" fill={theme.vars.palette.primary.main} />
      <path
        d="M21.6 13.2C20.35 11.9 18.55 11.1 16.35 11.1C12.25 11.1 9.2 14.05 9.2 18C9.2 21.95 12.25 24.9 16.35 24.9C18.55 24.9 20.35 24.1 21.6 22.8"
        stroke={theme.vars.palette.common.white}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M23.4 11.5L15.1 24.5" stroke={theme.vars.palette.primary.lighter} strokeWidth="2.2" strokeLinecap="round" />
      <text
        x="39"
        y="24.5"
        fill={theme.vars.palette.text.primary}
        fontFamily="Public Sans, Arial, sans-serif"
        fontSize="21"
        fontWeight="700"
        letterSpacing="0"
      >
        Conex
      </text>
    </svg>
  );
}
