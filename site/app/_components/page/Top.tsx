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
  const [displayMembers, setDisplayMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const user = useUserState();

  function includeInMember(member: Member, words: string[]) {
    return words.some((w) =>
      Object.values(member).some((v) => {
        if (typeof v === 'string') return v.includes(w);
        if (typeof v === 'number') return v.toString().includes(w);
      }),
    );
  }

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

  useEffect(() => {
    const words = search.split(' ');
    const display = members.filter((m) => includeInMember(m, words));
    setDisplayMembers(display);
  }, [search, members]);

  return (
    <main className={styles.cards}>
      <section className={styles.search_wrapper}>
        <label className={styles.label} htmlFor="search_input">
          検索:
        </label>
        <input
          type="text"
          id="search_input"
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className={styles.cards_section}>
        {displayMembers.map((member) => (
          <Card key={member.id} member={member} />
        ))}
      </section>
    </main>
  );
}
