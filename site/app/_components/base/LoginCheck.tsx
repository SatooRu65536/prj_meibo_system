'use client';

import Button from '@/components/ui/Button';
import { useUserState } from '@/globalStates/firebaseUserState';
import styles from './loginCheck.module.scss';
import { login } from '@/components/firebase/auth';

type Props = { children: React.ReactNode };

export default function LoginCheck(props: Props) {
  const { children } = props;

  const user = useUserState();

  if (user === null) return <Loading />;
  if (user) return children;
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
