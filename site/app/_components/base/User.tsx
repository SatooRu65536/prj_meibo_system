'use client';

import styles from './base.module.scss';
import { login, logout, useIsSigned } from '@/components/firebase/auth';
import { AccountCircle } from '@/components/icons';
import { useUserState } from '@/globalStates/firebaseUserState';
import { useReducer } from 'react';

export default function User() {
  const isSigned = useIsSigned();
  const user = useUserState();
  const [opened, toggle] = useReducer((state) => !state, false);

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
        <a href="/user">ユーザー情報</a>
      </p>
      <p onClick={handleLogout}>ログアウト</p>
    </div>
  );
}
