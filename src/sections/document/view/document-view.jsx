import axios from 'axios';
import React, { useRef, useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

const DocumentForm = () => {
  const initialFormData = {
    PRN: '',
    aadhar: null,
    nationality: null,
    domicile: null,
    ssc: null,
    hsc: null,
    medicalfitness: null,
    photo: null,
    verified: 0,
    verifiedby: ' ',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const aadharRef = useRef();
  const nationalityRef = useRef();
  const domicileRef = useRef();
  const sscRef = useRef();
  const hscRef = useRef();
  const medicalFitnessRef = useRef();
  const photoRef = useRef();

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [fileType]: file,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/document/', formData);

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage('Documents uploaded successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          setFormData(initialFormData);

          // Clear file inputs
          aadharRef.current.value = '';
          nationalityRef.current.value = '';
          domicileRef.current.value = '';
          sscRef.current.value = '';
          hscRef.current.value = '';
          medicalFitnessRef.current.value = '';
          photoRef.current.value = '';
        }, 2000);
      } else {
        setErrorMessage(`Document upload failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response && error.response.status === 399) {
          setErrorMessage('Student entry with the provided PRN already exists.');
        } else if (error.response && error.response.status === 400) {
          setErrorMessage('Student with the provided PRN does not exist.');
        } else {
          setErrorMessage('An error occurred during document upload');
        }
      } else {
        setErrorMessage('Network error: Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Document Upload Form</Typography>
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
                onChange={handleInputChange}
                required
              />
            </Grid>

            {/* Aadhar */}
            <Grid item xs={6}>
              <Typography variant="subtitle1">Aadhar</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'aadhar')}
                required
                ref={aadharRef}
              />
            </Grid>

            {/* Nationality */}
            <Grid item xs={6}>
              <Typography variant="subtitle1">Nationality Certificate</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'nationality')}
                required
                ref={nationalityRef}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">Domicile Certificate</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'domicile')}
                required
                ref={domicileRef}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">SSC Certificate</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'ssc')}
                required
                ref={sscRef}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">HSC Certificate</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'hsc')}
                required
                ref={hscRef}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">Medical Fitness Certificate</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'medicalfitness')}
                required
                ref={medicalFitnessRef}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">Photo</Typography>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, 'photo')}
                required
                ref={photoRef}
              />
            </Grid>
            {/* Verified */}
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.verified}
                    onChange={() =>
                      setFormData((prevData) => ({ ...prevData, verified: !prevData.verified }))
                    }
                  />
                }
                label="Verified"
              />
            </Grid>

            {/* Verified By */}
            <Grid item xs={6}>
              <TextField
                name="verifiedby"
                label="Verified By"
                variant="outlined"
                fullWidth
                value={formData.verifiedby}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Documents'}
          </Button>

          {/* Display Success or Error Messages */}
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
};

export default DocumentForm;
