'use client';

import { useEffect, useReducer } from 'react';
import styles from './base.module.scss';
import { login, logout, useIsSigned } from '@/components/firebase/auth';
import { AccountCircle } from '@/components/icons';
import { ROUTES } from '@/const/path';
import { useUserState } from '@/globalStates/firebaseUserState';

export default function User() {
  const isSigned = useIsSigned();
  const user = useUserState();
  const [opened, toggle] = useReducer((state) => !state, false);

  useEffect(() => {
    (async () => {
      if (user && process.env.NODE_ENV === 'development')
        console.log(await user.getIdToken());
    })();
  }, [user]);

  return (
    <div className={styles.user}>
      {isSigned || <AccountCircle className={styles.loading} onClick={login} />}
      {isSigned && user && (
        <img
          className={styles.icon}
          src={user.photoURL ?? ''}
          alt="アイコン"
          onClick={toggle}
        />
      )}

      <UserMenu opened={opened} toggle={toggle} />
    </div>
  );
}

type UserMenuProps = {
  opened: boolean;
  toggle: () => void;
};

function UserMenu(props: UserMenuProps) {
  const { opened, toggle } = props;

  function handleLogout() {
    logout();
    toggle();
  }

  return (
    <div className={styles.user_menu} data-opened={opened}>
      <p>
        <a href={ROUTES.user.path}>{ROUTES.user.name}</a>
      </p>
      <p onClick={handleLogout}>ログアウト</p>
    </div>
  );
}
