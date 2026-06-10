import styles from './Icons.module.scss';
import { concatClassNames } from '../../utils/functions.ts';
import ArrowUp from '../../assets/icons/arrow-up.svg?react';

export const ArrowUpIcon = () => {
  const iconClasses = concatClassNames([
    styles.icon,
    styles.iconArrow
  ]);

  return (
    <ArrowUp className={iconClasses} />
  );
};