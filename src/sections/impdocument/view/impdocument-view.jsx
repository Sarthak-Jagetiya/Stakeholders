import axios from 'axios';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

const ImpDocumentForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const didParam = searchParams.get('did');
  const [fileTypeError, setFileTypeError] = useState('');

  let token;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  const localStorageValue = localStorage.getItem('jwt');
  if (cookieValue) {
    token = cookieValue.split('=')[1];
  } else if (localStorageValue) {
    token = localStorageValue;
  }

  const initialFormData = {
    docData: null,
    remark: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const docRef = useRef();

  useEffect(() => {
    // Fetch existing data if did is present
    const fetchData = async () => {
      try {
        const response = await axios.get(`${databaseLocalUrl}/impdocument/${didParam}`, {
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

    if (didParam) {
      fetchData();
    }
  }, [didParam, token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Check if the file size is below 1MB
    if (file.size > 1024 * 1024) {
      setFileTypeError('File size exceeds 1MB. Please choose a smaller file.');
      setFormData((prevData) => ({
        ...prevData,
        docData: null,
      }));
      return;
    }

    reader.onloadend = () => {
      // Check if the file type is PDF
      if (file.type !== 'application/pdf') {
        setFileTypeError('Only PDF files are allowed.');
        setFormData((prevData) => ({
          ...prevData,
          docData: null,
        }));
      } else {
        setFileTypeError('');
        setFormData((prevData) => ({
          ...prevData,
          docData: reader.result.split(',')[1],
        }));
      }
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input Validation
    const errors = {};
    // Object.keys(formData).forEach((key) => {
    //   if (!formData[key] && key === 'docData') {
    //     errors[key] = 'Document(PDF) file is required';
    //   }
    // });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Determine whether to use POST or PUT based on the presence of did
      const apiEndpoint = didParam
        ? `${databaseLocalUrl}/impdocument/${didParam}`
        : `${databaseLocalUrl}/impdocument/`;

      const response = await axios[didParam ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Document details ${didParam ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (didParam) window.location.href = '/impdocuments';
          else {
            setFormData(initialFormData);

            // Clear file input
            docRef.current.value = '';
          }
        }, 1000);
      } else {
        setErrorMessage(
          `Document ${didParam ? 'update' : 'submission'} failed: ${response.data.message}`
        );
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        setErrorMessage('Please Login to access.');
      } else {
        setErrorMessage(`An error occurred during document ${didParam ? 'update' : 'submission'}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/impdocuments';
  };

  let buttonText = 'Submit Document';
  if (didParam) {
    buttonText = 'Update Document';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">ImpDocument Upload Form</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Important Documents
        </Button>
      </Stack>
      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Document */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Document"
                onChange={handleFileChange}
                error={!!(formErrors.docData || fileTypeError)}
                inputRef={docRef}
                InputLabelProps={{ shrink: true }}
                required
                helperText={formErrors.docData || fileTypeError}
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
                rows={4}
                value={formData.remark}
                onChange={handleInputChange}
                error={!!formErrors.remark}
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

export default ImpDocumentForm;
