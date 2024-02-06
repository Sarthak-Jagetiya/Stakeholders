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
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

export default function RegisterView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prnparam = searchParams.get('prn');

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
    aadhar: '',
    religion: '',
    typeofadmission: '',
    bloodgroup: '',
    subcaste: '',
    MUHS_PRN: '',
    remark: '',
    admissionstatus: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [casteCategoryOptions, setCasteCategoryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCurrentYear = () => new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 6 }, (_, index) => {
    const startYear = getCurrentYear() - index;
    const endYear = startYear + 1;
    return `${startYear.toString()}-${endYear.toString().slice(-2)}`;
  });

  const fetchCategoryOptions = async () => {
    const currentYear = new Date().getFullYear();
    const year = currentYear + (currentYear + 1).toString().slice(-2);
    const pretext = `FS${year}`;
    try {
      const response = await axios.get(`${databaseLocalUrl}/feestructure/unique`);
      if (response.data.status === 'success') {
        setCategoryOptions(
          response.data.data.data.map((option) => ({
            label: option.category,
            value: `${pretext}${option.code.slice(-1)}`,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch category options:', error);
    }
  };

  const generatePRN = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt'))
        .split('=')[1];
      const response = await axios.get(`${databaseLocalUrl}/student/lastStudent/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 'success') {
        const newSN = String(Number(response.data.data.slice(-3)) + 1).padStart(3, '0');
        const currYear = new Date().getFullYear();

        setFormData((prevFormData) => ({
          ...prevFormData,
          PRN: `BPT${String(currYear) + String(newSN)}`,
        }));
      }
    } catch (error) {
      console.error('Something went wrong!!');
    }
  };

  const fetchLocalData = async () => {
    try {
      const courses = await axios.get('./courses.json');
      const states = await axios.get('./states.json');
      const religions = await axios.get('./religions.json');
      const casteCategories = await axios.get('./casteCategories.json');

      setCourseOptions(
        courses.data.courses.map((course) => ({
          label: course.courseName,
          value: course.courseName,
        }))
      );
      setStateOptions(
        states.data.map((state) => ({
          label: state.name,
          value: state.name,
        }))
      );
      setReligionOptions(
        religions.data.map((religion) => ({
          label: religion.name,
          value: religion.name,
        }))
      );
      setCasteCategoryOptions(casteCategories.data.casteCategories);
    } catch (error) {
      console.error('Failed to fetch Local data');
    }
  };

  useEffect(() => {
    generatePRN();
    fetchLocalData();
    fetchCategoryOptions();

    // If `prnparam` is present, fetch the data for that PRN
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get(`${databaseLocalUrl}/student/${prnparam}`, {
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

    if (prnparam) {
      fetchData();
    }
  }, [prnparam]);

  const validateForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (String(formData.phone).length !== 10) {
      errors.phone = 'Phone should only contain 10 digits numbers';
      valid = false;
    }

    if (String(formData.parentphone).length !== 10) {
      errors.parentphone = "Parent's Phone should only contain 10 numbers";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
      valid = false;
    }

    if (!formData.aadhar.match(/^\d{12}$/)) {
      errors.aadhar = 'Aadhar should be of 12-digits';
      valid = false;
    }

    if (formData.cetmarks < -10 || formData.cetmarks > 720) {
      errors.cetmarks = 'CET Marks should be between -10 and 720';
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

      setLoading(true);

      try {
        const apiEndpoint = prnparam
          ? `${databaseLocalUrl}/student/${prnparam}`
          : `${databaseLocalUrl}/student/`;

        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];

        const response = await axios[prnparam ? 'patch' : 'post'](apiEndpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          setErrorMessage('');
          setSuccessMessage(`Successfully ${prnparam ? 'Updated' : 'Registered'}!`);
          generatePRN();
          setTimeout(() => {
            setSuccessMessage('');
            if (prnparam) window.location.href = '/students';
          }, 1000);
          setFormData(initialFormData);
        } else {
          setErrorMessage(
            `${prnparam ? 'Update' : 'Registration'} failed: ${response.data.message}`
          );
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            setErrorMessage('An error occurred (PRN may be duplicate).');
          } else if (
            error instanceof TypeError &&
            error.message.includes('Cannot read properties of undefined')
          ) {
            setErrorMessage('Please Login to Access.');
          } else {
            setErrorMessage('An error occurred.');
          }
        } else {
          setErrorMessage('Network error: Unable to connect to the server.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Form has errors. Please correct them.');
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/students';
  };
  let buttonText = 'Register';
  if (prnparam) {
    buttonText = 'Update';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Register</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Students
        </Button>
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
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="MUHS_PRN"
                label="MUHS PRN"
                variant="outlined"
                fullWidth
                value={formData.MUHS_PRN}
                onChange={handleChange}
                error={!!formErrors.MUHS_PRN}
                helperText={formErrors.MUHS_PRN}
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="name"
                label="Full Name"
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
                type="number"
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
                type="number"
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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  label="Course"
                  error={!!formErrors.course}
                  helperText={formErrors.course}
                  required
                >
                  {courseOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="admissionyear"
                  value={formData.admissionyear}
                  onChange={handleChange}
                  label="Admission Year"
                  error={!!formErrors.admissionyear}
                  helperText={formErrors.admissionyear}
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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Domicile State</InputLabel>
                <Select
                  name="domicilestate"
                  value={formData.domicilestate}
                  onChange={handleChange}
                  label="Domicile State"
                  error={!!formErrors.domicilestate}
                  helperText={formErrors.domicilestate}
                  required
                >
                  {stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="aadhar"
                label="Aadhar"
                variant="outlined"
                type="number"
                fullWidth
                value={formData.aadhar}
                onChange={handleChange}
                error={!!formErrors.aadhar}
                helperText={formErrors.aadhar}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  onChange={handleChange}
                  label="Blood Group"
                  required
                >
                  <MenuItem value="A+">A positive (A+)</MenuItem>
                  <MenuItem value="A-">A negative (A-)</MenuItem>
                  <MenuItem value="B+">B positive (B+)</MenuItem>
                  <MenuItem value="B-">B negative (B-)</MenuItem>
                  <MenuItem value="AB+">AB positive (AB+)</MenuItem>
                  <MenuItem value="AB-">AB negative (AB-)</MenuItem>
                  <MenuItem value="O+">O positive (O+)</MenuItem>
                  <MenuItem value="O-">O negative (O-)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Caste Category</InputLabel>
                <Select
                  name="studentcategory"
                  value={formData.studentcategory}
                  onChange={handleChange}
                  label="Student Category"
                  error={!!formErrors.studentcategory}
                  helperText={formErrors.studentcategory}
                  required
                >
                  {casteCategoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Religion</InputLabel>
                <Select
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  label="Religion"
                  error={!!formErrors.religion}
                  helperText={formErrors.religion}
                  required
                >
                  {religionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="subcaste"
                label="Sub-caste"
                variant="outlined"
                fullWidth
                value={formData.subcaste}
                onChange={handleChange}
                error={!!formErrors.subcaste}
                helperText={formErrors.subcaste}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type of Admission</InputLabel>
                <Select
                  name="typeofadmission"
                  value={formData.typeofadmission}
                  onChange={handleChange}
                  label="Type of Admission"
                  required
                >
                  <MenuItem value="CAP-1">CAP-1</MenuItem>
                  <MenuItem value="CAP-2">CAP-2</MenuItem>
                  <MenuItem value="CAP-3">CAP-3</MenuItem>
                  <MenuItem value="INST">INST</MenuItem>
                  <MenuItem value="MGMT">MGMT</MenuItem>
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
                  helperText={formErrors.feestructure}
                  required
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  helperText={formErrors.admissioncategory}
                  required
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="cetmarks"
                label="NEET Marks"
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
                <InputLabel>Admission Status</InputLabel>
                <Select
                  name="admissionstatus"
                  value={formData.admissionstatus}
                  onChange={handleChange}
                  label="Admission Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="remark"
                label="Remark"
                variant="outlined"
                fullWidth
                value={formData.remark}
                onChange={handleChange}
                error={!!formErrors.remark}
                helperText={formErrors.remark}
                required
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
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </Paper>
    </Container>
  );
}
