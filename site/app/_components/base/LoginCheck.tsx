'use client';

import { ReactNode } from 'react';
import styles from './loginCheck.module.scss';
import { login, useIsSigned } from '@/components/firebase/auth';
import Button from '@/components/ui/Button';

type Props = { children: ReactNode };

export default function LoginCheck(props: Props) {
  const { children } = props;

  const isSigned = useIsSigned();

  if (isSigned === undefined) return <Loading />;
  if (isSigned) return children;
  return <Login />;
}

function Loading() {
  return (
    <main className={styles.logincheck}>
      <div className={styles.center}>
        <h3>Loading...</h3>
      </div>
    </main>
  );
}

function Login() {
  return (
    <main className={styles.logincheck}>
      <div className={styles.center}>
        <h3>ログインしてください</h3>
        <Button onClick={login}>ログイン</Button>
      </div>
    </main>
  );
}
