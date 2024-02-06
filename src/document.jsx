import jsPDF from 'jspdf';
import React from 'react';

import Button from '@mui/material/Button';

function Document() {
  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'pt', 'a4');
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    const date = formattedDate.toString();
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
            doc.text(`Date: ${formattedDate}`, pageWidth - rightMargin, dateHeight, {
              align: 'right',
            });

            const titleHeight = dateHeight + 50;
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text('BONAFIDE CERTIFICATE', pageWidth / 2, titleHeight, { align: 'center' });

            doc.setDrawColor(0, 0, 0); // color of the line (in RGB)
            doc.setLineWidth(0.5); // line width
            doc.line(pageWidth / 2 - 90, titleHeight + 5, pageWidth / 2 + 90, titleHeight + 5);

            const name = 'Mr. Ankit Radhesham Rathod';
            const fatherName = 'Mr.Radhesham Ramdas Rathod';
            const description = `This is to Certify that ${name} S/o ${fatherName} is a Bonafide Student of this institution Studying in 1st  Year BPTh , for the academic year 2023-24. His date of birth is  ${formattedDate}. This bonafide is issued for the purpose of Scholarship form.`;

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
    <div>
      <Button onClick={generatePDF} fullWidth disableRipple>
        Generate pdf
      </Button>
    </div>
  );
}

export default Document;
