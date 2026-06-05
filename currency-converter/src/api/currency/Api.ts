import type { CurrencyDTO, PriceChangeDTO } from '../dto.ts';
import type { Currency, PriceChange } from '../../models/types.ts';
import { mapCurrencyDtoToCurrency, mapPriceChangeDtoToPriceChange } from '../mappers.ts';
import { ENV_CONFIG } from '../../utils/config.ts';

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

export const fetchCurrencies = async (): Promise<Currency[]> => {
  const dto = await request<CurrencyDTO[]>(`${ENV_CONFIG.api.baseUrl}/Currency`);
  return dto.map(mapCurrencyDtoToCurrency);
};

export type FetchPriceChangesParams = {
  purchasedCurrency: string;
  paymentCurrency: string;
  fromDataTime?: string;
  toDataTime?: string;
};

const DEFAULT_HISTORY_MS = 60 * 60 * 1000;
export const fetchPriceChange = async (
  params: FetchPriceChangesParams
): Promise<PriceChange[]> => {
  const fromDataTime = params.fromDataTime ?? new Date(Date.now() - DEFAULT_HISTORY_MS).toISOString();

  const query = new URLSearchParams({
    paymentCurrency: params.paymentCurrency,
    purchasedCurrency: params.purchasedCurrency,
    fromDataTime
  });
  if (params.toDataTime) {
    query.set('toDataTime', params.toDataTime);
  }

  const dto = await request<PriceChangeDTO[]>(
    `${ENV_CONFIG.api.baseUrl}/prices?${query.toString()}`
  );

  return dto.map(mapPriceChangeDtoToPriceChange);
};