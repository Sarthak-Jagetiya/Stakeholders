import axios from 'axios';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

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

export default function TaskForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tid = searchParams.get('tid');
  const [fileTypeError, setFileTypeError] = useState('');

  const statusOptions = ['Pending', 'Completed', 'In Progress'];
  const initialFormData = {
    task_name: '',
    due_date: '',
    reminder_before: '',
    eid: '',
    status: '',
    remarks: '',
    doc: '',
  };
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  const docRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          .split('=')[1];
        const response = await axios.get(`http://localhost:3000/api/task/${tid}`, {
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

    if (tid) {
      fetchData();
    }
  }, [tid]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Check if the file size is below 1MB
    if (file.size > 1024 * 1024) {
      setFileTypeError('File size exceeds 1MB. Please choose a smaller file.');
      setFormData((prevData) => ({
        ...prevData,
        doc: null,
      }));
      return;
    }

    reader.onloadend = () => {
      // Check if the file type is PDF
      if (file.type !== 'application/pdf') {
        setFileTypeError('Only PDF files are allowed.');
        setFormData((prevData) => ({
          ...prevData,
          doc: null,
        }));
      } else {
        setFileTypeError('');
        setFormData((prevData) => ({
          ...prevData,
          doc: reader.result.split(',')[1],
        }));
      }
    };

    reader.readAsDataURL(file);
  };

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
      if (!formData[key] && key !== 'doc') {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
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
      const apiEndpoint = tid
        ? `http://localhost:3000/api/task/${tid}`
        : 'http://localhost:3000/api/task';

      const response = await axios[tid ? 'patch' : 'post'](apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setErrorMessage('');
        setSuccessMessage(`Task details ${tid ? 'updated' : 'submitted'} successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          if (tid) window.location.href = '/tasks';
          else setFormData(initialFormData);
        }, 500);
      } else {
        setErrorMessage(`Task ${tid ? 'update' : 'submission'} failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 399) {
        setErrorMessage('Employee with the provided EID does not exist.');
      } else if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        setErrorMessage('Please Login to access.');
      } else {
        setErrorMessage(`An error occurred during task ${tid ? 'update' : 'submission'}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocumentClick = () => {
    window.location.href = '/tasks';
  };

  let buttonText = 'Submit Task';
  if (tid) {
    buttonText = 'Update Task';
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Task</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Icon icon="tabler:table-filled" />}
          onClick={handleNewDocumentClick}
        >
          All Tasks
        </Button>
      </Stack>

      <Paper
        elevation={3}
        style={{ padding: '60px 40px', borderRadius: '20px', marginTop: '20px' }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Task Name */}
            <Grid item xs={6}>
              <TextField
                name="task_name"
                label="Task Name"
                variant="outlined"
                fullWidth
                value={formData.task_name}
                onChange={handleChange}
                error={!!formErrors.task_name}
                helperText={formErrors.task_name}
                required
              />
            </Grid>

            {/* Due Date */}
            <Grid item xs={6}>
              <TextField
                name="due_date"
                label="Due Date"
                variant="outlined"
                fullWidth
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                error={!!formErrors.due_date}
                helperText={formErrors.due_date}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            {/* Reminder Before */}
            <Grid item xs={6}>
              <TextField
                name="reminder_before"
                label="Reminder Before (in days)"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.reminder_before}
                onChange={handleChange}
                error={!!formErrors.reminder_before}
                helperText={formErrors.reminder_before}
                required
                InputProps={{
                  inputProps: { min: 1 }, // Set a minimum value for days
                }}
              />
            </Grid>

            {/* Employee ID */}
            <Grid item xs={6}>
              <TextField
                name="eid"
                label="Employee ID"
                variant="outlined"
                fullWidth
                value={formData.eid}
                onChange={handleChange}
                error={!!formErrors.eid}
                helperText={formErrors.eid}
                required
              />
            </Grid>

            {/* Status */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  error={!!formErrors.status}
                  helperText={formErrors.status}
                  required
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Remarks */}
            <Grid item xs={6}>
              <TextField
                name="remarks"
                label="Remarks"
                variant="outlined"
                fullWidth
                type="text"
                value={formData.remarks}
                onChange={handleChange}
                error={!!formErrors.remarks}
                helperText={formErrors.remarks}
                required
              />
            </Grid>

            {/* Document */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                label="Document"
                onChange={handleFileChange}
                error={!!(formErrors.doc || fileTypeError)}
                inputRef={docRef}
                InputLabelProps={{ shrink: true }}
                helperText={formErrors.doc || fileTypeError}
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
