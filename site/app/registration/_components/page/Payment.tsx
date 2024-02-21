'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './payment.module.scss';
import {
  baseGetFetcher,
  basePostFetcher,
  basePutFetcher,
} from '@/components/fetcher';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { toSendMember } from '@/components/util';
import { ROUTES } from '@/const/path';
import { useUserState } from '@/globalStates/firebaseUserState';
import { useIsAdminState } from '@/globalStates/isAdmin';
import { useLiveWithParentsState } from '@/globalStates/livingWithParents';
import useMember from '@/hooks/useMember';
import { MemberWithPrivateInfo } from '@/type/member';
import { BaseResponse, MemberRes } from '@/type/response';

type Porps = {
  isEditing: boolean;
};

type Payee = {
  id: number;
  name: string;
};
const initPayee = { id: 0, name: '' };

export default function PayeePage(props: Porps) {
  const { isEditing } = props;

  const [payee, setPayee] = useState<Payee[]>([initPayee]);
  const [selectedPayee, setSelectedPayee] = useState<number>();
  const [error, setError] = useState('');
  const isLivingWithParents = useLiveWithParentsState();
  const [editMember] = useMember();
  const router = useRouter();
  const user = useUserState();
  const isAdmin = useIsAdminState();

  useEffect(() => {
    (async () => {
      const res =
        await baseGetFetcher<BaseResponse<{ payee: Payee[] }>>(
          '/api/users/payee',
        );
      if (res === undefined) {
        alert('エラーが発生しました\nもう一度お試しください');
        return;
      } else if (!res.ok) {
        alert(`${res.message}\n${res.approach ?? ''}`);
        return;
      }

      setPayee([initPayee, ...res.payee]);
    })();
  }, []);

  async function handleSubmit() {
    if (!isAdmin && selectedPayee === undefined) {
      setError('選択してください');
      return;
    }

    const res = await send(isEditing);

    if (res === undefined) {
      alert('エラーが発生しました\nもう一度お試しください');
      return;
    } else if (!res.ok) {
      alert(`${res.message}\n${res.approach ?? ''}`);
      return;
    }

    router.push(ROUTES.user.path);
  }

  async function send(isEditing: boolean) {
    const token = await user?.getIdToken();
    const body = {
      payeeId: selectedPayee ?? isAdmin ? 0 : undefined,
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
          options={payee.map((p) => ({ key: p.id, value: p.name }))}
          set={(id) => setSelectedPayee(id)}
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
