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

  const handleViewDocument = (documentData) => () => {
    try {
      // Decode base64 data
      const decodedData = atob(documentData);
      // Convert the decoded data to Uint8Array
      const uint8Array = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i += 1) {
        uint8Array[i] = decodedData.charCodeAt(i);
      }
      // Create a Blob with the decoded data
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      // Create a data URL for the Blob
      const dataURL = URL.createObjectURL(blob);
      // Open the viewer URL in a new tab
      window.open(dataURL, '_blank');
    } catch (error) {
      console.error('Error decoding or opening the document:', error.message);
    }
  };

  const renderDocumentLink = (documentData, label) => (
    <TableCell align="center" sx={{ minWidth: '100px' }}>
      {documentData ? (
        <a href="#" onClick={handleViewDocument(documentData)} className="custom-link">
          {label}
        </a>
      ) : (
        '🚫'
      )}
    </TableCell>
  );

  return (
    <>
      <style>
        {`
          .custom-link {
            text-decoration: none;
            color: #1976D2;
            font-weight: bold;
          }

          .custom-link:hover {
            text-decoration: underline;
          }
        `}
      </style>

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

        {renderDocumentLink(cetForm, 'View')}
        {renderDocumentLink(neetScoreCard, 'View')}
        {renderDocumentLink(sscMarksheet, 'View')}
        {renderDocumentLink(sscCertificate, 'View')}
        {renderDocumentLink(hscMarksheet, 'View')}
        {renderDocumentLink(hscCertificate, 'View')}
        {renderDocumentLink(aadhar, 'View')}
        {renderDocumentLink(nationality, 'View')}
        {renderDocumentLink(domicile, 'View')}
        {renderDocumentLink(medicalFitness, 'View')}
        {renderDocumentLink(photo, 'View')}
        {renderDocumentLink(caste, 'View')}
        {renderDocumentLink(casteValidity, 'View')}
        {renderDocumentLink(parentIncome, 'View')}
        {renderDocumentLink(nonCreamyLayer, 'View')}
        {renderDocumentLink(tc, 'View')}
        {renderDocumentLink(educationGapAffidavit, 'View')}
        {renderDocumentLink(ews, 'View')}
        {renderDocumentLink(minorityDeclaration, 'View')}
        {renderDocumentLink(disability, 'View')}
        {renderDocumentLink(migration, 'View')}
        {renderDocumentLink(other, 'View')}

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
