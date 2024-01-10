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

export default function UserTableRow({
  selected,
  PRN,
  avatarUrl,
  cetForm,
  neetScoreCard,
  sscMarksheet,
  sscCertificate,
  hscMarksheet,
  hscCertificate,
  aadhar,
  nationality,
  domicile,
  medicalFitness,
  photo,
  caste,
  casteValidity,
  parentIncome,
  nonCreamyLayer,
  tc,
  educationGapAffidavit,
  ews,
  minorityDeclaration,
  disability,
  migration,
  other,
  verified,
  verifiedBy,
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

        <TableCell component="th" scope="row" padding="none" style={{ paddingLeft: '45px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={PRN} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {PRN}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">{cetForm}</TableCell>
        <TableCell align="center">{neetScoreCard}</TableCell>
        <TableCell align="center">{sscMarksheet}</TableCell>
        <TableCell align="center">{sscCertificate}</TableCell>
        <TableCell align="center">{hscMarksheet}</TableCell>
        <TableCell align="center">{hscCertificate}</TableCell>
        <TableCell align="center">{aadhar}</TableCell>
        <TableCell align="center">{nationality}</TableCell>
        <TableCell align="center">{domicile}</TableCell>
        <TableCell align="center">{medicalFitness}</TableCell>
        <TableCell align="center">{photo}</TableCell>
        <TableCell align="center">{caste}</TableCell>
        <TableCell align="center">{casteValidity}</TableCell>
        <TableCell align="center">{parentIncome}</TableCell>
        <TableCell align="center">{nonCreamyLayer}</TableCell>
        <TableCell align="center">{tc}</TableCell>
        <TableCell align="center">{educationGapAffidavit}</TableCell>
        <TableCell align="center">{ews}</TableCell>
        <TableCell align="center">{minorityDeclaration}</TableCell>
        <TableCell align="center">{disability}</TableCell>
        <TableCell align="center">{migration}</TableCell>
        <TableCell align="center">{other}</TableCell>
        <TableCell align="center">
          <Label color={(verified === 'Yes' && 'success') || 'error'}>{verified}</Label>
        </TableCell>

        <TableCell align="center" style={{ textDecorationThickness: 'thick' }}>
          {verifiedBy}
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
  cetForm: PropTypes.any,
  neetScoreCard: PropTypes.any,
  sscMarksheet: PropTypes.any,
  sscCertificate: PropTypes.any,
  hscMarksheet: PropTypes.any,
  hscCertificate: PropTypes.any,
  aadhar: PropTypes.any,
  nationality: PropTypes.any,
  domicile: PropTypes.any,
  medicalFitness: PropTypes.any,
  photo: PropTypes.any,
  caste: PropTypes.any,
  casteValidity: PropTypes.any,
  parentIncome: PropTypes.any,
  nonCreamyLayer: PropTypes.any,
  tc: PropTypes.any,
  educationGapAffidavit: PropTypes.any,
  ews: PropTypes.any,
  minorityDeclaration: PropTypes.any,
  disability: PropTypes.any,
  migration: PropTypes.any,
  other: PropTypes.any,
  verified: PropTypes.any,
  verifiedBy: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
