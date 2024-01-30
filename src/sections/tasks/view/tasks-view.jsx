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

// ----------------------------------------------------------------------

export default function FeeStructurePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('tid');
  const [filterTaskName, setFilterTaskName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tasks, setTasks] = useState([]);

  // Sorting handler
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  // Select all handler
  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked ? tasks.map((n) => n.tid) : [];
    setSelected(newSelecteds);
  };

  const handleNewTaskClick = () => {
    window.location.href = '/task';
  };

  // Individual row selection handler
  const handleClick = (event, tid) => {
    const selectedIndex = selected.indexOf(tid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, tid];
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

  // Filter by task name handler
  const handleFilterByTaskName = (event) => {
    setPage(0);
    setFilterTaskName(event.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get('http://localhost:3000/api/task/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.data);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          console.error('Please Login to Access.');
        } else {
          console.error('Error fetching tasks data:', error.message);
        }
        setTasks([]);
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  const dataFiltered = tasks
    .filter((row) => row.task_name.toLowerCase().includes(filterTaskName.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  const handleExportCSV = () => {
    const csvData = Papa.unparse(tasks, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tasks.csv');
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
          Tasks
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
            onClick={handleNewTaskClick}
            sx={{
              '@media (max-width: 500px)': {
                fontSize: '11px',
              },
            }}
          >
            New Task
          </Button>
        </Stack>
      </Stack>

      <Card>
        {/* Search input */}
        <OutlinedInput
          value={filterTaskName}
          onChange={handleFilterByTaskName}
          sx={{ margin: 2.7 }}
          placeholder="Search Task Name..."
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
                rowCount={tasks.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'tid', label: 'ID' },
                  { id: 'task_name', label: 'Task_Name' },
                  { id: 'due_date', label: 'Due_Date' },
                  { id: '' },
                  { id: 'reminder_before', label: 'ReminderBefore' },
                  { id: 'eid', label: 'EmployeeID' },
                  { id: 'status', label: 'Status' },
                  { id: 'remarks', label: 'Remarks' },
                  { id: '' },
                ]}
              />

              {/* Table body */}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.tid}
                      tid={row.tid}
                      task_name={row.task_name}
                      due_date={row.due_date}
                      reminder_before={row.reminder_before}
                      eid={row.eid}
                      status={row.status}
                      remarks={row.remarks}
                      selected={selected.indexOf(row.tid) !== -1}
                      handleClick={(event) => handleClick(event, row.tid)}
                    />
                  ))}

                {/* Empty rows */}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, tasks.length)}
                />

                {/* Show a message if no results found */}
                {notFound && <TableNoData query={filterTaskName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Table pagination component */}
        <TablePagination
          page={page}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
