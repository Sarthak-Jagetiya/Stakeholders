import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------
const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

export default function Nav({ openNav, onCloseNav }) {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  // const [role, setRole] = useState('');
  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [currentDateTime]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // const deleteCookie = (cookieName) => {
  //   document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  // };

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

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt'))
        ?.split('=')[1];

      const fetchData = async () => {
        try {
          const decodedToken = decodeJwt(token);
          const { id } = decodedToken.payload;
          const response = await axios.get(`${databaseLocalUrl}/user/${id}`, {
            withCredentials: true,
          });

          if (response.status === 200) {
            const userData = response.data.data;
            setName(userData.name);
            setPhotoURL(`/assets/images/avatars/avatar_${userData.id % 25}.jpg`);
            // setRole('Admin');
            setFormattedDate(
              currentDateTime.toLocaleDateString(undefined, {
                weekday: 'long',
                // year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            );
            setFormattedTime(
              currentDateTime.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true, // Use 12-hour format
              })
            );
          }
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message.includes('Cannot read properties of undefined')
          ) {
            console.error('Please Login to Access.');
          }
          // else if (error.config.timeout === 0) {
          //   console.error('Too many requests from this IP. Please try again in an hour!');
          //   // Delete 'jwt' cookie
          //   document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          //   window.location.reload();
          // }
          else {
            console.error('Error fetching user data:', error);
          }
        }
      };

      fetchData();
    }
  }, [setFormattedDate, setFormattedTime, currentDateTime]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 1,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{name}</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {role}
        </Typography> */}
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formattedDate}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
