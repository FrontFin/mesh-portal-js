export const handleOpenMeshModal = async (
  setCatalogLink,
  setOpenMeshModal,
  authData,
  setAuthModal,
  type = 'authorization',
  address
) => {
  let url = `/api/transfers/linkToken?authModal=false&address=${address}`;

  if (!authData && type === 'authorization') {
    setAuthModal(true);
    url = '/api/transfers/linkToken?authModal=true';
  }
  try {
    const link = await fetch(url);

    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.linkToken);
      setOpenMeshModal(true);
    }
  } catch (error) {
    console.log('Error from Mesh:', error);
    return `Something went wrong: ${error.message}`;
  }
};

export const handleExit = (error) => {
  console.log('Broker connection closed:', error);
};

export const handleMeshSuccess = (newAuthData) => {
  console.log('success', newAuthData);
  localStorage.setItem('authData', JSON.stringify(newAuthData));
};

export const handleTransferFinished = (handleTransferFinished) => {
  console.log(handleTransferFinished);
};
