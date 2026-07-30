// ==============================|| OVERRIDES - DATA GRID ||============================== //

export default function DataGrid(theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderColor: theme.vars.palette.divider,
          borderRadius: 8,
          backgroundColor: theme.vars.palette.background.paper,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.vars.palette.grey[100],
            color: theme.vars.palette.text.primary,
            borderBottomColor: theme.vars.palette.divider
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            letterSpacing: 0
          },
          '& .MuiDataGrid-cell': {
            borderColor: theme.vars.palette.divider
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: theme.vars.palette.primary.lighter
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: theme.vars.palette.primary.lighter,
            '&:hover': { backgroundColor: theme.vars.palette.primary[100] }
          },
          '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within': {
            outline: `2px solid ${theme.vars.palette.primary.main}`,
            outlineOffset: -2
          }
        }
      }
    }
  };
}
