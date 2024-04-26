import styles from './styles.module.scss';

import notfound from '../../assets/404.png'

export const NotFound = () => (
    <div className={styles.wrapper}>
        <img src={notfound} alt="" />
    </div>
)