import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styles from '../page.module.scss';
import { baseDeleteFetcher, basePutFetcher } from '@/components/fetcher';
import Button from '@/components/ui/Button';
import getLocalstorage, { setLocalstorage } from '@/foundations/localstorage';
import { useUserState } from '@/globalStates/firebaseUserState';
import { MemberProps, MemberWithPrivateInfo } from '@/type/member';
import { MemberRes } from '@/type/response';

type CellProps = {
  key: string;
  title: string;
};

const memberPropaties: CellProps[] = [
  { key: 'id', title: 'ID' },
  { key: 'isApproved', title: '承認' },
  { key: 'approveBy', title: '承認者ID' },
  { key: 'isConfirmed', title: '会計回収' },
  { key: 'payee', title: '部費受取者ID' },
  { key: 'isAdmin', title: '管理者' },
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

  { key: 'delete', title: '削除' },
];

type Props = {
  members: MemberProps[];
  sortBy: { key: string; asc: boolean };
  setMembers: Dispatch<SetStateAction<MemberProps[]>>;
  setSortBy: Dispatch<SetStateAction<{ key: string; asc: boolean }>>;
};

export default function Table(props: Props) {
  const { members, sortBy, setMembers, setSortBy } = props;
  const [displayCell, setDisplayCell] = useState<CellProps[]>(memberPropaties);
  const [hideCell, setHideCell] = useState<string[]>([]);
  const user = useUserState();

  useEffect(() => {
    const hide = getLocalstorage<string[]>('hideCell', []);
    if (hide.length) setHideCell(hide);
  }, []);

  useEffect(() => {
    setDisplayCell(
      memberPropaties.filter((prop) => !hideCell.includes(prop.title)),
    );
    setLocalstorage('hideCell', hideCell);
  }, [hideCell]);

  async function approve(id: number) {
    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}/approve`,
      token,
      {},
    );

    if (res === undefined) alert('承認に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id
            ? { ...member, isApproved: 1, approveBy: member.id }
            : member,
        ),
      );
      alert('承認しました');
    }
  }

  async function collectByTreasurer(id: number, isConfirmed: boolean) {
    const token = await user?.getIdToken();
    let res: MemberRes<MemberWithPrivateInfo> | undefined;
    if (isConfirmed) {
      res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
        `/api/user/${id}/payment`,
        token,
      );
    } else {
      res = await baseDeleteFetcher<MemberRes<MemberWithPrivateInfo>>(
        `/api/user/${id}/payment`,
        token,
      );
    }

    if (res === undefined) alert('支払い状態の更新に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isConfirmed } : member,
        ),
      );
      alert('更新しました');
    }
  }

  async function approveAdmin(id: number) {
    const ok = window.confirm('管理者にしますか？');
    if (!ok) return;

    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}/admin`,
      token,
      {},
    );

    if (res === undefined) alert('管理者承認に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isAdmin: true } : member,
        ),
      );
      alert('管理者承認しました');
    }
  }

  async function removeAdmin(id: number) {
    const ok = window.confirm('管理者権限を取り消しますか？');
    if (!ok) return;

    const token = await user?.getIdToken();
    const res = await baseDeleteFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}/admin`,
      token,
      {},
    );

    if (res === undefined) alert('管理者権限の取り消しに失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isAdmin: false } : member,
        ),
      );
      alert('管理者権限を取り消しました');
    }
  }

  function handleSort(key: string) {
    setSortBy((prev) => {
      if (prev.key === key) return { key, asc: !prev.asc };
      return { key, asc: true };
    });
  }

  function handleConfirmed(e: ChangeEvent<HTMLInputElement>, id: number) {
    const { checked } = e.target;
    collectByTreasurer(id, checked);
  }

  function handleContextMenu(key: string) {
    setHideCell((prev) => [...prev, key]);
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
    const token = await user?.getIdToken();
    const res = await baseDeleteFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}`,
      token,
      {},
    );

    if (res === undefined) alert('ユーザーの削除に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isAdmin: false } : member,
        ),
      );
      alert('ユーザーを削除しました');
    }
  }

  const Propaty = (props: { k: string; value: any; member: MemberProps }) => {
    const { k, value, member } = props;
    const { id } = member;

    switch (k) {
      case 'id':
        return <a href={`/user/edit/?id=${value}`}>{value}</a>;
      case 'iconUrl':
        return <img className={styles.icon} src={value ?? ''} alt="アイコン" />;
      case 'isApproved':
        return value ? (
          <p>済</p>
        ) : (
          <Button className={styles.btn} onClick={() => approve(id)}>
            承認
          </Button>
        );
      case 'isConfirmed':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleConfirmed(e, id)}
          />
        );
      case 'isAdmin':
        if (!member.position) return <p>-</p>;
        if (value)
          return (
            <Button className={styles.btn} onClick={() => removeAdmin(id)}>
              管理者取消
            </Button>
          );
        return (
          <Button className={styles.btn} onClick={() => approveAdmin(id)}>
            管理者承認
          </Button>
        );
      case 'skills':
        return <p>{value.join(', ')}</p>;
      case 'type':
        if (value === 'active') return <p>現役</p>;
        if (value === 'obog') return <p>OB/OG</p>;
        return <p>外部</p>;
      case 'delete':
        return (
          <Button className={styles.btn} onClick={() => handleDelete(id)}>
            削除
          </Button>
        );
      default:
        return <p>{value ?? '-'}</p>;
    }
  };

  return (
    <section>
      <div className={styles.hide_cells}>
        {hideCell.map((cell) => (
          <button
            key={cell}
            className={styles.btn}
            onClick={() =>
              setHideCell((prev) => prev.filter((c) => c !== cell))
            }
          >
            {cell}
          </button>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {displayCell.map((prop) => (
              <th
                key={prop.key}
                onClick={() => handleSort(prop.key)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleContextMenu(prop.title);
                }}
                data-sort={sortBy.key === prop.key}
                data-asc={sortBy.asc}
                data-close={hideCell.includes(prop.key)}
              >
                <p>{prop.title}</p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              {displayCell.map(({ key }) => (
                <td key={key}>
                  <Propaty k={key} value={member[key]} member={member} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
