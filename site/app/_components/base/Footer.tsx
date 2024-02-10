import styles from './base.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        {'©SET 2024 / Created by '}
        <a href="https://satooru.me" target="_blank">
          SatooRu
        </a>
      </p>
    </footer>
  );
}
