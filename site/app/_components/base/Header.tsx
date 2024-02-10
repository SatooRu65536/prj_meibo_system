import styles from './base.module.scss';

export default function Header() {
  const menus = [
    { name: 'トップ', path: '/' },
    { name: '新規登録', path: '/signup' },
  ];

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>名簿システム</h1>

      <nav className={styles.menus}>
        {menus.map((menu) => (
          <a href={menu.path} className={styles.menu}>{menu.name}</a>
        ))}
      </nav>
    </header>
  );
}
