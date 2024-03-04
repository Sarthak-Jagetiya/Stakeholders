import Papa from 'papaparse';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
import DateRangeFilter from './DateRangeFilter';
import TableEmptyRows from '../table-empty-rows';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

export default function TransactionsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('PRN');
  const [filterPRN, setFilterPRN] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  let token;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  const localStorageValue = localStorage.getItem('jwt');
  if (cookieValue) {
    token = cookieValue.split('=')[1];
  } else if (localStorageValue) {
    token = localStorageValue;
  }

  const handleDateFilter = (start, end) => {
    setPage(0);
    setStartDate(start);
    setEndDate(end);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = transactions.map((n) => n.PRN);
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
    window.location.href = '/transaction';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${databaseLocalUrl}/transaction/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTransactions(data.data);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          console.error('Please Login to Access.');
        } else {
          console.error('Error fetching transactions data:', error.message);
          setTransactions([]);
        }
      }
    };

    fetchData();
  }, [token]);

  const handleFilterByAcademicYear = (event) => {
    const selectedAcademicYear = event.target.value;
    setPage(0);
    setFilterAcademicYear(selectedAcademicYear);
  };

  // Get unique academic years from transactions
  const academicYears = Array.from(
    new Set(transactions.map((transaction) => transaction.academicyear))
  );

  // Apply filter to data, considering both PRN and Academic Year
  const dataFiltered = transactions
    .filter(
      (row) =>
        row.PRN.toLowerCase().includes(filterPRN.toLowerCase()) &&
        (!filterAcademicYear || row.academicyear === filterAcademicYear) &&
        (!startDate || new Date(row.date) >= new Date(startDate)) &&
        (!endDate || new Date(row.date) <= new Date(endDate))
    )
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  // Check if there are no results
  const notFound = dataFiltered.length === 0;

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
      link.setAttribute('download', 'transactions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          Transactions
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
            New Transaction
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Stack direction="row" alignItems="center" sx={{ marginRight: 2 }}>
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

          <Select
            value={filterAcademicYear}
            onChange={handleFilterByAcademicYear}
            variant="outlined"
            sx={{
              margin: 2.7,
              minWidth: 150,
              marginLeft: 'auto', // This will push the Select to the right
            }}
            displayEmpty
          >
            <MenuItem value="">All Years</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          <DateRangeFilter onDateFilter={handleDateFilter} />
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={transactions.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'PRN', label: 'PRN' },
                  { id: 'scholarship', label: 'Scholarship' },
                  { id: 'tuitionfees', label: 'TutionFee' },
                  { id: 'eligibilityregistration', label: 'Eligibility' },
                  { id: 'universityfees', label: 'UniversityFee' },
                  { id: 'library', label: 'Library' },
                  { id: 'collegeexam', label: 'CollegeExam' }, // Added field
                  { id: 'cautionmoney', label: 'CautionMoney' },
                  { id: 'developmentfee', label: 'DevelopmentFee' },
                  { id: 'other', label: 'Other' },
                  { id: 'academicyear', label: 'AcademicYear' }, // Added field
                  { id: 'yearname', label: 'YearName' }, // Added field
                  { id: 'remark', label: 'Remark' }, // Added field
                  { id: 'date', label: 'Date' }, // Added field
                  { id: 'paymenttype', label: 'Type' }, // Added field
                  { id: 'utr', label: 'UTR' }, // Added field
                  { id: 'total', label: 'Total(₹)' },
                  { id: 'signature', label: 'Signature' },
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
                      scholarship={row.scholarship}
                      tuitionfees={row.tuitionfees}
                      eligibilityregistration={row.eligibilityregistration}
                      universityfees={row.universityfees}
                      library={row.library}
                      collegeexam={row.collegeexam} // Added field
                      cautionmoney={row.cautionmoney}
                      developmentfee={row.developmentfee}
                      other={row.other}
                      academicyear={row.academicyear} // Added field
                      yearname={row.yearname} // Added field
                      remark={row.remark} // Added field
                      date={row.date} // Added field
                      paymenttype={row.paymenttype} // Added field
                      utr={row.utr ? row.utr : '―'} // Added field
                      total={
                        row.scholarship +
                        row.tuitionfees +
                        row.eligibilityregistration +
                        row.universityfees +
                        row.library +
                        row.collegeexam +
                        row.developmentfee +
                        row.other +
                        row.cautionmoney
                      }
                      signature={row.signature}
                      selected={selected.indexOf(row.PRN) !== -1}
                      handleClick={(event) => handleClick(event, row.PRN)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, transactions.length)}
                />

                {notFound && <TableNoData query={filterPRN} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
