import { useState } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

const COUNTRIES = [
  {
    value: 'hi',
    label: 'India',
    icon: '/assets/icons/ic_flag_hi.svg',
  },
  // {
  //   value: 'en',
  //   label: 'US',
  //   icon: '/assets/icons/ic_flag_en.svg',
  // },
  // {
  //   value: 'de',
  //   label: 'Germany',
  //   icon: '/assets/icons/ic_flag_de.svg',
  // },
  // {
  //   value: 'fr',
  //   label: 'France',
  //   icon: '/assets/icons/ic_flag_fr.svg',
  // },
];

export default function CountryPopover() {
  const [open, setOpen] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Initial selected country

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src={selectedCountry.icon} alt={selectedCountry.label} />
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
            width: 180,
          },
        }}
      >
        {COUNTRIES.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedCountry.value}
            onClick={() => handleCountrySelect(option)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
