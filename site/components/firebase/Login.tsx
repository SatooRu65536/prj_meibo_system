'use client';

import { login, useIsSigned } from './auth';
import { useUserState } from '@/globalStates/firebaseUserState';

type UserInfo = {
  photoURL: string;
  displayName: string;
  token: string;
};

export default function Login() {
  const isSigned = useIsSigned();
  const user = useUserState();

  return (
    <div>
      {isSigned === undefined && <p>読み込み中</p>}
      {isSigned ? <p>サインイン済み</p> : <p>サインインしていません</p>}
      <button onClick={login}>ろぐいん</button>
      {user && (
        <div>
          <img
            src={user.photoURL ?? undefined}
            alt={user.displayName ?? undefined}
          />
          <p>{user.displayName}</p>
        </div>
      )}
    </div>
  );
}
