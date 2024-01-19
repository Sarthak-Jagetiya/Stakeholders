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
import TableEmptyRows from '../table-empty-rows';

// ----------------------------------------------------------------------

export default function StudentsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('PRN');
  const [filterPRN, setFilterPRN] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [students, setStudents] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = students.map((n) => n.PRN);
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

  const handleFilterByAcademicYear = (event) => {
    const selectedAcademicYear = event.target.value;
    setPage(0);
    setFilterAcademicYear(selectedAcademicYear);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/student/');
        const data = await response.json();
        setStudents(data.data);
      } catch (error) {
        console.error('Error fetching students data:', error.message);
        setStudents([]);
      }
    };

    fetchData();
  }, []);

  // Get unique academic years from students
  const academicYears = Array.from(new Set(students.map((student) => student.admissionyear)));

  // Apply filter to data, considering both PRN and Academic Year
  const dataFiltered = students
    .filter(
      (row) =>
        row.PRN.toLowerCase().includes(filterPRN.toLowerCase()) &&
        (!filterAcademicYear || row.admissionyear === filterAcademicYear)
    )
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  // Check if there are no results
  const notFound = dataFiltered.length === 0;

  const handleExportCSV = () => {
    const csvData = Papa.unparse(students, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'students.csv');
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
          Students
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
            onClick={() => {
              // Handle the click event to navigate to the registration page
              window.location.href = '/register';
            }}
            sx={{
              '@media (max-width: 500px)': {
                fontSize: '11px',
              },
            }}
          >
            New Student
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
          <Select
            value={filterAcademicYear}
            onChange={handleFilterByAcademicYear}
            variant="outlined"
            sx={{
              margin: 2.7,
              minWidth: 150,
              marginLeft: 'auto',
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
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={students.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'PRN', label: 'PRN' },
                  { id: 'MUHS_PRN', label: 'MUHS_PRN' },
                  { id: 'name', label: 'Name' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'dob', label: 'DateOfBirth' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'parentphone', label: 'ParentPhone' },
                  { id: 'email', label: 'Email' },
                  { id: 'course', label: 'Course' },
                  { id: 'admissionyear', label: 'AdmissionYear' },
                  { id: 'dateofadmission', label: 'AdmissionDate' },
                  { id: 'domicilestate', label: 'DomicileState' },
                  { id: 'studentcategory', label: 'StudentCategory' },
                  { id: 'admissioncategory', label: 'AdmissionCategory' },
                  { id: 'cetmarks', label: 'CETMarks' },
                  { id: 'scholarship', label: 'Scholarship' },
                  { id: 'feestructure', label: 'FeeStructure' },
                  { id: 'aadhar', label: 'Aadhar' },
                  { id: 'religion', label: 'Religion' },
                  { id: 'typeofadmission', label: 'AdmissionType' },
                  { id: 'bloodgroup', label: 'BloodGroup' },
                  { id: 'subcaste', label: 'SubCaste' },
                  { id: 'remark', label: 'Remark' },
                  { id: 'admissionstatus', label: 'AdmissionStatus' },
                  { id: 'address', label: 'Address' },
                  { id: '', label: '' },
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
                      MUHS_PRN={row.MUHS_PRN ? row.MUHS_PRN : '―'}
                      name={row.name}
                      gender={row.gender}
                      dob={row.dob}
                      phone={row.phone}
                      parentphone={row.parentphone}
                      email={row.email}
                      course={row.course}
                      admissionyear={row.admissionyear}
                      dateofadmission={row.dateofadmission}
                      domicilestate={row.domicilestate}
                      studentcategory={row.studentcategory}
                      admissioncategory={row.admissioncategory}
                      cetmarks={row.cetmarks}
                      scholarship={row.scholarship === 1 ? 'Yes' : 'No'}
                      feestructure={row.feestructure}
                      aadhar={row.aadhar}
                      religion={row.religion}
                      typeofadmission={row.typeofadmission}
                      bloodgroup={row.bloodgroup}
                      subcaste={row.subcaste}
                      remark={row.remark}
                      admissionstatus={row.admissionstatus}
                      address={row.address}
                      selected={selected.indexOf(row.PRN) !== -1}
                      handleClick={(event) => handleClick(event, row.PRN)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, students.length)}
                />

                {notFound && <TableNoData query={filterPRN} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
