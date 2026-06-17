import type {Currency, PriceChange} from "../models/types.ts";
import type {CurrencyDTO, PriceChangeDTO} from "../api/dto.ts";


export const CURRENCIES: Currency[] = [
    {code: 'CAD', name: 'Canadian Dollar', description: 'cad-desc', symbol: '$'},
    {code: 'PLN', name: 'Polish Zloty', description: 'pln-desc', symbol: 'zł'},
    {code: 'JPY', name: 'Japanese Yen', description: 'jpy-desc', symbol: '¥'}
];

export const CURRENCIES_DTO: CurrencyDTO[] = CURRENCIES.map(
    (currency) => ({...currency})
);

export const PRICE_CHANGE: PriceChange = {
    purchasedCurrencyCode: 'CAD',
    paymentCurrencyCode: 'PLN',
    price: 3.21,
    dateTime: '2026-06-08T10:00:00.000Z',
};

export const PRICE_CHANGE_DTO: PriceChangeDTO = {...PRICE_CHANGE}