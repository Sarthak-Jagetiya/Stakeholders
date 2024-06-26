import axios from 'axios';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Grid,
  Stack,
  Paper,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

// feestructure component
export default function FeeStructureForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  let token;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  const localStorageValue = localStorage.getItem('jwt');
  if (cookieValue) {
    token = cookieValue.split('=')[1];
  } else if (localStorageValue) {
    token = localStorageValue;
  }

  const initialFormData = {
    code: '',
    academicyear: '',
    category: '',
    scholarship: 0,
    tuitionfees: '',
    eligibilityregistration: '',
    universityfees: '',
    library: '',
    collegeexam: '',
    developmentfee: '',
    other: '',
    cautionmoney: '',
  };
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  const getCurrentYear = () => new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 21 }, (_, index) => {
    const startYear = getCurrentYear() - 10 + index;
    const endYear = startYear + 1;
    return `${startYear.toString()}-${endYear.toString().slice(-2)}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${databaseLocalUrl}/feestructure/${code}`, {
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

    if (code) {
      fetchData();
    }
  }, [code, token]);

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
      if (key !== 'code' && parseFloat(formData[key]) < 0) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be negative`;
      } else if (!formData[key] && key !== 'scholarship' && formData[key] !== 0) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const apiEndpoint = code
        ? `${databaseLocalUrl}/feestructure/${code}`
        : `${databaseLocalUrl}/feestructure`;

      const response = await axios[code ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Fee structure details ${code ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (code) window.location.href = '/feeStructuretable';
          else setFormData(initialFormData);
        }, 1000);
      } else {
        setErrorMessage(
          `Fee structure ${code ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrorMessage('Fee Structure with the provided code already exists.');
      } else if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        setErrorMessage('Please Login to access.');
      } else {
        setErrorMessage(
          `An error occurred during fee structure ${code ? 'update' : 'submission'}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/feestructuretable';
  };

  let buttonText = 'Submit Fee Structure';
  if (code) {
    buttonText = 'Update Fee Structure';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Fee Structure</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Fee Structures
        </Button>
      </Stack>

      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Code */}
            <Grid item xs={6}>
              <TextField
                name="code"
                label="Code"
                variant="outlined"
                fullWidth
                value={formData.code}
                onChange={handleChange}
                error={!!formErrors.code}
                helperText={formErrors.code}
                disabled={!!code}
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

            {/* Category */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catogery"
                  required
                >
                  <MenuItem value="General_OPEN">General_OPEN</MenuItem>
                  <MenuItem value="EBC_SEBC_EWS">EBC_SEBC_EWS</MenuItem>
                  <MenuItem value="OBC">OBC</MenuItem>
                  <MenuItem value="VJNT_NT_SBC_NT1_NT2_NT3">VJNT_NT_SBC_NT1_NT2_NT3</MenuItem>
                  <MenuItem value="SC_ST">SC_ST</MenuItem>
                  <MenuItem value="Inst_mgmt">Inst_mgmt</MenuItem>
                </Select>
              </FormControl>
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
