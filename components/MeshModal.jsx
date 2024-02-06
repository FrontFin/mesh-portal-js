import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';

import { createLink } from '@meshconnect/web-link-sdk';

const MeshModal = ({
  open,
  onClose,
  link,
  onSuccess,
  onExit,
  transferFinished,
  pageLoaded,
  authData,
}) => {
  const [linkConnection, setLinkConnection] = useState(null);
  const CLIENT_ID = process.env.NEXT_PUBLIC_PORTAL_CLIENT_KEY;

  useEffect(() => {
    const connectionOptions = {
      clientId: CLIENT_ID,
      onIntegrationConnected: (authData) => {
        console.info('Mesh SUCCESS', authData);
        onSuccess(authData);
      },
      onEvent: (event) => {
        console.info('Mesh EVENT', event);
      },
      onExit: (error) => {
        if (error) {
          console.error(`[Mesh ERROR] ${error}`);
        }
        if (onExit) {
          console.info('Mesh EXIT');
          onExit();
        }
      },
      onTransferFinished: (transfer) => {
        console.info('TRANSFER FINISHED', transfer);
        transferFinished(transfer);
      },
    };

    if (
      authData &&
      authData.accessToken &&
      authData.accessToken.accountTokens &&
      authData.accessToken.accountTokens.length > 0
    ) {
      connectionOptions.accessTokens = [
        {
          accountId: authData.accessToken.accountTokens[0].account.accountId,
          accountName:
            authData.accessToken.accountTokens[0].account.accountName,
          accessToken: authData.accessToken.accountTokens[0].accessToken,
          brokerType: authData.accessToken.brokerType,
          brokerName: authData.accessToken.brokerName,
        },
      ];
    }
    setLinkConnection(createLink(connectionOptions));
  }, []);

  useEffect(() => {
    if (open && linkConnection) {
      linkConnection.openLink(link);
    }

    return () => {
      if (linkConnection) {
        linkConnection.closeLink();
      }
    };
  }, [linkConnection, open, link, pageLoaded]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth></Dialog>
  );
};

MeshModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onExit: PropTypes.func,
  transferFinished: PropTypes.func,
  setPageLoaded: PropTypes.func,
  pageLoaded: PropTypes.bool.isRequired,
  authData: PropTypes.object,
};

export default MeshModal;
