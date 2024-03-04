import axios from 'axios';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Check if document and document.cookie are defined
  const isToken =
    (typeof document !== 'undefined' &&
      document.cookie.split('; ').find((row) => row.startsWith('jwt'))) ||
    localStorage.getItem('jwt');

  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.removeItem(cookieName);
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    deleteCookie('jwt');
    window.location.reload();
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
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

      // const token = document.cookie
      //   .split('; ')
      //   .find((row) => row.startsWith('jwt'))
      //   ?.split('=')[1];
      const token = localStorage.getItem('jwt');

      const fetchData = async () => {
        try {
          const decodedToken = decodeJwt(token);
          const { id } = decodedToken.payload;
          const response = await axios.get(`http://localhost:3000/api/user/${id}`, {
            withCredentials: true,
          });

          if (response.status === 200) {
            const userData = response.data.data;
            setName(userData.name);
            setEmail(userData.email);
            setPhotoURL(`/assets/images/avatars/avatar_${userData.id % 25}.jpg`);
          }
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message.includes('Cannot read properties of undefined')
          ) {
            console.error('Please Login to Access.');
          } else {
            console.error('Error fetching user data:', error);
          }
        }
      };

      fetchData();
    }
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={photoURL}
          alt={name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        {isToken ? <Divider sx={{ borderStyle: 'dashed', m: 0 }} /> : ''}

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={() => {
            handleClose();
            if (isToken) {
              handleLogout();
            } else {
              handleLogin();
            }
          }}
          sx={{
            typography: 'body2',
            color: isToken ? 'error.main' : 'primary.main',
            py: 1.5,
          }}
        >
          {isToken ? 'Logout' : 'Login'}
        </MenuItem>
      </Popover>
    </>
  );
}
