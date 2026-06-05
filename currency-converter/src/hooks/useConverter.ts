import { useEffect, useReducer } from 'react';
import { converterReducer, initialConverterState } from './converterReducer.ts';
import { fetchCurrencies, fetchPriceChange } from '../api/currency/Api.ts';
import { useDebouncedValue } from './useDebouncedValue.ts';

const toMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : 'Unknown error';

export const useConverter = () => {
  const [state, dispatch] = useReducer(converterReducer, initialConverterState);
  const {
    isLoading,
    currencies,
    priceChange,
    error,
    fromCode,
    toCode,
    amount
  } = state;

  // get /Currency - init
  useEffect(() => {
    let cancelled = false;
    dispatch({
      type: 'FETCH_START'
    });

    fetchCurrencies()
      .then((data) => {
        if (!cancelled) {
          dispatch({ type: 'CURRENCIES_LOADED', payload: data });
        }
      })
      .catch((e) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: toMessage(e) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestKey = useDebouncedValue(`${fromCode}|${toCode}|${amount}`, 300);

  useEffect(() => {
    const [from, to] = requestKey.split('|');
    if (!from || !to) {
      return;
    }

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    fetchPriceChange({ purchasedCurrency: from, paymentCurrency: to })
      .then((changes) => {
        if (!cancelled) {
          const latest = changes.length > 0
            ? changes[changes.length - 1]
            : null;
          dispatch({ type: 'PRICE_LOADED', payload: latest });
        }
      })
      .catch((e) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: toMessage(e) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const fromCurrency = currencies.find(currency => currency.code === fromCode);
  const toCurrency = currencies.find(currency => currency.code === toCode);
  const rate = priceChange?.price ?? 0;
  const conversionResult = amount * rate;
  const dateTime = priceChange?.dateTime ?? '';

  return {
    currencies,
    fromCode,
    toCode,
    amount,
    rate,
    conversionResult,
    fromCurrency,
    toCurrency,
    dateTime,
    // states
    isLoading,
    error,
    hasData: currencies.length > 0,
    // actions
    setFrom: (code: string) => dispatch({ type: 'SET_FROM', payload: code }),
    setTo: (code: string) => dispatch({ type: 'SET_TO', payload: code }),
    setAmount: (value: number) => dispatch({ type: 'SET_AMOUNT', payload: value }),
    swap: () => dispatch({ type: 'SWAP' })
  };
};