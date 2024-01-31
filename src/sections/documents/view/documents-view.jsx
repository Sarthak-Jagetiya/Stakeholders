import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
// import UserTableToolbar from '../user-table-toolbar';

export default function DocumentsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('PRN');
  const [filterPRN, setFilterPRN] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [documents, setDocuments] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/document';
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = documents.map((n) => n.PRN);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, PRN) => {
    const selectedIndex = selected.indexOf(PRN);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, PRN];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByPRN = (event) => {
    setPage(0);
    setFilterPRN(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];

        const response = await axios.get('http://localhost:3000/api/document/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(response.data.data);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          console.error('Please Login to Access.');
        } else {
          console.error('Error fetching documents data:', error.message);
          setDocuments([]);
        }
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  const dataFiltered = documents
    .filter((row) => row.PRN.toLowerCase().includes(filterPRN.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  // Check if there are no results
  const notFound = dataFiltered.length === 0;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Documents</Typography>

        {/* Add your button or link to navigate to the document creation page */}
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleNewDocumentClick}
        >
          New Document
        </Button>
      </Stack>

      <Card>
        {/* UserTableToolbar component */}
        <OutlinedInput
          value={filterPRN}
          onChange={handleFilterByPRN}
          sx={{ margin: 2.7 }}
          placeholder="Search PRN..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={documents.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'PRN', label: 'PRN' },
                  { id: 'cetForm', label: 'CETForm' },
                  { id: 'neetScoreCard', label: 'NEETScorecard' },
                  { id: 'sscMarksheet', label: 'SSCMarksheet' },
                  { id: 'sscCertificate', label: 'SSCCertificate' },
                  { id: 'hscMarksheet', label: 'HSCMarksheet' },
                  { id: 'hscCertificate', label: 'HSCCertificate' },
                  { id: 'aadhar', label: 'Aadhar' },
                  { id: 'nationality', label: 'Nationality' },
                  { id: 'domicile', label: 'Domicile' },
                  { id: 'medicalFitness', label: 'MedicalFitness' },
                  { id: 'photo', label: 'Photo' },
                  { id: 'caste', label: 'Caste' },
                  { id: 'casteValidity', label: 'CasteValidity' },
                  { id: 'parentIncome', label: 'ParentIncome' },
                  { id: 'nonCreamyLayer', label: 'NonCreamyLayer' },
                  { id: 'tc', label: 'TC' },
                  { id: 'educationGapAffidavit', label: 'EducationGapAffidavit' },
                  { id: 'ews', label: 'EWS' },
                  { id: 'minorityDeclaration', label: 'MinorityDeclaration' },
                  { id: 'disability', label: 'Disability' },
                  { id: 'migration', label: 'Migration' },
                  { id: 'other', label: 'Other' },
                  { id: 'verified', label: 'Verified', align: 'center' },
                  { id: 'verifiedBy', label: 'Signature' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.PRN}
                      avatarUrl={`/assets/images/avatars/avatar_${
                        Math.floor(Math.random() * 25) + 1
                      }.jpg`}
                      PRN={row.PRN}
                      cetForm={row.cetForm}
                      neetScoreCard={row.neetScoreCard}
                      sscMarksheet={row.sscMarksheet}
                      sscCertificate={row.sscCertificate}
                      hscMarksheet={row.hscMarksheet}
                      hscCertificate={row.hscCertificate}
                      aadhar={row.aadhar}
                      nationality={row.nationality}
                      domicile={row.domicile}
                      medicalFitness={row.medicalFitness}
                      photo={row.photo}
                      caste={row.caste}
                      casteValidity={row.casteValidity}
                      parentIncome={row.parentIncome}
                      nonCreamyLayer={row.nonCreamyLayer}
                      tc={row.tc}
                      educationGapAffidavit={row.educationGapAffidavit}
                      ews={row.ews}
                      minorityDeclaration={row.minorityDeclaration}
                      disability={row.disability}
                      migration={row.migration}
                      other={row.other}
                      verified={row.verified ? 'Yes' : 'No'}
                      verifiedBy={row.verifiedBy ? row.verifiedBy : '―'}
                      selected={selected.indexOf(row.PRN) !== -1}
                      handleClick={(event) => handleClick(event, row.PRN)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, documents.length)}
                />

                {notFound && <TableNoData query={filterPRN} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={documents.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
