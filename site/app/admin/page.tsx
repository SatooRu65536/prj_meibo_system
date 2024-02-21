'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from './_components/table';
import styles from './page.module.scss';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberProps } from '@/type/member';
import { MembersRes } from '@/type/response';

export default function Page() {
  const [memberes, setMembers] = useState<MemberProps[]>([]);
  const user = useUserState();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await user?.getIdToken();
      const res = await baseGetFetcher<MembersRes<MemberProps>>(
        '/api/users/detail',
        token,
      );

      if (res === undefined) {
        alert('エラーが発生しました');
        router.push('/');
        return;
      } else if (!res.ok) {
        alert(`${res.message}\n${res.approach ?? ''}`);
        router.push('/');
        return;
      }

      setMembers(res.users);
    })();
  }, [router, user]);

  return (
    <main className={styles.main}>
      <Table members={memberes} />
    </main>
  );
}
