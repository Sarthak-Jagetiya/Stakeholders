import axios from 'axios';
// import jwt from 'jsonwebtoken';
import { useState } from 'react';
// import { jwt } from 'jsonwebtoken';

import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
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
// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // console.log(response.data.token);
        // Cookies.set('jwt', response.data.token);
        Cookies.set('jwt', response.data.token, { sameSite: 'None', secure: true });
        setErrorMessage('');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
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
        Login
      </LoadingButton>

      {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </>
  );

  return (
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
          <Typography variant="h4">Login</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleGetStarted}>
              Get started
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
