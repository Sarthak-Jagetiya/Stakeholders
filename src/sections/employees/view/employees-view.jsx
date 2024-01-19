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
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('eid');
  const [filterEid, setFilterEid] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);

  // Sorting handler
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  // Select all handler
  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked ? employees.map((n) => n.eid) : [];
    setSelected(newSelecteds);
  };

  const handleNewEmployeeClick = () => {
    window.location.href = '/employee';
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
  const handleFilterByEid = (event) => {
    setPage(0);
    setFilterEid(event.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employee/');
        setEmployees(response.data.data);
      } catch (error) {
        console.error('Error fetching employees data:', error.message);
        setEmployees([]);
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  const dataFiltered = employees
    .filter((row) => row.eid.toLowerCase().includes(filterEid.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  const handleExportCSV = () => {
    const csvData = Papa.unparse(employees, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees.csv');
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
          Employees
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
            onClick={handleNewEmployeeClick}
            sx={{
              '@media (max-width: 500px)': {
                fontSize: '11px',
              },
            }}
          >
            New Employee
          </Button>
        </Stack>
      </Stack>

      <Card>
        {/* UserTableToolbar component */}
        <OutlinedInput
          value={filterEid}
          onChange={handleFilterByEid}
          sx={{ margin: 2.7 }}
          placeholder="Search Employee ID..."
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
                rowCount={employees.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'eid', label: 'EmployeeID' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'email', label: 'Email' },
                  { id: 'aadhar', label: 'Aadhar' },
                  { id: 'designation', label: 'Designation' },
                  { id: 'emergencycontact', label: 'EmergencyContact' },
                  { id: 'college', label: 'College' },
                  { id: '', label: '' },
                ]}
              />

              {/* Table body */}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.eid}
                      eid={row.eid}
                      name={row.name}
                      gender={row.gender}
                      phone={row.phone}
                      email={row.email}
                      aadhar={row.aadhar}
                      designation={row.designation}
                      emergencycontact={row.emergencycontact}
                      college={row.college}
                      selected={selected.indexOf(row.eid) !== -1}
                      handleClick={(event) => handleClick(event, row.eid)}
                    />
                  ))}

                {/* Empty rows */}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, employees.length)}
                />

                {/* Show a message if no results found */}
                {notFound && <TableNoData query={filterEid} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Table pagination component */}
        <TablePagination
          page={page}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
