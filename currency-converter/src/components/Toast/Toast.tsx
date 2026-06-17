import styles from './Toast.module.scss';
import {concatClassNames} from "../../utils/functions.ts";
import {CONFIG} from "../../utils/config.ts";
import {useEffect} from "react";

type ToastProps = {
    message: string;
    isActive?: boolean;
    autoHideMs?: number;
    onClose?: () => void;
}

export const Toast = (
    {
        message,
        isActive,
        onClose,
        autoHideMs = CONFIG.settings.toastDelayMs,
    }: ToastProps
) => {
    useEffect(() => {
        if (!isActive || !onClose) {
            return;
        }

        const id = setTimeout(onClose, autoHideMs);

        return () => clearTimeout(id);
    }, [isActive, onClose, autoHideMs]);

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