const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeFileName = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'listado';

const getFileTimestamp = () => new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');

const getColumnHeader = (column) => column.exportHeader || column.headerName || column.field;

const getCellValue = (row, column) => {
  if (column.exportValue) return column.exportValue(row);

  const rawValue = row[column.field];

  if (column.valueFormatter) {
    try {
      return column.valueFormatter(rawValue, row);
    } catch {
      return rawValue;
    }
  }

  return rawValue;
};

const getExportColumns = (columns = []) =>
  columns.filter((column) => column.field !== 'actions' && column.field !== 'select' && column.disableExport !== true);

const buildHtmlTable = (columns, rows) => {
  const exportColumns = getExportColumns(columns);
  const headerHtml = exportColumns.map((column) => `<th>${escapeHtml(getColumnHeader(column))}</th>`).join('');
  const rowsHtml = rows
    .map((row) => {
      const cells = exportColumns.map((column) => `<td>${escapeHtml(getCellValue(row, column) ?? '')}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
};

const buildReportHtml = ({ title, rows, columns, filters = [], includePrintScript = false }) => {
  const generatedAt = new Date().toLocaleString('es-CL');
  const activeFilters = filters.length > 0 ? filters : ['Sin filtros adicionales'];
  const filtersHtml = activeFilters.map((filter) => `<span>${escapeHtml(filter)}</span>`).join('');
  const printScript = includePrintScript
    ? '<script>window.onload = function () { setTimeout(function () { window.print(); }, 250); };</script>'
    : '';

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #222; margin: 24px; }
      h1 { font-size: 22px; margin: 0 0 8px; }
      .meta { color: #555; font-size: 12px; margin-bottom: 16px; }
      .filters { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 16px; }
      .filters span { border: 1px solid #d9d9d9; border-radius: 4px; padding: 4px 8px; font-size: 12px; }
      table { border-collapse: collapse; width: 100%; font-size: 11px; }
      th, td { border: 1px solid #d9d9d9; padding: 6px; text-align: left; vertical-align: top; }
      th { background: #f4f6f8; font-weight: 700; }
      tr:nth-child(even) td { background: #fbfbfb; }
      @media print { body { margin: 12mm; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">Generado: ${escapeHtml(generatedAt)} | Registros: ${rows.length}</div>
    <div class="filters">${filtersHtml}</div>
    ${buildHtmlTable(columns, rows)}
    ${printScript}
  </body>
</html>`;
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportRowsToExcel = ({ title, rows, columns, filters = [], fileName }) => {
  const html = buildReportHtml({ title, rows, columns, filters });
  const blob = new Blob([`\ufeff${html}`], {
    type: 'application/vnd.ms-excel;charset=utf-8'
  });

  downloadBlob(blob, `${sanitizeFileName(fileName || title)}_${getFileTimestamp()}.xls`);
};

export const openRowsPdfPrint = ({ title, rows, columns, filters = [] }) => {
  const reportWindow = window.open('', '_blank', 'width=1200,height=800');

  if (!reportWindow) return false;

  reportWindow.document.open();
  reportWindow.document.write(buildReportHtml({ title, rows, columns, filters, includePrintScript: true }));
  reportWindow.document.close();
  return true;
};
