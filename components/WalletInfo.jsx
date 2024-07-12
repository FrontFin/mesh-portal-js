import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import TransactionsDashboard from './Transactions';
import { PortalContext } from '../context/PortalContext';
import MeshModal from './MeshModal';
import {
  handleOpenMeshModal,
  handleExit,
  handleMeshSuccess,
  handleTransferFinished,
} from '../utils/meshUtils';
import SendModal from './SendModal';
import PropTypes from 'prop-types';

function WalletBalanceCard({ setAuthData, authData }) {
  const { portalInstance, walletAddress, isPortalReady, chain } =
    useContext(PortalContext);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [catalogLink, setCatalogLink] = useState(null);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  useEffect(() => {
    if (portalInstance) {
      const fetchWalletBalance = async () => {
        console.log('fetchWalletBalance called');
        try {
          const response = await portalInstance.provider.request({
            method: 'eth_getBalance',
            params: [portalInstance.address, 'latest'],
            chainId: `eip155:${chain}`, // Make sure chain is formatted correctly
          });

          const weiBalance = BigInt(response);
          const precision = 1000n;
          const weiToEth = 1000000000000000000n;
          const ethValue = (weiBalance * precision) / weiToEth;

          const ethValueString = ethValue.toString();
          const decimalPosition = ethValueString.length - 3;
          const formattedEthValue =
            ethValueString.slice(0, decimalPosition) +
            '.' +
            ethValueString.slice(decimalPosition);

          setWalletBalance(formattedEthValue);
        } catch (err) {
          console.log('Error fetching wallet balance:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      if (isPortalReady && portalInstance.address) {
        fetchWalletBalance();
      } else {
        console.log('isPortalReady or address not available');
      }
    } else {
      console.log('portalInstance not available');
    }
  }, [portalInstance, portalInstance.address, authData, chain]);

  if (loading) {
    return <Typography>Loading wallet balance...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  const cardStyle = {
    backgroundColor: '#9e9796',
    color: '#171616',
    border: '2px solid #2d3748',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  };

  const buttonStyle = {
    marginTop: '20px',
    backgroundColor: '#F6B94C',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  };

  const fieldStyle = {
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const withdraw = async () => {
    setOpenSendModal(true);
  };

  const handleSendExit = () => {
    setOpenSendModal(false);
  };

  const handleSuccess = async (newAuthData) => {
    await setAuthData(newAuthData);
    handleMeshSuccess(newAuthData);
  };

  return (
    <div>
      <Card style={cardStyle}>
        <CardContent style={{ border: '2px solid #2d3748' }}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              ...fieldStyle,
            }}
          >
            <Typography variant="h6">Wallet Address:</Typography>
            <Typography variant="h6">{walletAddress}</Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              ...fieldStyle,
            }}
          >
            <Typography variant="h6">Wallet Balance:</Typography>
            <Typography variant="h6">
              {walletBalance ? walletBalance : 'No balance data available'}
            </Typography>
          </Box>
          {authData ? (
            <Box display="flex" justifyContent="flex-end">
              <Button
                style={buttonStyle}
                variant="contained"
                color="secondary"
                onClick={() =>
                  handleOpenMeshModal(
                    setCatalogLink,
                    setOpenMeshModal,
                    authData,
                    setAuthModal,
                    'transfer',
                    portalInstance.address
                  )
                }
              >
                Deposit
              </Button>

              <Button
                style={{ ...buttonStyle, marginLeft: '10px' }}
                variant="contained"
                color="secondary"
                onClick={withdraw}
              >
                Withdraw
              </Button>
            </Box>
          ) : (
            <Box display="flex" justifyContent="flex-end">
              <Button
                style={{ ...buttonStyle, marginLeft: '10px' }}
                variant="contained"
                color="secondary"
                onClick={() =>
                  handleOpenMeshModal(
                    setCatalogLink,
                    setOpenMeshModal,
                    authData,
                    setAuthModal
                  )
                }
              >
                Connect Account
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <TransactionsDashboard />
      {openMeshModal && (
        <MeshModal
          open="true"
          onClose={() => setOpenMeshModal(false)}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
          transferFinished={handleTransferFinished}
          authData={authData}
        />
      )}
      {openSendModal && (
        <SendModal
          open={openSendModal}
          onClose={() => setOpenSendModal(false)}
          authData={authData}
          //onSuccess={handleSuccess}
          onExit={handleSendExit}
          //transferFinished={handleTransferFinished}
          setOpenSendModal={setOpenSendModal}
        />
      )}
    </div>
  );
}

WalletBalanceCard.propTypes = {
  setAuthData: PropTypes.func,
  authData: PropTypes.object,
};
export default WalletBalanceCard;
