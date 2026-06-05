import styles from './Toast.module.scss';

type ToastProps = {
  message: string;
  onClose?: () => void;
}

export const Toast = (
  {
    message,
    // onClose
  }: ToastProps) => {
  return (
    <div className={styles.toast}
         role="alert"
         data-testid="toast">
      <p className={styles.message}>{message}</p>
    </div>
  );
};