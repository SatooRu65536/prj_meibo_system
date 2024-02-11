import { ROUTES } from '@/const/path';
import User from './User';
import styles from './base.module.scss';

export default function Header() {
  const menus = [ROUTES.top, ROUTES.signup];

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <a href={ROUTES.top.path}>名簿システム</a>
      </h1>

      <nav className={styles.menus}>
        {menus.map((menu) => (
          <a key={menu.path} href={menu.path} className={styles.menu}>
            {menu.name}
          </a>
        ))}

        <User />
      </nav>
    </header>
  );
}
