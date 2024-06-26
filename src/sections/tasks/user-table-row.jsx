import { useState } from 'react';
import { format } from 'date-fns'; // Import the format function
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

export default function TaskTableRow({
  selected,
  tid,
  task_name,
  due_date,
  reminder_before,
  eid,
  doc,
  status,
  remarks,
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
    window.location.href = `/task?tid=${tid}`;
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

  // Convert due_date from yyyy-mm-dd to dd-mm-yyyy
  const formattedDueDate = format(new Date(due_date), 'dd-MM-yyyy');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell>{tid}</TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={task_name}
              src={`/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`}
            />
            <Typography variant="subtitle2" noWrap>
              {task_name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell colSpan={2}>{formattedDueDate}</TableCell>

        <TableCell align="center">{reminder_before} Days</TableCell>

        <TableCell align="center">{eid}</TableCell>

        <TableCell align="center">
          {doc ? (
            <a
              href="#"
              onClick={handleViewDocument}
              style={{ textDecoration: 'none', color: '#1976D2', fontWeight: 'bold' }}
            >
              View
            </a>
          ) : (
            '🚫'
          )}
        </TableCell>

        <TableCell align="center">
          <Label
            color={
              (status === 'Completed' && 'success') ||
              (status === 'In Progress' && 'warning') ||
              'error'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell>{remarks}</TableCell>

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

TaskTableRow.propTypes = {
  tid: PropTypes.number,
  task_name: PropTypes.string,
  due_date: PropTypes.string,
  reminder_before: PropTypes.number,
  eid: PropTypes.string,
  doc: PropTypes.string,
  status: PropTypes.string,
  remarks: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
};
