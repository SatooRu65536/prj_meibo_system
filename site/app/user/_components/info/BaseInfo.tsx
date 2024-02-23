import styles from './info.module.scss';
import { Wrapper } from '@/components/page/_components';
import Icon from '@/components/ui/Icon';
import { MemberDetailInfo, MemberInfo } from '@/type/response';

type Props = {
  user: MemberInfo['user'] | MemberDetailInfo['user'];
};

export default function BaseInfo(props: Props) {
  const { user } = props;

  return (
    <div className={styles.info}>
      <Wrapper title="ユーザーID">
        <p>{user.id}</p>
      </Wrapper>

      <Wrapper title="アイコン">
        <Icon src={user.iconUrl ?? undefined} />
      </Wrapper>

      <Wrapper title="名前">
        <p>
          {user.lastName} {user.firstName}
        </p>
      </Wrapper>

      <Wrapper title="名前(フリガナ)">
        <p>
          {user.lastNameKana} {user.firstNameKana}
        </p>
      </Wrapper>

      <Wrapper title="Slack表示名">
        <p>{user.slackName}</p>
      </Wrapper>

      <Wrapper title="卒業(予定)年度">
        <p>{user.graduationYear}</p>
      </Wrapper>

      <Wrapper title="技術スタック">
        <p>{user.skills.join(', ')}</p>
      </Wrapper>

      <Wrapper title="タイプ">
        <p>{user.type}</p>
      </Wrapper>
    </div>
  );
}
