import styles from './NotFound.module.scss';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.ts';
import { I18n } from '../../utils/config.ts';

export const NotFound = () => {
  useDocumentTitle('Not Found');

  return (
    <div className={styles.notFound}>
      {I18n.en.pages.title.notFound}
    </div>
  );
};