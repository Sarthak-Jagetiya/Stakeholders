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

export default function FeeStructurePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('code');
  const [filterCode, setFilterCode] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [feeStructures, setFeeStructures] = useState([]);

  // Sorting handler
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  // Select all handler
  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked ? feeStructures.map((n) => n.code) : [];
    setSelected(newSelecteds);
  };

  const handleNewFeeStructureClick = () => {
    window.location.href = '/feestructure';
  };

  // Individual row selection handler
  const handleClick = (event, code) => {
    const selectedIndex = selected.indexOf(code);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, code];
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

  // Filter by code handler
  const handleFilterByCode = (event) => {
    setPage(0);
    setFilterCode(event.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/feestructure/');
        setFeeStructures(response.data.data);
      } catch (error) {
        console.error('Error fetching fee structures data:', error.message);
        setFeeStructures([]);
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  const dataFiltered = feeStructures
    .filter((row) => row.code.toLowerCase().includes(filterCode.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  const handleExportCSV = () => {
    const csvData = Papa.unparse(feeStructures, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'feeStructures.csv');
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Fee Structures</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={handleExportCSV}
            style={{ marginRight: '20px' }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewFeeStructureClick}
          >
            New Fee Structure
          </Button>
        </Stack>
      </Stack>

      <Card>
        {/* UserTableToolbar component */}
        <OutlinedInput
          value={filterCode}
          onChange={handleFilterByCode}
          sx={{ margin: 2.7 }}
          placeholder="Search Code..."
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
                rowCount={feeStructures.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'code', label: 'Code' },
                  { id: 'academicyear', label: 'AcademicYear' },
                  { id: 'category', label: 'Category' },
                  { id: 'tuitionfees', label: 'Tuition' },
                  { id: 'universityfees', label: 'University' },
                  { id: 'library', label: 'Library' },
                  { id: 'collegeexam', label: 'Exam' },
                  { id: 'other', label: 'Other' },
                  { id: 'cautionmoney', label: 'Caution' },
                  { id: '' },
                ]}
              />

              {/* Table body */}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.code}
                      code={row.code}
                      academicyear={row.academicyear}
                      category={row.category}
                      tuitionfees={row.tuitionfees}
                      universityfees={row.universityfees}
                      library={row.library}
                      collegeexam={row.collegeexam}
                      other={row.other}
                      cautionmoney={row.cautionmoney}
                      selected={selected.indexOf(row.code) !== -1}
                      handleClick={(event) => handleClick(event, row.code)}
                    />
                  ))}

                {/* Empty rows */}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, feeStructures.length)}
                />

                {/* Show a message if no results found */}
                {notFound && <TableNoData query={filterCode} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Table pagination component */}
        <TablePagination
          page={page}
          component="div"
          count={feeStructures.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[6, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
