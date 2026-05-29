import styles from './IconContainer.module.scss';
import type { ReactNode } from 'react';
import { concatClassNames } from '../../utils/functions.ts';

type IconProps = {
  icon: ReactNode;
  isActive?: boolean;
  isAbsolute?: boolean;
}

export const IconContainer = (
  {
    icon,
    isActive,
    isAbsolute,
  }: IconProps) => {
  const classNames = concatClassNames([
    styles.icon,
    isActive && styles.active,
    isAbsolute && styles.absolute
  ]);

  return (
    <div className={classNames}>
      {icon}
    </div>
  );
};