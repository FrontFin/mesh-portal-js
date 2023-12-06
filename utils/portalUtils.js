export const signPortalTransaction = async (amount, recipient) => {
  console.log('Sending', amount, 'to', recipient);
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

export const buildTransaction = async (recipient, amount, from) => {
  const usdcSmallestUnitAmount = amount * 1e6; // Convert to USDC's smallest unit
  console.log(usdcSmallestUnitAmount, amount);
  console.log(from);
  const transaction = {
    to: recipient, // {string} The recipient address.
    from,
    value: '0x2386f26fc10000', // {?string} The value to be sent in Wei.
    data: '',
  };

  return transaction;
};
