const userId = process.env.NEXT_PUBLIC_PORTAL_CLIENT_KEY;

export const getUserId = (brokerType) => {
  switch (brokerType) {
    case 'coinbase':
      return `coin${userId}`;
    case 'deFiWallet':
      return `defi${userId}`;
    case 'binanceInternationalDirect':
      return `binanceInt${userId}`;

    case 'robinhood':
      return `robin${userId}`;
    case 'binance':
      return `binance${userId}`;
    case 'alpaca':
      return `alpaca${userId}`;
    default:
      return '000000007';
  }
};
