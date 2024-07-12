import React, { useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Select, MenuItem } from '@mui/material';
import { PortalContext } from '../context/PortalContext';

function Header() {
  const { initiatePortalInstance, chain, isPortalReady } =
    useContext(PortalContext);

  useEffect(() => {
    if (!isPortalReady) {
      initiatePortalInstance(chain); // Use the initial chain state
    }
  }, [isPortalReady]);

  const handleChange = (event) => {
    console.log(event.target.value);
    initiatePortalInstance(event.target.value);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Portal-Mesh-Explorer
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <Select
            value={chain}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            style={{ color: '#fff' }}
          >
            <MenuItem value={1}>Mainnet</MenuItem>
            <MenuItem value={11155111}>Sepolia Testnet</MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
