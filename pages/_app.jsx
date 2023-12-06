import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import PortalProvider from '../context/PortalContext';
import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <PortalProvider>
        <Component {...pageProps} />
      </PortalProvider>
    </ThemeProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

export default MyApp;
