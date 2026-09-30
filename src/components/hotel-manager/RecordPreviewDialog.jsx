import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';

export default function RecordPreviewDialog({ open, title, record, fields, onClose }) {
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{title}</DialogTitle><DialogContent><Stack spacing={0}>{fields.map((field, index) => <Stack key={field.label} spacing={1} sx={{ py: 1.35 }}><Typography variant="caption" color="text.secondary" fontWeight={800}>{field.label}</Typography><Typography sx={{ whiteSpace: 'pre-wrap' }}>{field.render ? field.render(record) : (record?.[field.key] ?? '-')}</Typography>{index < fields.length - 1 ? <Divider /> : null}</Stack>)}</Stack></DialogContent></Dialog>;
}
RecordPreviewDialog.propTypes = { open: PropTypes.bool.isRequired, title: PropTypes.string.isRequired, record: PropTypes.object, fields: PropTypes.array.isRequired, onClose: PropTypes.func.isRequired };
