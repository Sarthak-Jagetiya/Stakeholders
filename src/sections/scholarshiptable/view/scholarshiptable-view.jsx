import Papa from 'papaparse';
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

// ----------------------------------------------------------------------
const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

export default function ScholarshipTable() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('PRN');
  const [filterPRN, setFilterPRN] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [scholarships, setScholarships] = useState([]);

  let token;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  const localStorageValue = localStorage.getItem('jwt');
  if (cookieValue) {
    token = cookieValue.split('=')[1];
  } else if (localStorageValue) {
    token = localStorageValue;
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = scholarships.map((n) => n.PRN);
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
    const { value } = event.target;
    setPage(0);
    setFilterPRN(value);
  };

  const handleNewUserClick = () => {
    window.location.href = '/scholarship';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${databaseLocalUrl}/scholarship/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setScholarships(data.data);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          console.error('Please Login to Access.');
        } else {
          console.error('Error fetching scholarships data:', error.message);
        }
        setScholarships([]);
      }
    };

    fetchData();
  }, [token]);

  // Apply filter to data
  const dataFiltered = scholarships
    .filter((row) => row.PRN.toLowerCase().includes(filterPRN.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  const handleExportCSV = () => {
    const csvData = Papa.unparse(dataFiltered, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'scholarships.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Check if there are no results
  const notFound = dataFiltered.length === 0;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        sx={{
          '@media (max-width: 500px)': {
            flexDirection: 'column', // Use flexDirection instead of direction
            marginBottom: '25px',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            '@media (max-width: 500px)': {
              paddingBottom: '30px',
              fontSize: '25px',
            },
          }}
        >
          Scholarships
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={handleExportCSV}
            style={{ marginRight: '20px' }}
            sx={{
              '@media (max-width: 500px)': {
                fontSize: '11px',
              },
            }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewUserClick}
            sx={{
              '@media (max-width: 500px)': {
                fontSize: '11px',
              },
            }}
          >
            New Scholarship
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Stack direction="row" alignItems="center">
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
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={scholarships.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'PRN', label: 'PRN' },
                  { id: 'amount', label: 'Amount' },
                  { id: 'date', label: 'Date' },
                  { id: 'transactionID', label: 'TransactionID' },
                  { id: 'scholarshipID', label: 'ScholarshipID' },
                  { id: 'installment', label: 'Installment' },
                  { id: 'academicyear', label: 'AcademicYear' },
                  { id: 'yearname', label: 'YearName' },
                  { id: 'remark', label: 'Remark' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      avatarUrl={`/assets/images/avatars/avatar_${
                        Math.floor(Math.random() * 25) + 1
                      }.jpg`}
                      id={row.id}
                      PRN={row.PRN}
                      amount={row.amount}
                      date={row.date}
                      transactionID={row.transactionID ? row.transactionID : '―'}
                      scholarshipID={row.scholarshipID ? row.scholarshipID : '―'}
                      installment={row.installment}
                      academicyear={row.academicyear}
                      yearname={row.yearname}
                      remark={row.remark}
                      selected={selected.indexOf(row.PRN) !== -1}
                      handleClick={(event) => handleClick(event, row.PRN)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, scholarships.length)}
                />

                {notFound && <TableNoData query={filterPRN} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={scholarships.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
