import styles from '../page.module.scss';
import { basePutFetcher } from '@/components/fetcher';
import Button from '@/components/ui/Button';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberProps, MemberWithPrivateInfo } from '@/type/member';
import { MemberRes } from '@/type/response';

type Props = {
  members: MemberProps[];
};

export default function Table(props: Props) {
  const { members } = props;
  const user = useUserState();

  const memberPropaties = [
    { key: 'id', title: 'ID' },
    { key: 'isApproved', title: '承認' },
    { key: 'approveBy', title: '承認者ID' },
    { key: 'lastName', title: '姓' },
    { key: 'firstName', title: '名' },
    { key: 'lastNameKana', title: '姓(カナ)' },
    { key: 'firstNameKana', title: '名(カナ)' },
    { key: 'graduationYear', title: '卒業(予定)年' },
    { key: 'slackName', title: 'slack名' },
    { key: 'iconUrl', title: 'アイコン' },
    { key: 'skills', title: 'スキル' },
    { key: 'birthdate', title: '誕生日' },
    { key: 'gender', title: '性別' },
    { key: 'phoneNumber', title: '電話番号' },
    { key: 'email', title: 'メールアドレス' },
    { key: 'cuurentPostalCode', title: '現在の郵便番号' },
    { key: 'currentAddress', title: '現在の住所' },
    { key: 'homePostalCode', title: '実家の郵便番号' },
    { key: 'homeAddress', title: '実家の住所' },
    { key: 'createdAt', title: '登録日' },

    { key: 'type', title: 'タイプ' },
    { key: 'studentNumber', title: '学生番号' },
    { key: 'position', title: '役職' },
    { key: 'grade', title: '学年' },

    { key: 'oldStudentNumber', title: '旧学籍番号' },
    { key: 'oldPosition', title: '旧役職' },
    { key: 'employment', title: '就職先' },

    { key: 'school', title: '学校' },
    { key: 'organization', title: '団体' },
  ];

  async function approve(id: number) {
    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}/approve`,
      token,
      {},
    );

    if (res === undefined) alert('承認に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else alert('承認しました');
  }

  const Propaty = (props: { k: string; value: any; id: number }) => {
    const { k, value, id } = props;

    switch (k) {
      case 'iconUrl':
        return (
          <td>
            <img className={styles.icon} src={value ?? ''} alt="アイコン" />
          </td>
        );
      case 'isApproved':
        return (
          <td>
            {value === 1 ? (
              <p>済</p>
            ) : (
              <Button
                className={styles.approve_btn}
                onClick={() => approve(id)}
              >
                承認する
              </Button>
            )}
          </td>
        );
      default:
        return (
          <td>
            <p>{value ?? '-'}</p>
          </td>
        );
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {memberPropaties.map((prop) => (
            <th key={prop.key}>
              <p>{prop.title}</p>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            {memberPropaties.map(({ key }) => (
              <Propaty key={key} k={key} value={member[key]} id={member.id} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
