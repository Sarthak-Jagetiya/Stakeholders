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

import Iconify from 'src/components/iconify';

export default function EmployeeTableRow({
  selected,
  eid,
  name,
  gender,
  phone,
  email,
  aadhar,
  designation,
  emergencycontact,
  college,
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
    window.location.href = `/employee?eid=${eid}`;
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* Uncomment the following lines if using Checkbox */}
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none" sx={{ paddingLeft: '30px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={name}
              src={`/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`}
            />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">{eid}</TableCell>

        <TableCell align="center">{gender}</TableCell>

        <TableCell align="center">{phone}</TableCell>

        <TableCell align="center">{email}</TableCell>

        <TableCell align="center">{aadhar}</TableCell>

        <TableCell align="center">{designation}</TableCell>

        <TableCell align="center">{emergencycontact}</TableCell>

        <TableCell align="center">{college}</TableCell>

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

EmployeeTableRow.propTypes = {
  eid: PropTypes.string,
  name: PropTypes.string,
  gender: PropTypes.string,
  phone: PropTypes.number,
  email: PropTypes.string,
  aadhar: PropTypes.string,
  designation: PropTypes.string,
  emergencycontact: PropTypes.string,
  college: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
};
