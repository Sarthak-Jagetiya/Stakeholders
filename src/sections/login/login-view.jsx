import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { MuiOtpInput } from 'mui-one-time-password-input';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const [successMessage, setSuccessMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const [errorMessage, setErrorMessage] = useState('');
  const [jwt, setJwt] = useState('');
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

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/otp/send', {
        email: formData.email,
      });
      console.log(response.data.message);
      if (response.data.status === 'success') {
        enqueueSnackbar('OTP sent successfully', { variant: 'success' });
        setOpen(true);
      } else {
        enqueueSnackbar(response.data.message, { variant: 'error' });
      }
      // enqueueSnackbar('OTP sent successfully', { variant: 'success' });
      // setOpen(true);
    } catch (error) {
      enqueueSnackbar('Failed to send OTP', { variant: 'error' });
      console.error(error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/otp/verify', { otp });
      console.log(response.data.message);
      console.log(response.status);
      if (response.status === 200) {
        setOpen(false);
        Cookies.set('jwt', jwt, {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          sameSite: 'None',
          secure: true,
        });
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('jwt'))
          ?.split('=')[1];
        fetchData(token);
        window.location.href = '/';
      }

      if (response.status === 204) {
        enqueueSnackbar('OTP expired. Please try again.', { variant: 'error' });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar('Invalid OTP. Please try again.', { variant: 'error' });
        setErrorMessage('Invalid OTP. Please try again.');
      } else {
        enqueueSnackbar('Failed to verify OTP', { variant: 'error' });
      }
      console.error(error);
    }
  };

  const handleClick = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // console.log(response.data.token);
        // Cookies.set('jwt', response.data.token);
        // Cookies.set('jwt', response.data.token, {
        //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        //   sameSite: 'None',
        //   secure: true,
        // });
        setJwt(response.data.token);
        enqueueSnackbar('Logged in successfully', { variant: 'success' });
        setErrorMessage('');
        // setTimeout(() => {
        //   router.back();
        // }, 1000);
        setOpen(true);
        handleSendOTP();
      } else {
        enqueueSnackbar('Invalid email or password. Please try again.', { variant: 'error' });
      }
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleGetStarted = () => {
    router.push('/signup');
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
  };

  const body = (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Enter OTP
      </Typography>
      <MuiOtpInput
        style={{ marginTop: '1rem' }}
        value={otp}
        length={6}
        onChange={(value) => setOtp(value)}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          marginTop: '2rem',
        }}
      >
        <LoadingButton
          size="medium"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleVerifyOTP}
        >
          Verify OTP
        </LoadingButton>
        <Button variant="text" onClick={handleSendOTP}>
          Resend OTP
        </Button>
      </Box>
    </Box>
    // <div>
    //   <h2>Enter OTP</h2>
    //   <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
    //   <button type="button" onClick={handleVerifyOTP}>Verify OTP</button>
    // </div>
  );

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
      <Modal open={open} onClose={() => setOpen(false)}>
        {body}
      </Modal>
    </Box>
  );
}
