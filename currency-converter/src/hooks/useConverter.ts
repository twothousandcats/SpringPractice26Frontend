import { useState } from 'react';
import type { Currency } from '../models/types.ts';
import { currencies, priceChanges } from '../mocks';

const findByCode = (code: string): Currency => {
  return currencies.find(
    (currency) => currency.code === code
  ) ?? currencies[0];
};

const firstDifferentCode = (code: string): string => {
  return (currencies.find((currency) => currency.code !== code) ?? currencies[0]).code;
};

export const useConverter = () => {
  const [fromCode, setFromCode] = useState<string>(currencies[0].code);
  const [toCode, setToCode] = useState<string>(currencies[1].code);
  const [amount, setAmount] = useState<number>(1);

  const setFrom = (code: string): void => {
    setFromCode(code);
    if (code === toCode) {
      setToCode(firstDifferentCode(code));
    }
  };

  const setTo = (code: string): void => {
    setToCode(code);
    if (code === fromCode) {
      setFromCode(firstDifferentCode(code));
    }
  };

  const swap = (): void => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const rate = priceChanges[fromCode]?.[toCode]?.price ?? 0;
  const conversionResult = amount * rate;

  const fromCurrency = findByCode(fromCode);
  const toCurrency = findByCode(toCode);
  const dateTime = priceChanges[fromCode]?.[toCode]?.dateTime ?? '';

  return {
    currencies,
    fromCode,
    toCode,
    amount,
    conversionResult,
    rate,
    fromCurrency,
    toCurrency,
    setFrom,
    setTo,
    setAmount,
    swap,
    dateTime
  };
};