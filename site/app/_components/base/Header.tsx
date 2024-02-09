import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.title}>Header</p>
    </header>
  );
}
