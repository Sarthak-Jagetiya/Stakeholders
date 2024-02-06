import axios from 'axios';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function ScholarshipForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idParam = searchParams.get('id');

  const initialFormData = {
    PRN: '',
    amount: '',
    date: '',
    transactionID: '',
    scholarshipID: '',
    installment: '',
    remark: '',
    academicyear: '',
    yearname: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const getCurrentYear = () => new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 6 }, (_, index) => {
    const startYear = getCurrentYear() - index;
    const endYear = startYear + 1;
    return `${startYear.toString()}-${endYear.toString().slice(-2)}`;
  });

  useEffect(() => {
    // Fetch existing data if PRN is present
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get(`http://localhost:3000/api/scholarship/${idParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const existingData = response.data.data;
        setFormData(existingData.data);
      } catch (error) {
        console.error('Error fetching existing data:', error.message);
      }
    };

    if (idParam) {
      fetchData();
    }
  }, [idParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input Validation
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        formData[key] !== 0 &&
        key !== 'transactionID' &&
        key !== 'scholarshipID'
      ) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt'))
        .split('=')[1];
      // Determine whether to use POST or PUT based on the presence of PRN
      const apiEndpoint = idParam
        ? `http://localhost:3000/api/scholarship/${idParam}`
        : 'http://localhost:3000/api/scholarship';

      const response = await axios[idParam ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Scholarship details ${idParam ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (idParam) window.location.href = '/scholarshiptable';
          else setFormData(initialFormData);
        }, 1000);
      } else {
        setErrorMessage(
          `Scholarship ${idParam ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 399) {
        setErrorMessage('Student with the provided PRN does not exist.');
      } else if (error.response && error.response.status === 400) {
        setErrorMessage('Transaction with the provided ID does not exist.');
      } else if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        setErrorMessage('Please Login to access.');
      } else {
        setErrorMessage(
          `An error occurred during scholarship ${idParam ? 'update' : 'submission'}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/scholarshiptable';
  };

  let buttonText = 'Submit Scholarship';
  if (idParam) {
    buttonText = 'Update Scholarship';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Scholarship</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Scholarships
        </Button>
      </Stack>
      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* PRN */}
            <Grid item xs={6}>
              <TextField
                name="PRN"
                label="PRN"
                variant="outlined"
                fullWidth
                value={formData.PRN}
                onChange={handleChange}
                error={!!formErrors.PRN}
                helperText={formErrors.PRN}
                disabled={!!idParam}
                required
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={6}>
              <TextField
                name="amount"
                label="Amount"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                required
              />
            </Grid>

            {/* Date */}
            <Grid item xs={6}>
              <TextField
                name="date"
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.date}
                onChange={handleChange}
                error={!!formErrors.date}
                helperText={formErrors.date}
                required
              />
            </Grid>

            {/* Transaction ID */}
            <Grid item xs={6}>
              <TextField
                name="transactionID"
                label="Transaction ID"
                variant="outlined"
                fullWidth
                value={formData.transactionID}
                onChange={handleChange}
                error={!!formErrors.transactionID}
                helperText={formErrors.transactionID}
              />
            </Grid>

            {/* Scholarship ID */}
            <Grid item xs={6}>
              <TextField
                name="scholarshipID"
                label="Scholarship ID"
                variant="outlined"
                fullWidth
                value={formData.scholarshipID}
                onChange={handleChange}
                error={!!formErrors.scholarshipID}
                helperText={formErrors.scholarshipID}
              />
            </Grid>

            {/* Installment */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Installment</InputLabel>
                <Select
                  name="installment"
                  value={formData.installment}
                  onChange={handleChange}
                  label="Installment"
                  error={!!formErrors.installment}
                  helperText={formErrors.installment}
                  required
                >
                  <MenuItem value="1st Installment">1st Installment</MenuItem>
                  <MenuItem value="2nd Installment">2nd Installment</MenuItem>
                  <MenuItem value="3rd Installment">3rd Installment</MenuItem>
                  <MenuItem value="4th Installment">4th Installment</MenuItem>
                  <MenuItem value="Other Installment">Other Installment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Year Name */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Year Name</InputLabel>
                <Select
                  name="yearname"
                  value={formData.yearname}
                  onChange={handleChange}
                  label="Installment"
                  error={!!formErrors.yearname}
                  helperText={formErrors.yearname}
                  required
                >
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Academic Year */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicyear"
                  value={formData.academicyear}
                  onChange={handleChange}
                  label="Admission Year"
                  error={!!formErrors.academicyear}
                  helperText={formErrors.academicyear}
                  required
                >
                  {academicYearOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Remark */}
            <Grid item xs={12}>
              <TextField
                name="remark"
                label="Remark"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.remark}
                onChange={handleChange}
                error={!!formErrors.remark}
                helperText={formErrors.remark}
                required
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : buttonText}
          </Button>

          {successMessage && (
            <Typography variant="body1" style={{ color: 'green', marginTop: '10px' }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" style={{ color: 'red', marginTop: '10px' }}>
              {errorMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
}
