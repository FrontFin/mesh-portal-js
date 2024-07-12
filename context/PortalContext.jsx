import React, { createContext, useState } from 'react';
import Portal from '@portal-hq/web';
import PropTypes from 'prop-types';

const defaultState = {};

export const PortalContext = createContext(defaultState);

const PortalProvider = ({ children }) => {
  const [portalInstance, setPortalInstance] = useState(null);
  const [portalError, setPortalError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isPortalReady, setIsPortalReady] = useState(false);
  const [chain, setChain] = useState('11155111');
  const [walletStatus, setWalletStatus] = useState('Loading...');

  const initiatePortalInstance = (chainId) => {
    if (typeof window !== 'undefined') {
      const portalAPIKey = process.env.NEXT_PUBLIC_PORTAL_API_KEY;
      const rpcConfig = {
        'eip155:1': process.env.NEXT_PUBLIC_MAINNET_GATEWAY_URL,
        'eip155:11155111': process.env.NEXT_PUBLIC_SEPOLIA_GATEWAY_URL,
      };

      const rpcUrl = rpcConfig[`eip155:${chainId}`];
      if (!rpcUrl) {
        console.error(`No RPC URL configured for chainId eip155:${chainId}`);
        return;
      }

      const portal = new Portal({
        apiKey: portalAPIKey,
        autoApprove: true,
        rpcConfig: {
          [`eip155:${chainId}`]: rpcUrl,
        },
      });

      console.log('Setting portal instance', portal);
      setPortalInstance(portal);

      portal.onReady(async () => {
        try {
          if (!portal.address) {
            setWalletStatus('Creating your wallet. Hang tight ;) ');
            await portal.createWallet();
            setIsPortalReady(true);
          }

          console.log('Portal is ready, calling onReady callback');
          setWalletAddress(portal.address);
          console.log(portal.address, walletAddress);
          setChain(chainId);
          setIsPortalReady(true);
        } catch (error) {
          console.error('Error during Portal onReady execution:', error);
          setPortalError(error);
        }
      });
    }
  };

  const state = {
    portalInstance,
    isPortalReady,
    portalError,
    walletAddress,
    initiatePortalInstance,
    chain,
    walletStatus,
  };

  return (
    <PortalContext.Provider value={state}>{children}</PortalContext.Provider>
  );
};

PortalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PortalProvider;
