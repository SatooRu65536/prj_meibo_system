'use client';

import { useEffect, useState } from 'react';
import User from './User';
import styles from './base.module.scss';
import { baseGetFetcher } from '@/components/fetcher';
import { ROUTES } from '@/const/path';
import { useUserState } from '@/globalStates/firebaseUserState';
import { useIsAdminMutators } from '@/globalStates/isAdmin';

export default function Header() {
  const [menus, setMenus] = useState([ROUTES.top, ROUTES.signup]);
  const user = useUserState();
  const { setIsAdmin } = useIsAdminMutators();

  useEffect(() => {
    (async () => {
      const token = await user?.getIdToken();
      const res = await baseGetFetcher<{ isAdmin: boolean }>(
        '/api/user/admin',
        token,
      );

      if (res?.isAdmin) {
        setMenus([ROUTES.top, ROUTES.signup, ROUTES.admin]);
        setIsAdmin(true);
      }
    })();
  }, [setIsAdmin, user]);

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
