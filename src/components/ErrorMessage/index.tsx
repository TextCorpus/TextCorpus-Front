import styles from './styles.module.scss';

import { useAuth } from '../../hooks/useAuth';

export const ErrorMessage = () => {

    const { isPasswordError } = useAuth();

    return (
        <small
            className={styles.errorMessage}
            style={{ opacity: !isPasswordError ? '0' : '1' }}
        >
            A sua senha está incorreta ou essa conta não existe.
        </small>
    )

}