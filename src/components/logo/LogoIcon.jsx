// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conex">
      <rect x="3" y="3" width="32" height="32" rx="9" fill={theme.vars.palette.primary.main} />
      <path
        d="M25.8 14.1C24.4 12.55 22.45 11.65 20.05 11.65C15.55 11.65 12.2 14.9 12.2 19C12.2 23.1 15.55 26.35 20.05 26.35C22.45 26.35 24.4 25.45 25.8 23.9"
        stroke={theme.vars.palette.common.white}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M27.6 12.2L18.3 26.2" stroke={theme.vars.palette.primary.lighter} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
