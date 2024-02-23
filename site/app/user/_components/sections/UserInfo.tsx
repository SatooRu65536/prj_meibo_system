'use client';

import { useEffect, useState } from 'react';
import DetailInfo from '../info/DetailInfo';
import Info from '../info/Info';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberDetailInfo, MemberInfo, UserInfoRes } from '@/type/response';

type Props = {
  id: string;
};

export default function UserInfo(props: Props) {
  const { id } = props;

  const user = useUserState();
  const [userInfo, setUserInfo] = useState<
    MemberInfo | MemberDetailInfo | null
  >();

  useEffect(() => {
    (async () => {
      const token = await user?.getIdToken();
      const res = await baseGetFetcher<UserInfoRes>(`/api/user/${id}`, token);

      if (res === undefined)
        alert('エラーが発生しました\nページをリロードしてください');
      else if (!res.ok) alert(`${res.message}\n${res.approach ?? ''}`);
      else setUserInfo({ ...res });
    })();
  }, [id, user]);

  return (
    <section>
      {userInfo === undefined || <div>読み込み中</div>}
      {userInfo?.isDetail === true && <DetailInfo user={userInfo} />}
      {userInfo?.isDetail === false && <Info user={userInfo} />}
    </section>
  );
}
