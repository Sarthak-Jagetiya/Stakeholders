import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export default function AccountPopover({
  name = '',
  email = '',
  avatar = '/assets/images/avatars/avatar_1.jpg',
}) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // // Get cookie by name
  // const getCookie = (nameOfCookie) => {
  //   const cookieString = document.cookie;
  //   const cookies = cookieString.split(';');

  //   const foundCookie = cookies.find((cookie) => {
  //     const [cookieName] = cookie.trim().split('=');
  //     return cookieName === nameOfCookie;
  //   });

  //   return foundCookie ? decodeURIComponent(foundCookie.trim().split('=')[1]) : null;
  // };

  // // Usage
  // const jwtCookie = getCookie('jwt');

  // if (jwtCookie) {
  //   console.log('JWT Token:', jwtCookie);
  // } else {
  //   console.log('JWT Token not found');
  // }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 44,
          height: 44,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: 40,
            height: 40,
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClose}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          {/* {name === '' ? 'Login' : 'Logout'} */}
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}

AccountPopover.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};
