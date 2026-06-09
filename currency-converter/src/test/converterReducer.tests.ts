import {converterReducer, initialConverterState} from "../hooks/converterReducer.ts";
import {CURRENCIES, PRICE_CHANGE} from "./fixtures.ts";
import {describe, expect, it} from "vitest";

const loadedState = {
    ...initialConverterState,
    initialized: true,
    currencies: CURRENCIES,
    fromCode: 'CAD',
    toCode: 'PLN',
};

describe('converterReducer: currencies', () => {
    it('CURRENCIES_FETCH_START sets isLoading and clears initError', () => {
        // Arrange
        const state = {
            ...initialConverterState,
            initError: 'smth'
        };

        // Act
        const nextState = converterReducer(
            state,
            {type: 'CURRENCIES_FETCH_START'}
        );

        // Assert
        expect(nextState.isLoading).toBe(true);
        expect(nextState.initError).toBeNull();
    });

    it('CURRENCIES_LOADED stores data, pick first two codes and mark init', () => {
        // Arrange
        const state = initialConverterState;

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'CURRENCIES_LOADED',
                payload: CURRENCIES,
            }
        );

        // Assert
        expect(nextState.currencies).toEqual(CURRENCIES);
        expect(nextState.fromCode).toBe('CAD');
        expect(nextState.toCode).toBe('PLN');
        expect(nextState.isLoading).toBe(false);
        expect(nextState.initialized).toBe(true);
        expect(nextState.initError).toBeNull();
    });

    it('CURRENCIES_LOADED keeps already chosen codes it they are present in payload', () => {
        // Arrange
        const state = {
            ...initialConverterState,
            fromCode: 'JPY',
            toCode: 'PLN',
        };

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'CURRENCIES_LOADED',
                payload: CURRENCIES,
            }
        );

        // Assert
        expect(nextState.fromCode).toBe('JPY');
        expect(nextState.toCode).toBe('PLN');
    });

    it('CURRENCIES_ERROR stores message, stops loading and stays uninitialized', () => {
        // Arrange
        const state = {
            ...initialConverterState,
            isLoading: true,
        };

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'CURRENCIES_ERROR',
                payload: 'server shut down',
            },
        );

        // Assert
        expect(nextState.isLoading).toBe(false);
        expect(nextState.currencies).toEqual(CURRENCIES);
        expect(nextState.initialized).toBe(true);
    })
});

describe('converterReducer: prices', () => {
    it('PRICE_FETCH_START only flips isLoading and keeps the data', () => {
        // Arrange
        const state = loadedState;

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'PRICE_FETCH_START',
            },
        );

        // Assert
        expect(nextState.isLoading).toBe(true);
        expect(nextState.currencies).toEqual(CURRENCIES);
        expect(nextState.initialized).toBe(true);
    });

    it('PRICE_LOADED writes priceChange and clears runtimeError', () => {
        // Arrange
        const state = {
            ...loadedState,
            runtimeError: 'old'
        };

        // Act
        const next = converterReducer(
            state,
            {
                type: 'PRICE_LOADED',
                payload: PRICE_CHANGE
            }
        );

        // Assert
        expect(next.priceChange).toEqual(PRICE_CHANGE);
        expect(next.runtimeError).toBeNull();
        expect(next.isLoading).toBe(false);
    });

    it('PRICE_ERROR records runtimeError without losing currencies/initialized', () => {
        // Arrange
        const state = loadedState;

        // Act
        const next = converterReducer(
            state,
            {
                type: 'PRICE_ERROR',
                payload: 'timeout'
            }
        );

        // Assert
        expect(next.runtimeError).toBe('timeout');
        expect(next.currencies).toEqual(CURRENCIES);
        expect(next.initialized).toBe(true);
        expect(next.isLoading).toBe(false);
    });

    it('RUNTIME_ERROR_DISMISS clears runtimeError', () => {
        // Arrange
        const state = {
            ...loadedState,
            runtimeError: 'error'
        };

        // Act
        const next = converterReducer(
            state,
            {
                type: 'RUNTIME_ERROR_DISMISS'
            }
        );

        // Assert
        expect(next.runtimeError).toBeNull();
    });
});

describe('converterReducer: pair selection', () => {
    it('SET_TO equal to current "from" shifts "from" to another currency', () => {
        // Arrange
        const state = loadedState;

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'SET_TO',
                payload: 'CAD',
            },
        );

        // Assert
        expect(nextState.toCode).toBe('CAD');
        expect(nextState.fromCode).toBe('PLN');
    });

    it('SET_TO with a different currency does not touch "from"', () => {
        // Arrange
        const state = loadedState;

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'SET_TO',
                payload: 'JPY',
            }
        );

        // Assert
        expect(nextState.fromCode).toBe('CAD');
        expect(nextState.toCode).toBe('JPY');
    });

    it('SET_FROM equal to current "to" shifts "to" to another currency', () => {
        // Arrange
        const state = loadedState;

        // Act
        const nextState = converterReducer(
            state, {
                type: 'SET_FROM',
                payload: 'PLN'
            }
        );

        // Assert
        expect(nextState.fromCode).toBe('PLN');
        expect(nextState.toCode).toBe('CAD');
    });

    it('SET_FROM with a different currency does not touch "to"', () => {
        // Arrange
        const state = loadedState;

        // Act
        const nextState = converterReducer(
            state,
            {
                type: 'SET_FROM',
                payload: 'JPY'
            }
        );

        // Assert
        expect(nextState.fromCode).toBe('JPY');
        expect(nextState.toCode).toBe('PLN');
    });

    it('SWAP swaps the pair', () => {
        // Arrange
        const state = loadedState;

        // Act
        const next = converterReducer(
            state,
            {
                type: 'SWAP'
            }
        );

        // Assert
        expect(next.fromCode).toBe('PLN');
        expect(next.toCode).toBe('CAD');
    });
});

describe('converterReducer: amount', () => {
    it('SET_AMOUNT writes the amount', () => {
        // Arrange
        const state = loadedState;

        // Act
        const next = converterReducer(
            state,
            {
                type: 'SET_AMOUNT',
                payload: 42
            }
        );

        // Assert
        expect(next.amount).toBe(42);
    });
});