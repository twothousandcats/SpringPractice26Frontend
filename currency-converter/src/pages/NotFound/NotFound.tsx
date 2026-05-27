import styles from './NotFound.module.scss';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.ts';

export const NotFound = () => {
  useDocumentTitle('Not Found');
  return (
    <div className={styles['not-found']}>
      NotFound
    </div>
  );
};