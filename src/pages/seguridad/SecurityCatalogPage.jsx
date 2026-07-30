import PropTypes from 'prop-types';
import SecurityCrud from './SecurityCrud';

export default function SecurityCatalogPage({ catalogName }) {
  return <SecurityCrud catalogName={catalogName} />;
}

SecurityCatalogPage.propTypes = { catalogName: PropTypes.string.isRequired };
