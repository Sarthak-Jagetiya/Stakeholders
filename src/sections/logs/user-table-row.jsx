// import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';

// import Iconify from 'src/components/iconify';

export default function EmployeeTableRow({
  selected,
  logID,
  userID,
  username,
  date,
  time,
  handleClick,
}) {
  // const [open, setOpen] = useState(null);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* Uncomment the following lines if using Checkbox */}
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={logID}
              src={`/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`}
            />
            <Typography variant="subtitle2" noWrap>
              {logID}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{userID}</TableCell>

        <TableCell>{username}</TableCell>

        <TableCell>{time}</TableCell>

        <TableCell>{date}</TableCell>

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <Popover
      // open={!!open}
      // anchorEl={open}
      // onClose={handleCloseMenu}
      // anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      // PaperProps={{
      //   sx: { width: 140 },
      // }}
      >
        {/* <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        {/* <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      </Popover>
    </>
  );
}

EmployeeTableRow.propTypes = {
  logID: PropTypes.number,
  userID: PropTypes.number,
  username: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
};
