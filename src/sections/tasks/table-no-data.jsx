import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  const isToken =
    typeof document !== 'undefined' &&
    document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  return (
    <TableRow>
      <TableCell align="center" colSpan={12} sx={{ py: 5 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            {isToken ? 'Not found' : 'Please Login to access.'}
          </Typography>

          <Typography variant="body2">
            {isToken ? 'No results found for &nbsp;' : 'You are not authorized to access'}
            {isToken ? <strong>&quot;{query}&quot;</strong> : ''}

            <br />
            {isToken ? 'Try checking for typos or using complete words.' : ''}
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
