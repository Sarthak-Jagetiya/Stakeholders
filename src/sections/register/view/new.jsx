import axios from 'axios';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide'; // Import the Slide component from MUI
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
    PRN: '1234567890',
    name: 'qwerty',
    gender: 'male',
    dob: '2023-12-14',
    phone: '1234567890',
    parentphone: '1234567890',
    email: 'qwerty@gmail.com',
    address: 'qwerty',
    course: 'Btech.',
    admissionyear: '2023',
    dateofadmission: '2023-12-14',
    domicilestate: 'Rajasthan',
    studentcategory: 'GEN',
    admissioncategory: 'GEN',
    cetmarks: '78',
    scholarship: '0',
    feestructure: 'GEN',
  };

  const initialDocumentFormData = {
    PRN: '',
    aadhar: null,
    nationality: null,
    domicile: null,
    ssc: null,
    hsc: null,
    medicalfitness: null,
    photo: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [documentFormData, setDocumentFormData] = useState(initialDocumentFormData);

  const validateForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!formData.PRN.match(/^[0-9]+$/)) {
      errors.PRN = 'PRN should only contain numbers';
      valid = false;
    }

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
        const response = await axios.post('http://10.0.2.182:3000/api/student/', formData);

        if (response.data.status === 'success') {
          setSuccessMessage('Successfully Signed Up!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
          setIsRegistered(true); // Update registration status
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

  const handleDocumentChange = (event, documentType) => {
    const file = event.target.files[0];
    setDocumentFormData({ ...documentFormData, [documentType]: file });
  };

  const handleDocumentSubmit = async (event) => {
    event.preventDefault();
    // Create a FormData object for the document uploads
    const documentData = new FormData();
    console.log(documentFormData);
    console.log(formData);
    Object.keys(documentFormData).forEach((key) => {
      documentData.append(key, documentFormData[key]);
    });

    try {
      const response = await axios.post('http://10.0.2.182:3000/api/document', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Documents uploaded successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          // setDocumentFormData(initialDocumentFormData);
        }, 2000);
      } else {
        setErrorMessage(`Document upload failed: ${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setErrorMessage('An error occurred during document upload.');
      } else {
        setErrorMessage('Network error: Unable to connect to the server.');
      }
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{isRegistered ? 'Upload Documents' : 'Register'}</Typography>
      </Stack>

      <Slide in={!isRegistered} direction="left" mountOnEnter unmountOnExit>
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="admissioncategory"
                  label="Admission Category"
                  variant="outlined"
                  fullWidth
                  value={formData.admissioncategory}
                  onChange={handleChange}
                  error={!!formErrors.admissioncategory}
                  helperText={formErrors.admissioncategory}
                />
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
                  >
                    <MenuItem value="1">Yes</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="feestructure"
                  label="Fee Structure"
                  variant="outlined"
                  fullWidth
                  value={formData.feestructure}
                  onChange={handleChange}
                  error={!!formErrors.feestructure}
                  helperText={formErrors.feestructure}
                />
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
      </Slide>

      <Slide in={isRegistered} direction="up" mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
        >
          <form onSubmit={handleDocumentSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <TextField
                  name="PRN"
                  label="PRN"
                  variant="outlined"
                  fullWidth
                  value={formData.PRN}
                  onChange={(e) => handleDocumentChange(e, 'PRN')}
                  error={!!formErrors.PRN}
                  helperText={formErrors.PRN}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Aadhar Card</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'aadhar')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Nationality Certificate</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'nationality')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Domicile Certificate</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'domicile')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">SSC Certificate</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'ssc')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">HSC Certificate</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'hsc')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Medical Fitness Certificate</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'medicalfitness')}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Photo</Typography>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => handleDocumentChange(e, 'photo')}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleDocumentSubmit}
              sx={{ mt: 6 }}
            >
              Upload Documents
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
      </Slide>
    </Container>
  );
}
