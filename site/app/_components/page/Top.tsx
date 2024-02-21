'use client';

import { useEffect, useState } from 'react';
import Card from '../sections/cards/Card';
import styles from './top.module.scss';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { Member } from '@/type/member';
import { MembersRes } from '@/type/response';

export default function TopPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const user = useUserState();

  useEffect(() => {
    (async () => {
      const token = await user?.getIdToken();
      const data = await baseGetFetcher<MembersRes<Member>>(
        '/api/users',
        token,
      );

      if (data === undefined) {
        alert('データの取得に失敗しました');
      } else if (data.ok === false) {
        alert(`${data.message}\n${data.approach}`);
      } else {
        setMembers(data.users);
      }
    })();
  }, [user]);

  return (
    <main className={styles.cards}>
      <section className={styles.cards_section}>
        {members.map((member) => (
          <Card key={member.id} member={member} />
        ))}
      </section>
    </main>
  );
}
