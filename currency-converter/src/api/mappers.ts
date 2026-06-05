import type { CurrencyDTO, PriceChangeDTO } from './dto.ts';
import type { Currency, PriceChange } from '../models/types.ts';

export const mapCurrencyDtoToCurrency = (dto: CurrencyDTO): Currency => ({
  code: dto.code,
  name: dto.name,
  description: dto.description,
  symbol: dto.symbol
});

export const mapPriceChangeDtoToPriceChange = (dto: PriceChangeDTO): PriceChange => ({
  purchasedCurrencyCode: dto.purchasedCurrencyCode,
  paymentCurrencyCode: dto.paymentCurrencyCode,
  price: dto.price,
  dateTime: dto.dataTime
});