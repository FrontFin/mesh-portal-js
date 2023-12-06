import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { PortalContext } from '../context/PortalContext';
import WalletBalanceCard from '../components/WalletInfo';
import Header from '../components/Header';

export default function ParentComponent() {
  const { isPortalReady, portalError, walletStatus } =
    useContext(PortalContext);
  const [authData, setAuthData] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedAuthData = localStorage.getItem('authData');
      return storedAuthData ? JSON.parse(storedAuthData) : null;
    }
    return null;
  });

  useEffect(() => {
    console.log('authData has been updated:', authData);
  }, [authData]);

  if (portalError) {
    return (
      <Typography color="error" align="center">
        Portal Error: {portalError.message}
      </Typography>
    );
  }

  if (!isPortalReady) {
    return (
      <>
        <Header />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <CircularProgress color="primary" />
          <Typography variant="h6" style={{ marginTop: 20 }}>
            {walletStatus}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <div>
      {isPortalReady && (
        <>
          <Header />
          <WalletBalanceCard setAuthData={setAuthData} authData={authData} />
          {authData && <p>Connected Broker</p>}
        </>
      )}
    </div>
  );
}
