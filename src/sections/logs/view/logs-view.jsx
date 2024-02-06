import axios from 'axios';
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
// import UserTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------

export default function EmployeesView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('dec');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('logID');
  const [filterUserName, setFilterUserName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [logs, setLogs] = useState([]);

  // Sorting handler
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  // Select all handler
  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked ? logs.map((n) => n.eid) : [];
    setSelected(newSelecteds);
  };

  // Individual row selection handler
  const handleClick = (event, eid) => {
    const selectedIndex = selected.indexOf(eid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, eid];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }

    setSelected(newSelected);
  };

  // Pagination change handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Rows per page change handler
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter by employee ID handler
  const handleFilterByUserName = (event) => {
    setPage(0);
    setFilterUserName(event.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get('http://localhost:3000/api/log/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data.data);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          console.error('Please Login to Access.');
        } else {
          console.error('Error fetching logs data:', error.message);
        }
        setLogs([]);
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  const dataFiltered = logs
    .filter((row) => row.username.toLowerCase().includes(filterUserName.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  const handleExportCSV = () => {
    const csvData = Papa.unparse(logs, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'logs.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  function extractDate(datetimeString) {
    const datetime = new Date(datetimeString);

    // Extracting date components
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const day = datetime.getDate();

    const date = `${day}/${month}/${year}`;

    return date;
  }

  function extractTime(datetimeString) {
    const datetime = new Date(datetimeString);

    // Extracting time components
    let hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();

    // Determine AM or PM
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    const time = `${hours}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;

    return time;
  }

  // Function to pad zero for single-digit minutes or seconds
  function padZero(value) {
    return value < 10 ? `0${value}` : value;
  }

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
          Logs
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
        </Stack>
      </Stack>

      <Card>
        {/* UserTableToolbar component */}
        <OutlinedInput
          value={filterUserName}
          onChange={handleFilterByUserName}
          sx={{ margin: 2.7 }}
          placeholder="Search UserName..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />

        {/* Scrollable table container */}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {/* Main table */}
            <Table sx={{ minWidth: 800 }}>
              {/* Table header */}
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={logs.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'logID', label: 'LogID' },
                  { id: 'userID', label: 'UserID' },
                  { id: 'username', label: 'UserName' },
                  { id: 'time', label: 'Time' },
                  { id: 'date', label: 'Date' },
                  // { id: '', label: '' },
                ]}
              />

              {/* Table body */}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.logID}
                      logID={row.logID}
                      userID={row.userID}
                      username={row.username}
                      time={extractTime(row.timestamp)}
                      date={extractDate(row.timestamp)}
                      selected={selected.indexOf(row.eid) !== -1}
                      handleClick={(event) => handleClick(event, row.eid)}
                    />
                  ))}

                {/* Empty rows */}
                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, logs.length)} />

                {/* Show a message if no results found */}
                {notFound && <TableNoData query={filterUserName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Table pagination component */}
        <TablePagination
          page={page}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
