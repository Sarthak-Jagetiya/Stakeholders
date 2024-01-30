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

const EmployeeForm = () => {
  const initialFormData = {
    eid: '',
    name: '',
    gender: '',
    phone: '',
    email: '',
    aadhar: '',
    designation: '',
    emergencycontact: '',
    college: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eid = searchParams.get('eid');

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const trimZeros = (value) => value.replace(/^0+/, '');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateAadharNumber = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validateEmergencyContact = (emergencyContact) => {
    const emergencyContactRegex = /^\d{10}$/;
    return emergencyContactRegex.test(emergencyContact);
  };

  useEffect(() => {
    const fetchDataForEdit = async (employeeID) => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get(`http://localhost:3000/api/employee/${employeeID}`, {
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

    if (eid) {
      fetchDataForEdit(eid);
    }
  }, [eid]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input Validation
    const errors = {};
    Object.keys(formData).forEach((key) => {
      let value = formData[key];

      // Trim trailing spaces and zeros
      if (typeof value === 'string') {
        value = trimZeros(value.trim());
        setFormData((prevData) => ({ ...prevData, [key]: value }));
      }

      if (!value) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      } else {
        // Additional validations for specific fields
        switch (key) {
          case 'email':
            if (!validateEmail(value)) {
              errors[key] = 'Invalid email address';
            }
            break;
          case 'phone':
            if (!validatePhoneNumber(value)) {
              errors[key] = 'Invalid phone number';
            }
            break;
          case 'aadhar':
            if (!validateAadharNumber(value)) {
              errors[key] = 'Invalid Aadhar number';
            }
            break;
          case 'emergencycontact':
            if (!validateEmergencyContact(value)) {
              errors[key] = 'Invalid emergency contact number';
            }
            break;
          // Add more validations for other fields if needed
          default:
            break;
        }
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
      const apiEndpoint = formData.eid
        ? `http://localhost:3000/api/employee/${formData.eid}`
        : 'http://localhost:3000/api/employee/';

      const response = await axios[formData.eid ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(
          `Employee details ${formData.eid ? 'updated' : 'submitted'} successfully!`
        );
        setTimeout(() => {
          setSuccessMessage('');
          if (formData.eid) window.location.href = '/employees';
          else setFormData(initialFormData);
        }, 1000);
      } else {
        setErrorMessage(
          `Employee ${formData.eid ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setErrorMessage('An error occurred during registration (Eid may be duplicate).');
        } else if (
          error instanceof TypeError &&
          error.message.includes('Cannot read properties of undefined')
        ) {
          setErrorMessage('Please Login to access.');
        } else {
          console.error(error);
          setErrorMessage('An error occurred during registration');
        }
      } else {
        setErrorMessage('Network error: Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/employees';
  };

  let buttonText = 'Submit Fee Structure';
  if (eid) {
    buttonText = 'Update Fee Structure';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Employee Form</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Employees
        </Button>
      </Stack>
      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Employee ID"
                fullWidth
                value={formData.eid}
                onChange={(e) => handleInputChange('eid', e.target.value)}
                error={!!formErrors.eid}
                helperText={formErrors.eid}
                required
                disabled={!!formData.eid}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Gender"
                  error={!!formErrors.gender}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Aadhar"
                fullWidth
                value={formData.aadhar}
                onChange={(e) => handleInputChange('aadhar', e.target.value)}
                error={!!formErrors.aadhar}
                helperText={formErrors.aadhar}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Designation"
                fullWidth
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                error={!!formErrors.designation}
                helperText={formErrors.designation}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Emergency Contact"
                fullWidth
                value={formData.emergencycontact}
                onChange={(e) => handleInputChange('emergencycontact', e.target.value)}
                error={!!formErrors.emergencycontact}
                helperText={formErrors.emergencycontact}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="College"
                fullWidth
                value={formData.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                error={!!formErrors.college}
                helperText={formErrors.college}
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
            <Typography variant="body1" sx={{ color: 'green', mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" sx={{ color: 'red', mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;
