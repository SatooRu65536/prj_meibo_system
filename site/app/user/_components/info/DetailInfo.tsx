import styles from './info.module.scss';
import { Wrapper } from '@/components/page/_components';
import { MemberDetailInfo } from '@/type/response';

type Props = {
  user: MemberDetailInfo['user'];
};

export default function DetailInfo(props: Props) {
  const { user } = props;

  return (
    <div className={styles.info}>
      <Wrapper title="誕生日">
        <p>{user.privateInfo.birthdate.split('-').join('/')}</p>
      </Wrapper>

      <Wrapper title="性別">
        <p>{user.privateInfo.email}</p>
      </Wrapper>

      <Wrapper title="電話番号">
        <p>{user.privateInfo.phoneNumber}</p>
      </Wrapper>

      <Wrapper title="メールアドレス">
        <p>{user.privateInfo.email}</p>
      </Wrapper>

      <Wrapper title="現在の郵便番号">
        <p>{user.privateInfo.currentAddress.postalCode}</p>
      </Wrapper>

      <Wrapper title="現在の住所">
        <p>{user.privateInfo.currentAddress.postalCode}</p>
      </Wrapper>

      <Wrapper title="実家の郵便番号">
        <p>{user.privateInfo.homeAddress.postalCode}</p>
      </Wrapper>

      <Wrapper title="実家の住所">
        <p>{user.privateInfo.homeAddress.address}</p>
      </Wrapper>
    </div>
  );
}
