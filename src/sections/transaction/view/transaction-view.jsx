import axios from 'axios';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function TransactionForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prnParam = searchParams.get('prn');

  const initialFormData = {
    PRN: '',
    scholarship: 0,
    tuitionfees: '',
    eligibilityregistration: '',
    universityfees: '',
    library: '',
    collegeexam: '',
    other: '',
    cautionmoney: '',
    signature: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch existing data if PRN is present
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/transaction/${prnParam}`);
        const existingData = response.data.data;
        console.log(existingData.data);
        setFormData(existingData.data);
      } catch (error) {
        console.error('Error fetching existing data:', error.message);
      }
    };

    if (prnParam) {
      fetchData();
    }
  }, [prnParam]);

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
      if (!formData[key] && key !== 'scholarship') {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Determine whether to use POST or PUT based on the presence of PRN
      const apiEndpoint = prnParam
        ? `http://localhost:3000/api/transaction/${prnParam}`
        : 'http://localhost:3000/api/transaction';

      const response = await axios[prnParam ? 'patch' : 'post'](apiEndpoint, formData);

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(
          `Transaction details ${prnParam ? 'updated' : 'submitted'} successfully!`
        );
        setTimeout(() => {
          setSuccessMessage('');
          if (prnParam) window.location.href = '/transactions';
          else setFormData(initialFormData);
        }, 1000);
      } else {
        setErrorMessage(
          `Transaction ${prnParam ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Student with the provided PRN does not exist.');
        setErrorMessage('Student with the provided PRN does not exist.');
      } else {
        console.error(error);
        setErrorMessage(
          `An error occurred during transaction ${prnParam ? 'update' : 'submission'}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  let buttonText = 'Submit Transaction';
  if (prnParam) {
    buttonText = 'Update Transaction';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Transactions</Typography>
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
                disabled={!!prnParam}
                required
              />
            </Grid>

            {/* Scholarship */}
            <Grid item xs={6}>
              <TextField
                name="scholarship"
                label="Scholarship"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.scholarship}
                onChange={handleChange}
                error={!!formErrors.scholarship}
                helperText={formErrors.scholarship}
                required
              />
            </Grid>

            {/* Tuition Fees */}
            <Grid item xs={6}>
              <TextField
                name="tuitionfees"
                label="Tuition Fees"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.tuitionfees}
                onChange={handleChange}
                error={!!formErrors.tuitionfees}
                helperText={formErrors.tuitionfees}
                required
              />
            </Grid>

            {/* Eligibility Registration */}
            <Grid item xs={6}>
              <TextField
                name="eligibilityregistration"
                label="Eligibility Registration"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.eligibilityregistration}
                onChange={handleChange}
                error={!!formErrors.eligibilityregistration}
                helperText={formErrors.eligibilityregistration}
                required
              />
            </Grid>

            {/* University Fees */}
            <Grid item xs={6}>
              <TextField
                name="universityfees"
                label="University Fees"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.universityfees}
                onChange={handleChange}
                error={!!formErrors.universityfees}
                helperText={formErrors.universityfees}
                required
              />
            </Grid>

            {/* Library */}
            <Grid item xs={6}>
              <TextField
                name="library"
                label="Library"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.library}
                onChange={handleChange}
                error={!!formErrors.library}
                helperText={formErrors.library}
                required
              />
            </Grid>

            {/* College Exam */}
            <Grid item xs={6}>
              <TextField
                name="collegeexam"
                label="College Exam"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.collegeexam}
                onChange={handleChange}
                error={!!formErrors.collegeexam}
                helperText={formErrors.collegeexam}
                required
              />
            </Grid>

            {/* Other */}
            <Grid item xs={6}>
              <TextField
                name="other"
                label="Other"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.other}
                onChange={handleChange}
                error={!!formErrors.other}
                helperText={formErrors.other}
                required
              />
            </Grid>

            {/* Caution Money */}
            <Grid item xs={6}>
              <TextField
                name="cautionmoney"
                label="Caution Money"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.cautionmoney}
                onChange={handleChange}
                error={!!formErrors.cautionmoney}
                helperText={formErrors.cautionmoney}
                required
              />
            </Grid>

            {/* Signature */}
            <Grid item xs={6}>
              <TextField
                name="signature"
                label="Signature"
                variant="outlined"
                fullWidth
                value={formData.signature}
                onChange={handleChange}
                error={!!formErrors.signature}
                helperText={formErrors.signature}
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
