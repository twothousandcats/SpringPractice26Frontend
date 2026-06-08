import styles from './Base.module.scss';
import { WorkArea } from '../WorkArea/WorkArea.tsx';
import { DescriptionGroup } from '../DescriptionGroup/DescriptionGroup.tsx';
import { useConverter } from '../../hooks/useConverter.ts';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.ts';
import { I18n } from '../../utils/config.ts';
import { concatClassNames } from '../../utils/functions.ts';
import { StatusScreen } from '../StatusScreen/StatusScreen.tsx';

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
    isLoading,
    error,
    hasData,
    setFrom,
    setTo,
    setAmount,
    swap
  } = useConverter();
  useDocumentTitle(
    fromCurrency && toCurrency
      ? `Convert from ${fromCurrency.name} to ${toCurrency.name}`
      : I18n.en.app.title
  );

  const baseClasses = concatClassNames([
    styles.base,
    styles.container
  ]);

  if (!hasData) {
    if (isLoading) {
      return (
        <div className={baseClasses}>
          <StatusScreen
            variant={'loading'}
            text={I18n.en.status.loading}
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className={baseClasses}>
          <StatusScreen
            variant={'error'}
            text={I18n.en.status.serverError}
          />
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <StatusScreen
          variant={'empty'}
          text={I18n.en.status.empty}
        />
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <WorkArea
        currencies={currencies}
        from={fromCode}
        to={toCode}
        amount={amount}
        result={conversionResult}
        fromCurrency={fromCurrency!}
        toCurrency={toCurrency!}
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
        from={fromCurrency!}
        to={toCurrency!}
      />
    </div>
  );
};