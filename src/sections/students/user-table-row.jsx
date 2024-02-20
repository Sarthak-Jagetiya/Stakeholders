import jsPDF from 'jspdf';
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
  fathersname,
  gender,
  dob,
  phone,
  parentphone,
  email,
  address,
  course,
  admissionyear,
  yearname,
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
  const formattedDate = (date) => format(new Date(date), 'dd/MM/yyyy');

  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'pt', 'a4');
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formateDate = `${day}/${month}/${year}`;
    const date = formateDate.toString();
    const rightMargin = 60;
    const leftMargin = 60;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont('times', 'normal');

    fetch('/assets/doc-header.png') // replace with your image path
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        // eslint-disable-next-line
        reader.onloadend = function () {
          const base64data = reader.result;
          const img = new Image();
          // eslint-disable-next-line
          img.onload = function () {
            const imgWidth = pageWidth;
            const imgHeight = (img.height * imgWidth) / img.width; // calculate height based on aspect ratio

            // Add image to PDF, scaling to fit width
            doc.addImage(base64data, 'JPEG', 0, 0, imgWidth, imgHeight);

            doc.setFontSize(12);
            const dateHeight = imgHeight + 20;
            doc.text(`Date: ${formateDate}`, pageWidth - rightMargin, dateHeight, {
              align: 'right',
            });

            const titleHeight = dateHeight + 50;
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text('BONAFIDE CERTIFICATE', pageWidth / 2, titleHeight, { align: 'center' });

            doc.setDrawColor(0, 0, 0); // color of the line (in RGB)
            doc.setLineWidth(0.5); // line width
            doc.line(pageWidth / 2 - 90, titleHeight + 5, pageWidth / 2 + 90, titleHeight + 5);

            // const name = 'Mr. Ankit Radhesham Rathod';
            // const fatherName = 'Mr.Radhesham Ramdas Rathod';
            const description = `This is to Certify that ${name} S/o ${fathersname} is a Bonafide Student of this institution Studying in ${yearname} BPTh , for the academic year ${admissionyear}. His date of birth is  ${formattedDate(
              dob
            )}. This bonafide is issued for the purpose of Scholarship form.`;

            const descriptionHeight = titleHeight + 70;
            doc.setFontSize(12);
            const descriptionWidth = pageWidth - rightMargin - leftMargin + 10;
            const lineHeight = 20;
            const lines = doc.splitTextToSize(description, descriptionWidth);
            let y = descriptionHeight;

            // eslint-disable-next-line
            for (let i = 0; i < lines.length; i++) {
              const currentLine = lines[i];

              if (currentLine.includes(name)) {
                const parts = currentLine.split(name);

                doc.setFont('times', 'normal');
                doc.text(parts[0], leftMargin, y, { align: 'left' });

                doc.setFont('times', 'bold');
                doc.text(name, leftMargin + doc.getTextWidth(parts[0]) - 6, y, { align: 'left' });

                doc.setFont('times', 'normal');
                doc.text(parts[1], leftMargin + doc.getTextWidth(parts[0] + name) + 14, y, {
                  align: 'left',
                });
              } else if (currentLine.includes(date)) {
                const parts = currentLine.split(date);

                doc.setFont('times', 'normal');
                doc.text(parts[0], leftMargin, y, { align: 'left' });

                doc.setFont('times', 'bold');
                doc.text(date, leftMargin + doc.getTextWidth(parts[0]) - 8, y, { align: 'left' });

                doc.setFont('times', 'normal');
                doc.text(parts[1], leftMargin + doc.getTextWidth(parts[0] + date) + 5, y, {
                  align: 'left',
                });
              } else {
                // If the name is not present, draw the entire line with normal font
                doc.setFont('times', 'normal');
                doc.text(currentLine, leftMargin, y, { align: 'left' });
              }

              // Move to the next line
              y += lineHeight;
            }
            // doc.text(lines, leftMargin, descriptionHeight, {align:'left'});

            const signatureHeight = descriptionHeight + lines.length * lineHeight + 50;
            doc.text('Principal', pageWidth - rightMargin, signatureHeight, { align: 'right' });
            window.open(doc.output('bloburl'));
          };
          img.src = base64data;
        };
        reader.readAsDataURL(blob);
      });
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
        <TableCell align="center">{MUHS_PRN}</TableCell>
        <TableCell align="center" style={{ minWidth: '150px' }}>
          {name}
        </TableCell>
        <TableCell align="center" style={{ minWidth: '150px' }}>
          {fathersname}
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
        <TableCell align="center">{yearname}</TableCell>
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
        <MenuItem onClick={generatePDF}>
          <Iconify icon="eva:file-text-outline" sx={{ mr: 2 }} />
          Bonafide
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
  fathersname: PropTypes.any,
  gender: PropTypes.any,
  dob: PropTypes.any,
  phone: PropTypes.any,
  parentphone: PropTypes.any,
  email: PropTypes.any,
  address: PropTypes.any,
  course: PropTypes.any,
  admissionyear: PropTypes.any,
  yearname: PropTypes.any,
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
