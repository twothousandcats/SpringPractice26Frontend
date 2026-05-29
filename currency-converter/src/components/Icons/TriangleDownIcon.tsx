import styles from './Icons.module.scss';
import { concatClassNames } from '../../utils/functions.ts';

export const TriangleDownIcon = () => {
  const iconClasses = concatClassNames([
    styles.icon,
    styles.iconTriangle
  ]);

  return (
    <svg
      className={iconClasses}
      width="26"
      height="22.5"
      viewBox="0 0 26 22.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.9902 22.5L-0.000146866 0L25.9806 0L12.9902 22.5Z"
        stroke="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};