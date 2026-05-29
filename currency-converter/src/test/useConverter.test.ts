import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useConverter } from '../hooks/useConverter.ts';
import { currencies, priceChanges } from '../mocks';

const CONFIG = {
  testingAmountValue: 10,
  firstCurrencyCode: 'CAD',
  secondCurrencyCode: 'PLN',
  thirdCurrencyCode: 'JPY'
};

describe('useConverter', () => {
  it('initialized with the first two currencies and amount = 1', () => {
    const { result } = renderHook(() => useConverter());

    expect(result.current.from).toBe(currencies[0].code);
    expect(result.current.to).toBe(currencies[1].code);
    expect(result.current.amount).toBe(1);
  });

  it('calculates the result by priceChanges[from][to].price', () => {
    const { result } = renderHook(() => useConverter());
    const rate = priceChanges[CONFIG.firstCurrencyCode][CONFIG.secondCurrencyCode].price; // todo: Fix after switching to REST API

    expect(result.current.rate).toBeCloseTo(rate);
  });

  it('recalculates result when the amount changes', () => {
    const { result } = renderHook(() => useConverter());
    const rate = priceChanges[CONFIG.firstCurrencyCode][CONFIG.secondCurrencyCode].price; // todo: Fix after switching to REST API

    act(() => result.current.setAmount(CONFIG.testingAmountValue));

    expect(result.current.amount).toBe(CONFIG.testingAmountValue);
    expect(result.current.result).toBeCloseTo(CONFIG.testingAmountValue * rate);
  });

  it('recalculates result when a pair is changed', () => {
    const { result } = renderHook(() => useConverter());

    act(() => result.current.setTo(CONFIG.thirdCurrencyCode));

    expect(result.current.to).toBe(CONFIG.thirdCurrencyCode);
    expect(result.current.result).toBeCloseTo(priceChanges[CONFIG.firstCurrencyCode][CONFIG.thirdCurrencyCode].price);
  });

  it('prohibits identical currencies when selecting "to"', () => {
    const { result } = renderHook(() => useConverter());

    act(() => result.current.setTo(CONFIG.firstCurrencyCode));

    expect(result.current.to).toBe(CONFIG.firstCurrencyCode);
    expect(result.current.from).not.toBe(CONFIG.firstCurrencyCode);
    expect(result.current.from).toBe(CONFIG.secondCurrencyCode);
  });

  it('prohibits identical currencies when selecting "from"', () => {
    const { result } = renderHook(() => useConverter());

    act(() => result.current.setFrom(CONFIG.secondCurrencyCode));

    expect(result.current.from).toBe(CONFIG.secondCurrencyCode);
    expect(result.current.to).not.toBe(CONFIG.secondCurrencyCode);
    expect(result.current.to).toBe(CONFIG.firstCurrencyCode);
  });

  it('swap swaps from/to and recalculates result', () => {
    const { result } = renderHook(() => useConverter());

    act(() => result.current.swap());

    expect(result.current.from).toBe(CONFIG.secondCurrencyCode);
    expect(result.current.to).toBe(CONFIG.firstCurrencyCode);
    expect(result.current.result).toBeCloseTo(priceChanges[CONFIG.secondCurrencyCode][CONFIG.firstCurrencyCode].price);
  });
});