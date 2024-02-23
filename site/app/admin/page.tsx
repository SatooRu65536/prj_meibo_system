'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import Table from './_components/table';
import styles from './page.module.scss';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberProps } from '@/type/member';
import { MembersRes } from '@/type/response';

export default function Page() {
  const [memberes, setMembers] = useState<MemberProps[]>([]);
  const [displayMembers, setDisplayMembers] = useState<MemberProps[]>([]);
  const [sortedMembers, setSortedMembers] = useState<MemberProps[]>([]);
  const [sortBy, setSortBy] = useState({ key: 'id', asc: true });
  const [search, setSearch] = useState('');
  const user = useUserState();
  const router = useRouter();

  function includeInMember(member: MemberProps, words: string[]) {
    return words.some((w) =>
      Object.values(member).some((v) => {
        if (typeof v === 'string') return v.includes(w);
        if (typeof v === 'number') return v.toString().includes(w);
      }),
    );
  }

  function matchMember(member: MemberProps, words: string[]) {
    return words.some((w) => {
      const [key, value] = w.split(':');
      if (member[key] === undefined) return false;
      if (typeof member[key] === 'string') return member[key] === value;
      if (typeof member[key] === 'number')
        return member[key].toString() === value;
      return false;
    });
  }

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

  useEffect(() => {
    const words = search.split(' ');
    const kvWords = words.filter((w) => w.match(/(\w+):(\w+)/));
    const otherWords = words.filter((w) => !w.match(/(\w+):(\w+)/));
    const display = memberes.filter(
      (m) => includeInMember(m, otherWords) || matchMember(m, kvWords),
    );
    setDisplayMembers(display);
  }, [search, memberes]);

  useEffect(() => {
    const cloned = structuredClone(displayMembers);
    cloned.sort((a, b) => {
      if (a[sortBy.key] > b[sortBy.key]) return sortBy.asc ? 1 : -1;
      if (a[sortBy.key] < b[sortBy.key]) return sortBy.asc ? -1 : 1;
      return 0;
    });
    setSortedMembers(cloned);
  }, [displayMembers, sortBy]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <main className={styles.main}>
      <section className={styles.search_wrapper}>
        <label className={styles.label} htmlFor="search_input">
          検索:
        </label>
        <input
          type="text"
          id="search_input"
          className={styles.search}
          value={search}
          onChange={handleSearch}
        />
      </section>

      <Table
        members={sortedMembers}
        sortBy={sortBy}
        setMembers={setDisplayMembers}
        setSortBy={setSortBy}
      />
    </main>
  );
}
