import styles from './StatusScreen.module.scss';

type StatusScreenProps = {
  variant: 'loading' | 'error' | 'empty';
  text: string;
  testId?: string;
};

export const StatusScreen = (
  {
    variant,
    text,
    testId
  }: StatusScreenProps) => {
  return (
    <div className={styles.screen}
         data-testid={testId ?? `status-${variant}`}>
      <p className={styles.title}>{text}</p>
    </div>
  );
};