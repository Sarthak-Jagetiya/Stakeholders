import { useState } from 'react';
import PropTypes from 'prop-types';

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
  PRN,
  avatarUrl,
  scholarship,
  tuitionfees,
  eligibilityregistration,
  universityfees,
  library,
  other,
  cautionmoney,
  signature,
  total,
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
    window.location.href = `/transaction?prn=${PRN}`;
  };

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

        <TableCell align="center">{scholarship}</TableCell>
        <TableCell align="center">{tuitionfees}</TableCell>
        <TableCell align="center">{eligibilityregistration}</TableCell>
        <TableCell align="center">{universityfees}</TableCell>
        <TableCell align="center">{library}</TableCell>
        <TableCell align="center">{other}</TableCell>
        <TableCell align="center">{cautionmoney}</TableCell>
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
  PRN: PropTypes.any,
  avatarUrl: PropTypes.any,
  scholarship: PropTypes.any,
  tuitionfees: PropTypes.any,
  eligibilityregistration: PropTypes.any,
  universityfees: PropTypes.any,
  library: PropTypes.any,
  other: PropTypes.any,
  cautionmoney: PropTypes.any,
  signature: PropTypes.any,
  total: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
