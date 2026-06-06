import styles from './Icons.module.scss';
import { concatClassNames } from '../../utils/functions.ts';
import TriangleDown from '../../assets/icons/triangle-down.svg?react';

export const TriangleDownIcon = () => {
  const iconClasses = concatClassNames([
    styles.icon,
    styles.iconTriangle
  ]);

  return (
    <TriangleDown className={iconClasses} />
  );
};