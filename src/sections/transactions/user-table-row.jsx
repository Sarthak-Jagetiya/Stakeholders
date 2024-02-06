import { useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format'; // Import date-fns format function

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  PRN,
  avatarUrl,
  scholarship,
  tuitionfees,
  eligibilityregistration,
  universityfees,
  library,
  collegeexam,
  cautionmoney,
  developmentfee,
  other,
  signature,
  academicyear,
  yearname,
  remark,
  date,
  total,
  paymenttype,
  utr,
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
    window.location.href = `/transaction?id=${id}`;
  };

  // Format date to dd-mm-yyyy
  const formattedDate = format(new Date(date), 'dd-MM-yyyy');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>
        <TableCell component="th" scope="row" padding="none" style={{ paddingLeft: '45px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={PRN} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {PRN}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="center">{scholarship}</TableCell>
        <TableCell align="center">{tuitionfees}</TableCell>
        <TableCell align="center">{eligibilityregistration}</TableCell>
        <TableCell align="center">{universityfees}</TableCell>
        <TableCell align="center">{library}</TableCell>
        <TableCell align="center">{collegeexam}</TableCell>
        <TableCell align="center">{cautionmoney}</TableCell>
        <TableCell align="center">{developmentfee}</TableCell>
        <TableCell align="center">{other}</TableCell>
        <TableCell align="center">{academicyear}</TableCell> {/* Added field */}
        <TableCell align="center">{yearname}</TableCell> {/* Added field */}
        <TableCell align="center">{remark}</TableCell> {/* Added field */}
        <TableCell align="center" sx={{ minWidth: 120 }}>
          {formattedDate}
        </TableCell>
        <TableCell align="center">{paymenttype}</TableCell> {/* Added field */}
        <TableCell align="center">{utr}</TableCell> {/* Added field */}
        <TableCell align="center">
          <Label color="success">{total}</Label>
        </TableCell>
        <TableCell
          align="center"
          style={{ textDecoration: 'underline', textDecorationThickness: 'thick' }}
        >
          {signature}
        </TableCell>
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

        {/* <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  // Adjust the prop types based on your transactions data structure
  id: PropTypes.any,
  PRN: PropTypes.any,
  avatarUrl: PropTypes.any,
  scholarship: PropTypes.any,
  tuitionfees: PropTypes.any,
  eligibilityregistration: PropTypes.any,
  universityfees: PropTypes.any,
  library: PropTypes.any,
  collegeexam: PropTypes.any,
  cautionmoney: PropTypes.any,
  developmentfee: PropTypes.any,
  other: PropTypes.any,
  signature: PropTypes.any,
  academicyear: PropTypes.any, // Added field
  yearname: PropTypes.any, // Added field
  remark: PropTypes.any, // Added field
  date: PropTypes.any, // Added field
  paymenttype: PropTypes.any,
  utr: PropTypes.any,
  total: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
