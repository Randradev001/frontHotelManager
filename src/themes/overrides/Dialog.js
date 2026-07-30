// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '1px solid',
          borderColor: theme.vars.palette.divider,
          borderRadius: 8,
          backgroundImage: 'none',
          boxShadow: '0 20px 48px rgba(17, 24, 39, 0.16)'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 16px',
          fontSize: '1.125rem',
          fontWeight: 700,
          borderBottom: '1px solid',
          borderColor: theme.vars.palette.divider
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: '1px solid',
          borderColor: theme.vars.palette.divider
        }
      }
    }
  };
}
