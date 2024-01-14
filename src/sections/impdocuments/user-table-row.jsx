import axios from 'axios';
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

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ImpDocumentTableRow({
  selected,
  did,
  avatarUrl,
  doc,
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
    window.location.href = `/impdocument?did=${did}`;
  };

  const handleDelete = async () => {
    handleCloseMenu();

    try {
      const response = await axios.delete(`http://15.206.123.134:3000/api/impdocument/${did}`);

      if (response.status === 200) {
        // Handle successful deletion, e.g., update the UI or show a success message
      } else {
        // Handle unsuccessful deletion, e.g., show an error message
        console.error(`Error deleting document ${did}`);
      }
    } catch (error) {
      console.error('Error deleting document:', error.message);
    }
    window.location.reload();
  };

  const handleViewDocument = async () => {
    // Ensure that 'doc' is a valid base64-encoded string
    if (!doc) {
      console.error('Error: No document data provided.');
      return;
    }

    try {
      // Decode base64 data
      const decodedData = atob(doc);

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
      const viewerURL = `${dataURL}`;
      // const viewerURL = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${dataURL}`;
      window.open(viewerURL, '_blank');
    } catch (error) {
      console.error('Error decoding or opening the document:', error.message);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt="avtar" src={avatarUrl} />
            {/* You can customize the label based on your needs */}
            <Typography variant="subtitle2" noWrap>
              {`Document ${did}`}
            </Typography>
          </Stack>
        </TableCell>

        {/* Assuming doc is the base64-encoded document */}
        <TableCell>
          <a
            href="#"
            onClick={handleViewDocument}
            style={{ textDecoration: 'none', color: '#1976D2', fontWeight: 'bold' }}
          >
            View Document
          </a>
        </TableCell>

        <TableCell>{remark}</TableCell>

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
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

        {/* You can add more menu items based on your requirements */}
      </Popover>

      <script src="https://mozilla.github.io/pdf.js/build/pdf.js" />
    </>
  );
}

ImpDocumentTableRow.propTypes = {
  did: PropTypes.any,
  avatarUrl: PropTypes.any,
  doc: PropTypes.string, // Assuming doc is the base64-encoded document
  remark: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
