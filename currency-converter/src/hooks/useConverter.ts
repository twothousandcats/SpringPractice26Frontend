import {useEffect, useReducer, useRef} from 'react';
import {converterReducer, initialConverterState} from './converterReducer.ts';
import {fetchCurrencies, fetchPriceChange} from '../api/currency/Api.ts';
import {CONFIG} from "../utils/config.ts";

const toMessage = (error: unknown): string =>
    error instanceof Error
        ? error.message
        : 'Unknown error';

const isAbortError = (error: unknown): boolean =>
    error instanceof DOMException && error.name === 'AbortError';


export const useConverter = () => {
    const [state, dispatch] = useReducer(converterReducer, initialConverterState);
    const {
        isLoading,
        initialized,
        currencies,
        priceChange,
        initError,
        runtimeError,
        fromCode,
        toCode,
        amount
    } = state;

    // get /Currency - init
    useEffect(() => {
        const abortController = new AbortController();
        dispatch({type: 'CURRENCIES_FETCH_START'});

        fetchCurrencies(abortController.signal)
            .then((data) => dispatch({type: 'CURRENCIES_LOADED', payload: data}))
            .catch((e) => {
                if (isAbortError(e)) {
                    return
                }

                dispatch({type: 'CURRENCIES_ERROR', payload: toMessage(e)});
            });

        return () => abortController.abort();
    }, []);

    const requestKey = `${fromCode}|${toCode}|${amount}`;
    const isFirstPriceRequest = useRef<boolean>(true);

    // todo: cancelled -> AbortController
    // todo: первая загрузка данных без debounced
    // get /price - init
    useEffect(() => {
        const [from, to] = requestKey.split('|');
        if (!from || !to) {
            return;
        }

        const abortController = new AbortController();
        const run = () => {
            dispatch({type: 'PRICE_FETCH_START'});
            fetchPriceChange(
                {purchasedCurrency: from, paymentCurrency: to},
                abortController.signal
            )
                .then((changes) => {
                    const latest = changes.length > 0 ? changes[changes.length - 1] : null;
                    dispatch({type: 'PRICE_LOADED', payload: latest});
                })
                .catch((e) => {
                    if (isAbortError(e)) {
                        return;
                    }

                    dispatch({type: 'PRICE_ERROR', payload: toMessage(e)});
                });
        };

        if (isFirstPriceRequest.current) {
            isFirstPriceRequest.current = false;
            run();

            return () => abortController.abort();
        }

        const timer = setInterval(run, CONFIG.settings.debounceDelayMs);
        return () => {
            clearTimeout(timer);
            abortController.abort();
        }
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
        initialized,
        initError,
        runtimeError,
        hasData: currencies.length > 0,

        // actions
        setFrom: (code: string) => dispatch({type: 'SET_FROM', payload: code}),
        setTo: (code: string) => dispatch({type: 'SET_TO', payload: code}),
        setAmount: (value: number) => dispatch({type: 'SET_AMOUNT', payload: value}),
        swap: () => dispatch({type: 'SWAP'}),
        dismissRuntimeError: () => dispatch({type: 'RUNTIME_ERROR_DISMISS'})
    };
};