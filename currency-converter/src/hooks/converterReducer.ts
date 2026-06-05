import type { Currency, PriceChange } from '../models/types.ts';

export type ConverterState = {
  isLoading: boolean;
  currencies: Currency[];
  priceChange: PriceChange | null;
  error: string | null;
  fromCode: string;
  toCode: string;
  amount: number;
};

export type ConverterAction =
  | { type: 'FETCH_START' }
  | { type: 'CURRENCIES_LOADED'; payload: Currency[] }
  | { type: 'PRICE_LOADED'; payload: PriceChange | null }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FROM'; payload: string }
  | { type: 'SET_TO'; payload: string }
  | { type: 'SET_AMOUNT'; payload: number }
  | { type: 'SWAP' };

export const initialConverterState: ConverterState = {
  isLoading: false,
  currencies: [],
  priceChange: null,
  error: null,
  fromCode: '',
  toCode: '',
  amount: 1
};

const firstDifferentCode = (
  currencies: Currency[],
  code: string
): string => currencies.find((currency) => currency.code !== code)?.code ?? code;

export const converterReducer = (
  state: ConverterState,
  action: ConverterAction
): ConverterState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'CURRENCIES_LOADED': {
      const currencies = action.payload;
      const fromCode = state.fromCode
        || currencies[0]?.code
        || '';
      const toCode = state.toCode
        || currencies.find((currency) => currency.code !== fromCode)?.code
        || '';

      return {
        ...state,
        currencies,
        fromCode,
        toCode,
        isLoading: false,
        error: null
      };
    }

    case 'PRICE_LOADED':
      return {
        ...state,
        priceChange: action.payload,
        isLoading: false,
        error: null
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'SET_FROM': {
      const fromCode = action.payload;
      const toCode =
        fromCode === state.toCode
          ? firstDifferentCode(state.currencies, fromCode)
          : state.toCode;
      return {
        ...state,
        fromCode,
        toCode
      };
    }

    case 'SET_TO': {
      const toCode = action.payload;
      const fromCode =
        toCode === state.fromCode
          ? firstDifferentCode(state.currencies, toCode)
          : state.fromCode;
      return {
        ...state,
        fromCode,
        toCode
      };
    }

    case 'SET_AMOUNT':
      return {
        ...state,
        amount: action.payload
      };

    case 'SWAP':
      return {
        ...state,
        fromCode: state.toCode,
        toCode: state.fromCode
      };

    default:
      return state;
  }
};