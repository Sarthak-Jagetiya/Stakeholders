import { useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function ScholarshipTableRow({
  selected,
  id,
  PRN,
  avatarUrl,
  amount,
  date,
  transactionID,
  installment,
  remark,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    window.location.href = `/scholarship?id=${id}`;
  };

  const formattedDate = format(new Date(date), 'dd-MM-yyyy');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={PRN} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {PRN}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="center">{amount}</TableCell>

        <TableCell align="center">{formattedDate}</TableCell>

        <TableCell align="center">{transactionID}</TableCell>

        <TableCell align="center">{installment}</TableCell>

        <TableCell align="center">{remark}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
      </Popover>
    </>
  );
}

ScholarshipTableRow.propTypes = {
  id: PropTypes.number,
  PRN: PropTypes.string,
  avatarUrl: PropTypes.any,
  amount: PropTypes.number,
  transactionID: PropTypes.any,
  date: PropTypes.string,
  installment: PropTypes.string,
  remark: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
};
