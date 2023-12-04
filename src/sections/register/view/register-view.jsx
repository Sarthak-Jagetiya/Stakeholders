import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

export default function RegisterView() {
  const initialFormData = {
    PRN: '',
    name: '',
    gender: '',
    dob: '',
    phone: '',
    parentphone: '',
    email: '',
    address: '',
    course: '',
    admissionyear: '',
    dateofadmission: '',
    domicilestate: '',
    studentcategory: '',
    admissioncategory: '',
    cetmarks: '',
    scholarship: '0',
    feestructure: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categoryOptions = [
    'General_OPEN',
    'EBC_SEBC_EWS',
    'OBC',
    'VJNT_NT_SBC_NT1_NT2_NT3',
    'SC_ST',
    'Inst_mgmt',
  ];

  const generatePRN = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/student/lastStudent/');
      if (response.data.status === 'success') {
        const newSN = String(Number(response.data.data.slice(-3)) + 1).padStart(3, '0');
        const currentYear = new Date().getFullYear();
        setFormData((prevFormData) => ({
          ...prevFormData,
          PRN: `BPT${String(currentYear) + String(newSN)}`,
        }));
      }
    } catch (error) {
      console.error('Something went wrong!!');
    }
  };

  useEffect(() => {
    generatePRN();
  }, []);

  const validateForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    // if (!formData.PRN.length !== 10) {
    //   errors.PRN = 'PRN should be a 10-digit long';
    //   valid = false;
    // }

    if (!formData.name) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
      valid = false;
    }

    if (!formData.dob) {
      errors.dob = 'Date of Birth is required';
      valid = false;
    }

    if (!formData.phone.match(/^[0-9]+$/) || formData.phone.length !== 10) {
      errors.phone = 'Phone should only contain 10 digits numbers';
      valid = false;
    }

    if (!formData.parentphone.match(/^[0-9]+$/) || formData.parentphone.length !== 10) {
      errors.parentphone = "Parent's Phone should only contain 10 numbers";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
      valid = false;
    }

    if (!formData.course) {
      errors.course = 'Course is required';
      valid = false;
    }

    if (!formData.admissionyear.match(/^[0-9]+$/)) {
      errors.admissionyear = 'Admission Year should only contain numbers';
      valid = false;
    }

    if (!formData.dateofadmission) {
      errors.dateofadmission = 'Date of Admission is required';
      valid = false;
    }

    if (!formData.domicilestate) {
      errors.domicilestate = 'Domicile State is required';
      valid = false;
    }

    if (!formData.studentcategory) {
      errors.studentcategory = 'Student Category is required';
      valid = false;
    }

    if (!formData.admissioncategory) {
      errors.admissioncategory = 'Admission Category is required';
      valid = false;
    }

    if (!formData.cetmarks.match(/^[0-9]+$/)) {
      errors.cetmarks = 'CET Marks should only contain numbers';
      valid = false;
    } else if (formData.cetmarks < 0 || formData.cetmarks > 100) {
      errors.cetmarks = 'CET Marks should be between 0 and 100';
      valid = false;
    }

    if (!formData.feestructure) {
      errors.feestructure = 'Fee Structure is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setSuccessMessage('');
      setErrorMessage('');

      try {
        const response = await axios.post('http://localhost:3000/api/student/', formData);

        if (response.data.status === 'success') {
          setSuccessMessage('Successfully Signed Up!');
          generatePRN();
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
          setFormData(initialFormData);
        } else {
          setErrorMessage(`Registration failed: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            setErrorMessage('An error occurred during registration (PRN may be duplicate).');
          } else {
            setErrorMessage('An error occurred during registration');
          }
        } else {
          setErrorMessage('Network error: Unable to connect to the server.');
        }
      }
    } else {
      setErrorMessage('Form has errors. Please correct them.');
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Register</Typography>
      </Stack>

      <Paper elevation={3} style={{ padding: '60px 40px', borderRadius: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
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
                  onChange={handleChange}
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
                name="dob"
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.dob}
                onChange={handleChange}
                error={!!formErrors.dob}
                helperText={formErrors.dob}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="parentphone"
                label="Parent's Phone"
                variant="outlined"
                fullWidth
                value={formData.parentphone}
                onChange={handleChange}
                error={!!formErrors.parentphone}
                helperText={formErrors.parentphone}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="course"
                label="Course"
                variant="outlined"
                fullWidth
                value={formData.course}
                onChange={handleChange}
                error={!!formErrors.course}
                helperText={formErrors.course}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="admissionyear"
                label="Admission Year"
                variant="outlined"
                fullWidth
                value={formData.admissionyear}
                onChange={handleChange}
                error={!!formErrors.admissionyear}
                helperText={formErrors.admissionyear}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="dateofadmission"
                label="Date of Admission"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.dateofadmission}
                onChange={handleChange}
                error={!!formErrors.dateofadmission}
                helperText={formErrors.dateofadmission}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="domicilestate"
                label="Domicile State"
                variant="outlined"
                fullWidth
                value={formData.domicilestate}
                onChange={handleChange}
                error={!!formErrors.domicilestate}
                helperText={formErrors.domicilestate}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="studentcategory"
                label="Student Category"
                variant="outlined"
                fullWidth
                value={formData.studentcategory}
                onChange={handleChange}
                error={!!formErrors.studentcategory}
                helperText={formErrors.studentcategory}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Admission Category</InputLabel>
                <Select
                  name="admissioncategory"
                  value={formData.admissioncategory}
                  onChange={handleChange}
                  label="Admission Category"
                  error={!!formErrors.admissioncategory}
                  required
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="cetmarks"
                label="CET Marks"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.cetmarks}
                onChange={handleChange}
                error={!!formErrors.cetmarks}
                helperText={formErrors.cetmarks}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Scholarship</InputLabel>
                <Select
                  name="scholarship"
                  value={formData.scholarship}
                  onChange={handleChange}
                  label="Scholarship"
                  required
                >
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Fee Structure</InputLabel>
                <Select
                  name="feestructure"
                  value={formData.feestructure}
                  onChange={handleChange}
                  label="Fee Structure"
                  error={!!formErrors.feestructure}
                  required
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Register
          </Button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </Paper>
    </Container>
  );
}
