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
  aadhar,
  nationality,
  domicile,
  ssc,
  hsc,
  medicalfitness,
  photo,
  verified,
  verifiedby,
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
    window.location.href = `/document?prn=${PRN}`;
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

        <TableCell align="center">{aadhar}</TableCell>
        <TableCell align="center">{nationality}</TableCell>
        <TableCell align="center">{domicile}</TableCell>
        <TableCell align="center">{ssc}</TableCell>
        <TableCell align="center">{hsc}</TableCell>
        <TableCell align="center">{medicalfitness}</TableCell>
        <TableCell align="center">{photo}</TableCell>
        <TableCell align="center">
          <Label color={(verified === 'Yes' && 'success') || 'error'}>{verified}</Label>
        </TableCell>

        <TableCell
          align="center"
          style={{ textDecoration: 'underline', textDecorationThickness: 'thick' }}
        >
          {verifiedby}
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
  PRN: PropTypes.any,
  avatarUrl: PropTypes.any,
  aadhar: PropTypes.any,
  nationality: PropTypes.any,
  domicile: PropTypes.any,
  ssc: PropTypes.any,
  hsc: PropTypes.any,
  medicalfitness: PropTypes.any,
  photo: PropTypes.any,
  verified: PropTypes.any,
  verifiedby: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
