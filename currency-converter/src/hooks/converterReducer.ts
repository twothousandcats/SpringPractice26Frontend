import type {Currency, PriceChange} from '../models/types.ts';

export type ConverterState = {
    isLoading: boolean;
    initialized: boolean;
    currencies: Currency[];
    priceChange: PriceChange | null;
    initError: string | null;
    runtimeError: string | null;
    fromCode: string;
    toCode: string;
    amount: number;
};

export type ConverterAction =
    | { type: 'CURRENCIES_FETCH_START' }
    | { type: 'CURRENCIES_LOADED'; payload: Currency[] }
    | { type: 'CURRENCIES_ERROR'; payload: string }
    | { type: 'PRICE_FETCH_START' }
    | { type: 'PRICE_LOADED'; payload: PriceChange | null }
    | { type: 'PRICE_ERROR'; payload: string }
    | { type: 'RUNTIME_ERROR_DISMISS' }
    | { type: 'SET_FROM'; payload: string }
    | { type: 'SET_TO'; payload: string }
    | { type: 'SET_AMOUNT'; payload: number }
    | { type: 'SWAP' };

export const initialConverterState: ConverterState = {
    isLoading: false,
    initialized: false,
    currencies: [],
    priceChange: null,
    initError: null,
    runtimeError: null,
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
        case 'CURRENCIES_FETCH_START':
            return {
                ...state,
                isLoading: true,
                initError: null
            };

        case 'CURRENCIES_LOADED': {
            const currencies = action.payload;
            const fromCode = state.fromCode || currencies[0]?.code || '';
            const toCode =
                state.toCode ||
                currencies.find((currency) => currency.code !== fromCode)?.code ||
                '';
            return {
                ...state,
                currencies,
                fromCode,
                toCode,
                isLoading: false,
                initialized: true,
                initError: null
            };
        }

        case 'CURRENCIES_ERROR':
            return {
                ...state,
                isLoading: false,
                initError: action.payload
            };

        case 'PRICE_FETCH_START':
            return {
                ...state,
                isLoading: true
            };

        case 'PRICE_LOADED':
            return {
                ...state,
                priceChange: action.payload,
                isLoading: false,
                runtimeError: null
            };

        case 'PRICE_ERROR':
            return {
                ...state,
                isLoading: false,
                runtimeError: action.payload
            };

        case 'RUNTIME_ERROR_DISMISS':
            return {
                ...state,
                runtimeError: null
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