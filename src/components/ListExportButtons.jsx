import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import FileExcelOutlined from '@ant-design/icons/FileExcelOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';

import { exportRowsToExcel, openRowsPdfPrint } from 'utils/listExport';

export default function ListExportButtons({ title, rows, columns, filters = [], disabled = false, onNotify }) {
  const canExport = !disabled && rows.length > 0;

  const notify = (message, severity = 'info') => {
    onNotify?.({ message, severity });
  };

  const ensureRows = () => {
    if (rows.length > 0) return true;

    notify('No hay datos para exportar');
    return false;
  };

  const handleExcel = () => {
    if (!ensureRows()) return;

    exportRowsToExcel({ title, rows, columns, filters });
  };

  const handlePdf = () => {
    if (!ensureRows()) return;

    const opened = openRowsPdfPrint({ title, rows, columns, filters });

    if (!opened) {
      notify('No se pudo abrir la ventana para generar PDF', 'warning');
    }
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      <Button variant="outlined" color="success" startIcon={<FileExcelOutlined />} disabled={!canExport} onClick={handleExcel}>
        Excel
      </Button>

      <Button variant="outlined" color="secondary" startIcon={<FilePdfOutlined />} disabled={!canExport} onClick={handlePdf}>
        PDF
      </Button>
    </Stack>
  );
}
