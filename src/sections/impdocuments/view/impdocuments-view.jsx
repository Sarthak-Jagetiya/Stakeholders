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

export default function ImpDocumentsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('did');
  const [filterRemark, setFilterRemark] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [impDocuments, setImpDocuments] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/impdocument';
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = impDocuments.map((n) => n.did);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, did) => {
    const selectedIndex = selected.indexOf(did);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, did];
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

  const handleFilterByRemark = (event) => {
    setPage(0);
    setFilterRemark(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.1.38/api/impdocument/');
        setImpDocuments(response.data.data);
      } catch (error) {
        console.error('Error fetching impDocuments data:', error.message);
        setImpDocuments([]);
      }
    };

    fetchData();
  }, []);

  // Apply filter to data
  console.log(filterRemark);
  const dataFiltered = impDocuments
    .filter((row) => row.remark.toString().toLowerCase().includes(filterRemark.toLowerCase()))
    .sort((a, b) => {
      const isAsc = order === 'asc';
      return (isAsc ? a[orderBy] > b[orderBy] : a[orderBy] < b[orderBy]) ? 1 : -1;
    });

  // Check if there are no results
  const notFound = dataFiltered.length === 0;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Important Documents</Typography>

        {/* Add your button or link to navigate to the impdocument creation page */}
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
        <OutlinedInput
          value={filterRemark}
          onChange={handleFilterByRemark}
          sx={{ margin: 2.7 }}
          placeholder="Search Remark..."
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
                rowCount={impDocuments.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'did', label: 'DID' },
                  { id: 'doc', label: 'Document' },
                  { id: 'remark', label: 'Remark' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.did}
                      did={row.did}
                      avatarUrl={`/assets/images/avatars/avatar_${
                        Math.floor(Math.random() * 25) + 1
                      }.jpg`}
                      doc={row.doc}
                      remark={row.remark}
                      selected={selected.indexOf(row.did) !== -1}
                      handleClick={(event) => handleClick(event, row.did)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, impDocuments.length)}
                />

                {notFound && <TableNoData query={filterRemark} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={impDocuments.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
