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

export default function TransactionForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idParam = searchParams.get('id');

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
    developmentfee: '',
    signature: '',
    academicyear: '',
    yearname: '',
    remark: '',
    date: '',
    paymenttype: '',
    utr: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const isRTGSorNEFT = ['RTGS', 'NEFT'].includes(formData.paymenttype);

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
        const response = await axios.get(`http://localhost:3000/api/transaction/${idParam}`, {
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
        key !== 'date' &&
        key !== 'signature' &&
        parseFloat(formData[key]) < 0 &&
        formData[key] !== 0
      ) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be negative`;
      } else if (!formData[key] && formData[key] !== 0 && key !== 'scholarship' && key !== 'utr') {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
      // else if (key === 'utr' && isRTGSorNEFT) {
      //   const utrLength = formData.paymenttype === 'RTGS' ? 22 : 16;
      //   if (formData[key].length !== utrLength) {
      //     errors[key] = `${
      //       key.charAt(0).toUpperCase() + key.slice(1)
      //     } should contain ${utrLength} digits number`;
      //   }
      // }
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
        ? `http://localhost:3000/api/transaction/${idParam}`
        : 'http://localhost:3000/api/transaction';

      const response = await axios[idParam ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Transaction details ${idParam ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (idParam) window.location.href = '/transactions';
          else setFormData(initialFormData);
        }, 1000);
      } else {
        setErrorMessage(
          `Transaction ${idParam ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Student with the provided PRN does not exist.');
        setErrorMessage('Student with the provided PRN does not exist.');
      } else if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        console.error('Please login to access.');
        setErrorMessage('Student with the provided PRN does not exist.');
      } else {
        console.error(error);
        setErrorMessage(
          `An error occurred during transaction ${idParam ? 'update' : 'submission'}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/transactions';
  };

  let buttonText = 'Submit Transaction';
  if (idParam) {
    buttonText = 'Update Transaction';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Transactions</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Transactions
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

            {/* Development Fee */}
            <Grid item xs={6}>
              <TextField
                name="developmentfee"
                label="Development Fee"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.developmentfee}
                onChange={handleChange}
                error={!!formErrors.developmentfee}
                helperText={formErrors.developmentfee}
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

            {/* Type of Payment */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type of Payment</InputLabel>
                <Select
                  name="paymenttype"
                  value={formData.paymenttype}
                  onChange={handleChange}
                  label="Type of Payment"
                  error={!!formErrors.paymenttype}
                  required
                >
                  <MenuItem value="DD">DD</MenuItem>
                  <MenuItem value="IMPS">IMPS</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="RTGS">RTGS</MenuItem>
                  <MenuItem value="NEFT">NEFT</MenuItem>
                  <MenuItem value="CASH">CASH</MenuItem>
                  <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* utr */}
            <Grid item xs={6}>
              <TextField
                name="utr"
                label="UTR/Ref. Number"
                variant="outlined"
                fullWidth
                value={formData.utr}
                onChange={handleChange}
                error={!!formErrors.utr}
                helperText={formErrors.utr}
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

            {/* Academic Year */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicyear"
                  value={formData.academicyear}
                  onChange={handleChange}
                  label="Academic Year"
                  error={!!formErrors.academicyear}
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

            {/* Year Name */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Year Name</InputLabel>
                <Select
                  name="yearname"
                  value={formData.yearname}
                  onChange={handleChange}
                  label="Year Name"
                  error={!!formErrors.yearname}
                  required
                >
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                </Select>
              </FormControl>
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
