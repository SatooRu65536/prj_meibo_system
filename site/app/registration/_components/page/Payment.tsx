'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './payment.module.scss';
import { basePostFetcher, basePutFetcher } from '@/components/fetcher';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { toSendMember } from '@/components/util';
import { ROUTES } from '@/const/path';
import { useUserState } from '@/globalStates/firebaseUserState';
import { useLiveWithParentsState } from '@/globalStates/livingWithParents';
import useMember from '@/hooks/useMember';
import { MemberWithPrivateInfo } from '@/type/member';
import { MemberRes } from '@/type/response';

const SAMPLE_PAYEES = [
  { key: 0, value: '' },
  { key: 1, value: '佐藤 智' },
  { key: 2, value: '鈴木 一郎' },
  { key: 3, value: '田中 二郎' },
];

type Porps = {
  isEditing: boolean;
};

export default function PayeePage(props: Porps) {
  const { isEditing } = props;

  const [payee, setPayee] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');
  const isLivingWithParents = useLiveWithParentsState();
  const [editMember] = useMember();
  const router = useRouter();
  const user = useUserState();

  async function handleSubmit() {
    if (payee === undefined) {
      setError('選択してください');
      return;
    }

    const res = await send(isEditing);

    if (res === undefined) {
      alert('エラーが発生しました\nもう一度お試しください');
      return;
    } else if (!res.ok) {
      alert(`${res.message}\n${res.approach ?? ""}`);
      return;
    }

    router.push(ROUTES.user.path);
  }

  async function send(isEditing: boolean) {
    const token = await user?.getIdToken();
    const body = {
      payeeId: 1,
      user: toSendMember(editMember, isLivingWithParents),
    };

    if (isEditing) {
      const { id } = editMember;
      if (!id) {
        alert('ユーザーIDがありません\n多分バグです');
        return;
      }
      return await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
        `/api/user/${id}`,
        token,
        body,
      );
    }

    return await basePostFetcher<MemberRes<MemberWithPrivateInfo>>(
      '/api/user',
      token,
      body,
    );
  }

  return (
    <main className={styles.payment}>
      <div className={styles.wrapper}>
        <h2>お金を渡した人</h2>
        <Select<number[]>
          options={SAMPLE_PAYEES}
          set={(id) => setPayee(id)}
          className={styles.select}
          error={error}
        />

        <Button className={styles.submit} onClick={handleSubmit}>
          送信
        </Button>
      </div>
    </main>
  );
}
