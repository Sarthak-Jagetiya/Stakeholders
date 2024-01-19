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

export default function UserTableRow({
  selected,
  id,
  PRN,
  MUHS_PRN,
  avatarUrl,
  name,
  gender,
  dob,
  phone,
  parentphone,
  email,
  address,
  course,
  admissionyear,
  dateofadmission,
  domicilestate,
  studentcategory,
  admissioncategory,
  cetmarks,
  scholarship,
  feestructure,
  aadhar,
  religion,
  typeofadmission,
  bloodgroup,
  subcaste,
  remark,
  admissionstatus,
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
    window.location.href = `/register?prn=${PRN}`;
  };

  // Format date to dd-mm-yyyy
  const formattedDate = (date) => format(new Date(date), 'dd-MM-yyyy');

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
        <TableCell align="center">{MUHS_PRN}</TableCell>
        <TableCell align="center" style={{ minWidth: '150px' }}>
          {name}
        </TableCell>

        <TableCell align="center">{gender}</TableCell>
        <TableCell align="center">{formattedDate(dob)}</TableCell>
        <TableCell align="center">{phone}</TableCell>
        <TableCell align="center">{parentphone}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center" style={{ minWidth: '270px' }}>
          {course}
        </TableCell>
        <TableCell align="center">{admissionyear}</TableCell>
        <TableCell align="center">{formattedDate(dateofadmission)}</TableCell>
        <TableCell align="center">{domicilestate}</TableCell>
        <TableCell align="center">{studentcategory}</TableCell>
        <TableCell align="center">{admissioncategory}</TableCell>
        <TableCell align="center">{cetmarks}</TableCell>
        <TableCell align="center">
          <Label color={(scholarship === 'Yes' && 'success') || 'error'}>{scholarship}</Label>
        </TableCell>
        <TableCell align="center">{feestructure}</TableCell>
        <TableCell align="center">{aadhar}</TableCell>
        <TableCell align="center">{religion}</TableCell>
        <TableCell align="center">{typeofadmission}</TableCell>
        <TableCell align="center">{bloodgroup}</TableCell>
        <TableCell align="center">{subcaste}</TableCell>
        <TableCell align="center">{remark}</TableCell>
        <TableCell align="center">
          <Label color={(admissionstatus === 'active' && 'success') || 'error'}>
            {admissionstatus}
          </Label>
        </TableCell>
        <TableCell align="center" style={{ minWidth: '200px' }}>
          {address}
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

        {/* Add other menu items as needed */}
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  // Adjust the prop types based on your students data structure
  id: PropTypes.any,
  PRN: PropTypes.any,
  MUHS_PRN: PropTypes.any,
  avatarUrl: PropTypes.any,
  name: PropTypes.any,
  gender: PropTypes.any,
  dob: PropTypes.any,
  phone: PropTypes.any,
  parentphone: PropTypes.any,
  email: PropTypes.any,
  address: PropTypes.any,
  course: PropTypes.any,
  admissionyear: PropTypes.any,
  dateofadmission: PropTypes.any,
  domicilestate: PropTypes.any,
  studentcategory: PropTypes.any,
  admissioncategory: PropTypes.any,
  cetmarks: PropTypes.any,
  scholarship: PropTypes.any,
  feestructure: PropTypes.any,
  aadhar: PropTypes.any,
  religion: PropTypes.any,
  typeofadmission: PropTypes.any,
  bloodgroup: PropTypes.any,
  subcaste: PropTypes.any,
  remark: PropTypes.any,
  admissionstatus: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
