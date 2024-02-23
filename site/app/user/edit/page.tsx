'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserEdit from './_components/UserEdit';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberWithPrivateInfo } from '@/type/member';
import { MemberRes } from '@/type/response';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const user = useUserState();

  const [userInfo, setUserInfo] = useState<MemberWithPrivateInfo | null>();

  useEffect(() => {
    (async () => {
      const token = await user?.getIdToken();
      const url = id ? `/api/user/${id}/detail` : '/api/user';
      const res = await baseGetFetcher<MemberRes<MemberWithPrivateInfo>>(
        url,
        token,
      );

      if (res === undefined)
        alert('エラーが発生しました\nページをリロードしてください');
      else if (!res.ok) alert(`${res.message}\n${res.approach ?? ''}`);
      else setUserInfo(res.user);
    })();
  }, [id, user]);

  return <main>{userInfo && <UserEdit member={userInfo} />}</main>;
}
