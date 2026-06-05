import styles from './Base.module.scss';
import { WorkArea } from '../WorkArea/WorkArea.tsx';
import { DescriptionGroup } from '../DescriptionGroup/DescriptionGroup.tsx';
import { useConverter } from '../../hooks/useConverter.ts';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.ts';

export const Base = () => {
  const {
    currencies,
    fromCode,
    toCode,
    amount,
    conversionResult,
    fromCurrency,
    toCurrency,
    dateTime,
    setFrom,
    setTo,
    setAmount,
    swap
  } = useConverter();
  useDocumentTitle(`Convert from ${fromCurrency.name} to ${toCurrency.name}`);

  return (
    <div className={`${styles.base} ${styles.container}`}>
      <WorkArea
        currencies={currencies}
        from={fromCode}
        to={toCode}
        amount={amount}
        result={conversionResult}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        dateTime={dateTime}
        onFromChange={setFrom}
        onToChange={setTo}
        onAmountChange={setAmount}
        onSwap={swap}
      />
      {
        /*
        * При любом изменении пары будет происходить изменение стейта в кастомном хуке
        * При изменении стейта происходит ререндер
        * Пара уникальна
        * */
      }
      <DescriptionGroup
        key={`${fromCode}/${toCode}`}
        from={fromCurrency}
        to={toCurrency}
      />
    </div>
  );
};