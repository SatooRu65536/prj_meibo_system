import styles from './base.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>名簿システム</h1>
    </header>
  );
}
