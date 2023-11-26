import axios from 'axios';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function TransactionForm() {
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
      const response = await axios.post('http://localhost:3000/api/transaction/', formData);

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage('Transaction details submitted successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          setFormData(initialFormData);
        }, 2000);
      } else {
        setErrorMessage(`Transaction submission failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Student with the provided PRN does not exist.');
        setErrorMessage('Student with the provided PRN does not exist.');
      } else {
        console.error(error);
        setErrorMessage('An error occurred during transaction submission.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? 'Submitting...' : 'Submit Transaction'}
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
