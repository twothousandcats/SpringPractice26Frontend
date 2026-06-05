import styles from './StatusScreen.module.scss';

type StatusScreenProps = {
  variant: 'loading' | 'error' | 'empty';
  title: string;
  description?: string;
  testId?: string;
};

export const StatusScreen = (
  {
    variant,
    title,
    description,
    testId
  }: StatusScreenProps) => {
  return (
    <div className={styles.screen}
         data-testid={testId ?? `status-${variant}`}>
      <p className={styles.title}>{title}</p>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
};