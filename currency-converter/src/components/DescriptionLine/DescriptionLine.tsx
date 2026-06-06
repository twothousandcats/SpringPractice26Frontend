import styles from './DescriptionLine.module.scss';
import type { Currency } from '../../models/types.ts';
import { I18n } from '../../utils/config.ts';

type DescriptionLineProps = {
  currency: Currency;
}

export const DescriptionLine = ({ currency }: DescriptionLineProps) => {
  return (
    <article className={styles.descriptionLineWrapper}>
      <p className={styles.descriptionLineHeading}>
        {`${currency.name} — ${currency.code} — ${currency.symbol}`}
      </p>
      <p className={styles.descriptionLineText}>
        {currency.description || I18n.en.fallbackDescription}
      </p>
    </article>
  );
};