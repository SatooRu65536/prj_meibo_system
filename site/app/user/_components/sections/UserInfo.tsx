'use client';

import { useEffect, useState } from 'react';
import ApproveBtn from '../approveBtn/ApproveBtn';
import BaseInfo from '../info/BaseInfo';
import DetailInfo from '../info/DetailInfo';
import Menu from '../menu/Menu';
import UserQRcode from './UserQRcode';
import { baseGetFetcher } from '@/components/fetcher';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberDetailInfo, MemberInfo, UserInfoRes } from '@/type/response';

type Props = {
  id: string | null;
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
      const url = id ? `/api/user/${id}` : '/api/user';
      const res = await baseGetFetcher<UserInfoRes>(url, token);

      if (res === undefined)
        alert('エラーが発生しました\nページをリロードしてください');
      else if (!res.ok) alert(`${res.message}\n${res.approach ?? ''}`);
      else setUserInfo({ ...res });
    })();
  }, [id, user]);

  const isShowQRcode = userInfo?.user.id !== undefined && id === null;

  return (
    <main>
      <Menu id={id} />
      {isShowQRcode && <UserQRcode id={userInfo?.user.id} />}
      {userInfo === null && <div>読み込み中</div>}
      {userInfo && <BaseInfo user={userInfo.user} />}
      {userInfo?.isDetail === true && <DetailInfo user={userInfo.user} />}
      {userInfo?.isApproved === false && <ApproveBtn id={id} />}
    </main>
  );
}
