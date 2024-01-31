import axios from 'axios';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prnParam = searchParams.get('prn');

  const initialFormData = {
    PRN: '',
    cetForm: null,
    neetScoreCard: null,
    sscMarksheet: null,
    sscCertificate: null,
    hscMarksheet: null,
    hscCertificate: null,
    aadhar: null,
    nationality: null,
    domicile: null,
    medicalFitness: null,
    photo: null,
    caste: null,
    casteValidity: null,
    parentIncome: null,
    nonCreamyLayer: null,
    tc: null,
    educationGapAffidavit: null,
    ews: null,
    minorityDeclaration: null,
    disability: null,
    migration: null,
    other: null,
    verified: 0,
    verifiedBy: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Refs for file inputs
  const fileInputRefs = {
    cetForm: useRef(),
    neetScoreCard: useRef(),
    sscMarksheet: useRef(),
    sscCertificate: useRef(),
    hscMarksheet: useRef(),
    hscCertificate: useRef(),
    aadhar: useRef(),
    nationality: useRef(),
    domicile: useRef(),
    medicalFitness: useRef(),
    photo: useRef(),
    caste: useRef(),
    casteValidity: useRef(),
    parentIncome: useRef(),
    nonCreamyLayer: useRef(),
    tc: useRef(),
    educationGapAffidavit: useRef(),
    ews: useRef(),
    minorityDeclaration: useRef(),
    disability: useRef(),
    migration: useRef(),
    other: useRef(),
  };

  useEffect(() => {
    // Fetch existing data if PRN is present
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];

        const response = await axios.get(`http://localhost:3000/api/document/${prnParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.status);
        const existingData = response.data.data;
        setFormData(existingData.data);
      } catch (error) {
        console.error('Error fetching existing data:', error.message);
      }
    };

    if (prnParam) {
      fetchData();
    }
  }, [prnParam]);

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];

    // Check if the file type is PDF
    if (!file.type.includes('pdf')) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fileType]: `${fileType} should be a PDF file.`,
      }));
      return;
    }

    // Check if the file size is below 1MB
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 1) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fileType]: `${fileType} should be below 1MB.`,
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        [fileType]: reader.result.split(',')[1],
      }));
      // Clear the error if the file is below 1MB and of PDF type
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fileType]: undefined,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVerifiedChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      verified: !prevData.verified,
      verifiedBy: prevData.verified ? '' : prevData.verifiedBy,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input Validation
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key === 'PRN') {
        errors[key] = `${key} is required`;
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
      const apiEndpoint = prnParam
        ? `http://localhost:3000/api/document/${prnParam}`
        : 'http://localhost:3000/api/document';

      const response = await axios[prnParam ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Document details ${prnParam ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (prnParam) window.location.href = '/documents';
          else {
            setFormData(initialFormData);

            // Clear file inputs
            Object.values(fileInputRefs).forEach((ref) => {
              ref.current.value = '';
            });
          }
        }, 1000);
      } else {
        setErrorMessage(
          `Document ${prnParam ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 399) {
        setErrorMessage('Student entry with the provided PRN already exists.');
      } else if (error.response && error.response.status === 400) {
        setErrorMessage('Student with the provided PRN does not exist.');
      } else if (error.response && error.response.status === 404) {
        setErrorMessage('No changes found to update.');
      } else if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        setErrorMessage('Please Login to access.');
      } else {
        setErrorMessage(
          `An error occurred during document ${prnParam ? 'update' : 'submission'}. ${error}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/documents';
  };

  let buttonText = 'Submit Documents';
  if (prnParam) {
    buttonText = 'Update Documents';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Document Upload Form</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Documents
        </Button>
      </Stack>
      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* PRN */}
            <Grid item xs={12}>
              <TextField
                name="PRN"
                label="PRN"
                variant="outlined"
                fullWidth
                value={formData.PRN}
                onChange={handleInputChange}
                error={!!formErrors.PRN}
                helperText={formErrors.PRN}
                required
                disabled={!!prnParam}
              />
            </Grid>

            {/* CET Online Registration form */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="CET Registration form"
                onChange={(e) => handleFileChange(e, 'cetForm')}
                error={!!formErrors.cetForm}
                helperText={formErrors.cetForm}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* NEET Scorecard */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="NEET Scorecard"
                onChange={(e) => handleFileChange(e, 'neetScoreCard')}
                error={!!formErrors.neetScoreCard}
                helperText={formErrors.neetScoreCard}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* SSC Marksheet */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="SSC Marksheet"
                onChange={(e) => handleFileChange(e, 'sscMarksheet')}
                error={!!formErrors.sscMarksheet}
                helperText={formErrors.sscMarksheet}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* SSC Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="SSC Certificate"
                onChange={(e) => handleFileChange(e, 'sscCertificate')}
                error={!!formErrors.sscCertificate}
                helperText={formErrors.sscCertificate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* HSC Marksheet */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="HSC Marksheet"
                onChange={(e) => handleFileChange(e, 'hscMarksheet')}
                error={!!formErrors.hscMarksheet}
                helperText={formErrors.hscMarksheet}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* HSC Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="HSC Certificate"
                onChange={(e) => handleFileChange(e, 'hscCertificate')}
                error={!!formErrors.hscCertificate}
                helperText={formErrors.hscCertificate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Aadhar */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Aadhar"
                onChange={(e) => handleFileChange(e, 'aadhar')}
                error={!!formErrors.aadhar}
                helperText={formErrors.aadhar}
                // required={!prnParam}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Nationality Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Nationality Certificate"
                onChange={(e) => handleFileChange(e, 'nationality')}
                error={!!formErrors.nationality}
                helperText={formErrors.nationality}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Domicile Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Domicile Certificate"
                onChange={(e) => handleFileChange(e, 'domicile')}
                error={!!formErrors.domicile}
                helperText={formErrors.domicile}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Medical Fitness Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Medical Fitness Certificate"
                onChange={(e) => handleFileChange(e, 'medicalFitness')}
                error={!!formErrors.medicalFitness}
                helperText={formErrors.medicalFitness}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Photo */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Photo"
                onChange={(e) => handleFileChange(e, 'photo')}
                error={!!formErrors.photo}
                helperText={formErrors.photo}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Caste Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Caste Certificate"
                onChange={(e) => handleFileChange(e, 'caste')}
                error={!!formErrors.caste}
                helperText={formErrors.caste}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Caste Validity Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Caste Validity Certificate"
                onChange={(e) => handleFileChange(e, 'casteValidity')}
                error={!!formErrors.casteValidity}
                helperText={formErrors.casteValidity}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Parent Income Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Parent Income Certificate"
                onChange={(e) => handleFileChange(e, 'parentIncome')}
                error={!!formErrors.parentIncome}
                helperText={formErrors.parentIncome}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Non-Creamy Layer Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Non-Creamy Layer Certificate"
                onChange={(e) => handleFileChange(e, 'nonCreamyLayer')}
                error={!!formErrors.nonCreamyLayer}
                helperText={formErrors.nonCreamyLayer}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* TC (Transfer Certificate) */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Transfer Certificate"
                onChange={(e) => handleFileChange(e, 'tc')}
                error={!!formErrors.tc}
                helperText={formErrors.tc}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Education Gap Affidavit */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Education Gap Affidavit"
                onChange={(e) => handleFileChange(e, 'educationGapAffidavit')}
                error={!!formErrors.educationGapAffidavit}
                helperText={formErrors.educationGapAffidavit}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* EWS (Economically Weaker Section) Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="EWS Certificate"
                onChange={(e) => handleFileChange(e, 'ews')}
                error={!!formErrors.ews}
                helperText={formErrors.ews}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Minority Declaration */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Minority Declaration"
                onChange={(e) => handleFileChange(e, 'minorityDeclaration')}
                error={!!formErrors.minorityDeclaration}
                helperText={formErrors.minorityDeclaration}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Disability Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Disability Certificate"
                onChange={(e) => handleFileChange(e, 'disability')}
                error={!!formErrors.disability}
                helperText={formErrors.disability}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Migration Certificate */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Migration Certificate"
                onChange={(e) => handleFileChange(e, 'migration')}
                error={!!formErrors.migration}
                helperText={formErrors.migration}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Other Document */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Other Document"
                onChange={(e) => handleFileChange(e, 'other')}
                error={!!formErrors.other}
                helperText={formErrors.other}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Verified */}
            <Grid item xs={6}>
              <FormControlLabel
                control={<Switch checked={formData.verified} onChange={handleVerifiedChange} />}
                label="Verified"
              />
            </Grid>

            {/* Verified By */}
            <Grid item xs={6}>
              <TextField
                name="verifiedBy"
                label="Verified By"
                variant="outlined"
                fullWidth
                value={formData.verifiedBy}
                onChange={handleInputChange}
                required
                disabled={!formData.verified}
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
            {loading ? 'Uploading...' : buttonText}
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
