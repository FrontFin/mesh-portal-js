import React, { useState, useContext, useEffect } from 'react';
import { PortalContext } from '../context/PortalContext';
import { useRouter } from 'next/router';

import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { buildTransaction } from '../utils/portalUtils';

const SendModal = ({ open, onClose, authData, setOpenSendModal }) => {
  const { portalInstance } = useContext(PortalContext);

  const [amount, setAmount] = useState('1');
  const [recipient, setRecipient] = useState('loading...');
  const [signing, setSigning] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');

  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const symbol = process.env.NEXT_PUBLIC_SYMBOL;

  const router = useRouter();

  useEffect(() => {
    const getDepositDetails = async () => {
      const payload = {
        authToken: authData?.accessToken?.accountTokens[0]?.accessToken,
        type: authData?.accessToken?.brokerType,
        symbol,
        chain,
      };
      try {
        const fetchAddress = await fetch('/api/transfers/deposits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const response = await fetchAddress.json();

        setRecipient(response.content.address);
      } catch (err) {
        console.log('fetch address error', err);
        localStorage.removeItem('authData');
        setOpenSendModal(false);
        alert('your connected account token expired');
        router.reload();
      }
    };
    getDepositDetails();
  }, []);

  const handleSend = async () => {
    setSigning(true);
    const address = portalInstance.address;
    const transaction = await buildTransaction(recipient, amount, address);

    try {
      const signature = await portalInstance.ethSendTransaction(transaction);
      if (signature.error) {
        setTransactionMessage('Transaction Error: ' + signature.error.message);
      } else if (signature.requestError) {
        console.error('Request Error:', signature.requestError.message);
        setTransactionMessage(
          'Request Error: ' + signature.requestError.message
        );
      } else {
        setTransactionMessage('Transaction successful!');
      }
    } catch (error) {
      console.error('Transaction error:', error);

      if (error.requestError) {
        setTransactionMessage(
          'Transaction failed: ' + error.requestError.message
        );
      } else {
        setTransactionMessage('Transaction failed: An unknown error occurred');
      }
    }

    setSigning(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send Funds</DialogTitle>
      <DialogContent>
        {signing ? (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
            <p>Signing your transaction...</p>
          </div>
        ) : (
          <>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              label="Recipient Address"
              fullWidth
              margin="normal"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            {transactionMessage && <p>{transactionMessage}</p>}
          </>
        )}
      </DialogContent>
      {!signing && (
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

SendModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  onExit: PropTypes.func,
  authData: PropTypes.object,
  setOpenSendModal: PropTypes.func,
};

export default SendModal;
