import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!authenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
