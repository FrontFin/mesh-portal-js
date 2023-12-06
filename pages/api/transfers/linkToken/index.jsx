import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const {
    MESH_API_KEY,
    MESH_API_URL,
    MESH_CLIENT_ID,
    NEXT_PUBLIC_MESH_NETWORK_ADDRESS,
    NEXT_PUBLIC_PORTAL_CLIENT_KEY,
    NEXT_PUBLIC_SYMBOL,
  } = process.env;
  const { authModal, address } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const bodyObject = {
    UserId: NEXT_PUBLIC_PORTAL_CLIENT_KEY,
  };

  if (authModal === 'false' || authModal === undefined) {
    bodyObject.transferOptions = {
      toAddresses: [
        {
          symbol: NEXT_PUBLIC_SYMBOL, //symbol for token xfer (i.e, ETH)
          address: address, //portal Address
          networkId: NEXT_PUBLIC_MESH_NETWORK_ADDRESS, // eth mesh UUID
        },
      ],
    };
  }

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': MESH_CLIENT_ID,
      'X-Client-Secret': MESH_API_KEY,
    },
  });

  try {
    const getCatalogLink =
      await api.managedAccountAuthentication.v1LinktokenCreate(bodyObject);

    if (getCatalogLink.status !== 200) {
      const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${getCatalogLink.message}`;
      throw new Error(errorMessage.displayMessage);
    }
    return res.status(200).json(getCatalogLink.data);
  } catch (error) {
    res.status(500).json({
      error: `Something went wrong: ${error.message}`,
    });
  }
}
