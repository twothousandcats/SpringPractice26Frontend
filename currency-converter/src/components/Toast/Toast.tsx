import styles from './Toast.module.scss';
import {concatClassNames} from "../../utils/functions.ts";

type ToastProps = {
    message: string;
    isActive?: boolean;
}

export const Toast = (
    {
        message,
        isActive
    }: ToastProps) => {
    const classes = concatClassNames([
        styles.toast,
        isActive && styles.active
    ]);

    return (
        <div className={classes}
             role="alert"
             data-testid="toast">
            <p className={styles.message}>{message}</p>
        </div>
    );
};