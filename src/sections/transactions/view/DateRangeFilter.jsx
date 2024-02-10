import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function DateRangeFilter({ onDateFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    onDateFilter(startDate, endDate);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" onClick={handleFilter}>
        Apply Date Filter
      </Button>
    </Stack>
  );
}

DateRangeFilter.propTypes = {
  onDateFilter: PropTypes.func,
};
