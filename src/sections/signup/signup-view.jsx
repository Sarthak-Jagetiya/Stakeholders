import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;
const jwtExpiresIn = `${import.meta.env.VITE_JWT_EXPIRES_IN}`;

export default function SignupView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  // const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isToken =
    typeof document !== 'undefined' &&
    document.cookie.split('; ').find((row) => row.startsWith('jwt'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
  };

  const decodeJwt = (tkn) => {
    const [header, payload] = tkn.split('.').map(base64UrlDecode);
    const decodedHeader = JSON.parse(header);
    const decodedPayload = JSON.parse(payload);

    return {
      header: decodedHeader,
      payload: decodedPayload,
    };
  };

  const fetchData = async (token) => {
    try {
      const decodedToken = decodeJwt(token);
      const { id } = decodedToken.payload;
      const response = await axios.get(`http://localhost:3000/api/user/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const userData = response.data.data;

        try {
          const res = await axios.post('http://localhost:3000/api/log', {
            userID: id,
            username: userData.name,
          });
          if (res.status === 200) {
            console.log('Logged In!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClick = async () => {
    // Validation
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    // Set errors and return if any validation fails
    setErrorMessage(Object.values(errors).join(', ')); // Convert object values to a string
    if (Object.keys(errors).length > 0) {
      return;
    }

    formData.name = formData.name.trim();
    formData.email = formData.email.trim();
    formData.password = formData.password.trim();

    try {
      const response = await axios.post(`${databaseLocalUrl}/user/signup`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Cookies.set('jwt', response.data.token, {
          expires: new Date(Date.now() + jwtExpiresIn * 24 * 60 * 60 * 1000),
          sameSite: 'None',
          secure: true,
        });
        setErrorMessage('');
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          ?.split('=')[1];
        fetchData(token);
        window.location.href = '/';
        // setTimeout(() => {
        // }, 1000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setErrorMessage('User with the provided Email already exists.');
        }
      } else {
        setErrorMessage('Signup failed. Please try again.');
        console.error('Signup error:', error);
      }
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    deleteCookie('jwt');
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = '/';
    // router.push('/');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Name" value={formData.name} onChange={handleChange} />
        <TextField
          name="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          {/* Forgot password? */}
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Signup
      </LoadingButton>

      {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </>
  );

  return isToken ? (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 360,
        }}
      >
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleHome}
        >
          Home
        </LoadingButton>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'error.main', // Change 'error.main' to the desired color
            '&:hover': {
              bgcolor: 'error.dark', // Change 'error.dark' to the desired hover color
            },
            marginTop: 2,
          }}
          onClick={handleLogout}
        >
          Logout
        </LoadingButton>
      </Card>
    </Stack>
  ) : (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Signup</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleLogin}>
              Login
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
