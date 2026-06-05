export type CurrencyDTO = {
  code: string;
  name: string;
  description: string;
  symbol: string;
}

export type PriceChangeDTO = {
  purchasedCurrencyCode: string;
  paymentCurrencyCode: string;
  price: number;
  dataTime: string;
}