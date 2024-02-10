'use client';

import { useUserState } from '@/globalStates/firebaseUserState';
import styles from './registration.module.scss';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';
import Select from '@/components/ui/Select';
import useMember from '@/hooks/useMember';
import { useEffect, useState } from 'react';
import { MemberType } from '@/type/member';

export default function RegistrationPage() {
  const [loaded, setLoaded] = useState(false);
  const user = useUserState();
  const [
    editMember,
    {
      setId,
      setName,
      setKana,
      setSkills,
      setGraduationYear,
      setSlackName,
      setIconUrl,
      setType,
      setStudentNumber,
      setPosition,
      setGrade,
      setOldPosition,
      setOldStudentNumber,
      setEmployment,
      setSchool,
      setOrganization,
      setEmail,
      setPhoneNumber,
      setBirthdate,
      setGender,
      setCurrentAddressPostalCode,
      setCurrentAddressAddress,
      setHomeAddressPostalCode,
      setHomeAddressAddress,
    },
  ] = useMember();

  useEffect(() => {
    const iconUrl = user?.photoURL;
    if (!iconUrl) return;
    setIconUrl(iconUrl);
    setLoaded(true);
  }, [user]);

  return (
    <main className={styles.registration}>
      <section className={styles.registration_section}>
        <Wrapper titile="アイコン">
          <Icon src={user?.photoURL ?? undefined} />
        </Wrapper>

        <Wrapper titile="名前">
          <Input
            type="text"
            value={
              editMember.firstName && editMember.lastName
                ? `${editMember.lastName} ${editMember.firstName}`
                : ''
            }
            set={(v) => setName(v)}
            placeholder="佐藤 智"
            supplement="姓と名の間には空白を入れてください"
          />
        </Wrapper>

        <Wrapper titile="名前(フリガナ)">
          <Input
            type="text"
            value={
              editMember.firstNameKana && editMember.lastNameKana
                ? `${editMember.lastNameKana} ${editMember.firstNameKana}`
                : ''
            }
            set={(v) => setKana(v)}
            placeholder="サトウ サトル"
            supplement="姓と名の間には空白を入れてください"
          />
        </Wrapper>

        <Wrapper titile="卒業(予定)年度">
          <Input
            type="number"
            value={editMember.graduationYear ?? ''}
            set={(v) => setGraduationYear(Number(v))}
            placeholder={String(new Date().getFullYear() + 5)}
          />
        </Wrapper>

        <Wrapper titile="技術スタック" supplement="触った事がある技術など">
          <Input
            type="text"
            value={editMember.skills.join(', ')}
            set={(v) => setSkills(v)}
            placeholder="C言語, Web制作, Next.js"
            supplement="「,」で区切ってください"
          />
        </Wrapper>

        <Wrapper titile="タイプ">
          <Select<MemberType[]>
            options={[
              { key: null, value: '' },
              { key: 'active', value: '現役部員' },
              { key: 'obog', value: 'OB・OG' },
              { key: 'external', value: '外部' },
            ]}
            value={editMember.type ?? ''}
            set={(v) => setType(v)}
          />
        </Wrapper>

        <ActiveMember
          grade={editMember.grade}
          position={editMember.position}
          studentNumber={editMember.studentNumber}
          setGrade={setGrade}
          setPosition={setPosition}
          setStudentNumber={setStudentNumber}
          active={loaded && editMember.type === 'active'}
        />
        <OBOGMember
          employment={editMember.employment}
          oldPosition={editMember.oldPosition}
          oldStudentNumber={editMember.oldStudentNumber}
          setEmployment={setEmployment}
          setOldPosition={setOldPosition}
          setOldStudentNumber={setOldStudentNumber}
          active={loaded && editMember.type === 'obog'}
        />
        <ExternalMember
          organization={editMember.organization}
          school={editMember.school}
          setOrganization={setOrganization}
          setSchool={setSchool}
          active={loaded && editMember.type === 'external'}
        />

        <div className={styles.descript_container}>
          <p>以下の項目は本人と役員以外には非公開となります</p>
        </div>

        <Wrapper titile="性別">
          <Select
            options={[
              { key: '', value: '' },
              { key: '男', value: '男' },
              { key: '女', value: '女' },
              { key: 'その他', value: 'その他' },
            ]}
            value={editMember.privateInfo.gender ?? ''}
            set={(v) => setGender(v)}
          />
        </Wrapper>

        <Wrapper titile="生年月日">
          <Input
            type="date"
            value={editMember.privateInfo.birthdate ?? ''}
            set={(v) => setBirthdate(v)}
          />
        </Wrapper>

        <Wrapper titile="電話番号(携帯)">
          <Input
            type="text"
            value={editMember.privateInfo.phoneNumber ?? ''}
            set={(v) => setPhoneNumber(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="メールアドレス">
          <Input
            type="email"
            value={editMember.privateInfo.email ?? ''}
            set={(v) => setEmail(v)}
            supplement="愛工大アカウント以外を入力してください"
            placeholder="xxx@xxx.xxx"
          />
        </Wrapper>

        <Wrapper titile="現在の郵便番号">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.postalCode ?? ''}
            set={(v) => setCurrentAddressPostalCode(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="現在の住所">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.address ?? ''}
            set={(v) => setCurrentAddressAddress(v)}
            placeholder="x県x市x町x-xx-xx"
          />
        </Wrapper>

        <Wrapper
          titile="実家の郵便番号"
          supplement="実家暮らしの場合は現在と同じ"
        >
          <Input
            type="text"
            value={editMember.privateInfo.homeAddress.postalCode ?? ''}
            set={(v) => setHomeAddressPostalCode(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="実家の住所" supplement="実家暮らしの場合は現在と同じ">
          <Input
            type="text"
            value={editMember.privateInfo.homeAddress.address ?? ''}
            set={(v) => setHomeAddressAddress(v)}
            supplement=""
            placeholder="x県x市x町x-xx-xx"
          />
        </Wrapper>
      </section>

      <section className={styles.buttons_section}>
        <Button className={styles.next}>次へ</Button>
      </section>
    </main>
  );
}

type ActiveMemberProps = {
  active: boolean;
  studentNumber: string | null;
  position: string | null;
  grade: string | null;
  setStudentNumber: (value: string) => void;
  setPosition: (value: string) => void;
  setGrade: (value: string) => void;
};
function ActiveMember(props: ActiveMemberProps) {
  const {
    active,
    studentNumber,
    position,
    grade,
    setStudentNumber,
    setPosition,
    setGrade,
  } = props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper titile="学年">
        <Select
          options={[
            { key: '', value: '' },
            { key: 'B1', value: 'B1' },
            { key: 'B2', value: 'B2' },
            { key: 'B3', value: 'B3' },
            { key: 'B4', value: 'B4' },
            { key: 'M1', value: 'M1' },
            { key: 'M2', value: 'M2' },
            { key: 'その他', value: 'その他' },
          ]}
          value={grade ?? ''}
          set={(v) => setGrade(v)}
        />
      </Wrapper>

      <Wrapper titile="学籍番号" supplement="現在の学籍番号">
        <Input
          type="text"
          value={studentNumber ?? ''}
          set={(v) => setStudentNumber(v)}
          placeholder="k23075"
        />
      </Wrapper>

      <Wrapper titile="役職" supplement="現在の役職">
        <Input
          type="text"
          value={position ?? ''}
          set={(v) => setPosition(v)}
          supplement="なければ空白にしてください"
        />
      </Wrapper>
    </div>
  );
}

type OBOGMemberProps = {
  active: boolean;
  oldPosition: string | null;
  oldStudentNumber: string | null;
  employment: string | null;
  setOldPosition: (value: string) => void;
  setOldStudentNumber: (value: string) => void;
  setEmployment: (value: string) => void;
};
function OBOGMember(props: OBOGMemberProps) {
  const {
    active,
    oldPosition,
    oldStudentNumber,
    employment,
    setOldPosition,
    setOldStudentNumber,
    setEmployment,
  } = props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper titile="学籍番号" supplement="卒業時の学籍番号">
        <Input
          type="text"
          value={oldStudentNumber ?? ''}
          set={(v) => setOldStudentNumber(v)}
          placeholder="k23075"
        />
      </Wrapper>

      <Wrapper titile="旧役職" supplement="最終的な役職">
        <Input
          type="text"
          value={oldPosition ?? ''}
          set={(v) => setOldPosition(v)}
          supplement="なければ空白にしてください"
        />
      </Wrapper>

      <Wrapper titile="就職先(任意)">
        <Input
          type="text"
          value={employment ?? ''}
          set={(v) => setEmployment(v)}
        />
      </Wrapper>
    </div>
  );
}

type ExternalMemberProps = {
  active: boolean;
  school: string | null;
  organization: string | null;
  setSchool: (value: string) => void;
  setOrganization: (value: string) => void;
};
function ExternalMember(props: ExternalMemberProps) {
  const { active, school, organization, setSchool, setOrganization } = props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper titile="学校">
        <Input
          type="text"
          value={school ?? ''}
          set={(v) => setSchool(v)}
          supplement="なければ空白にしてください"
        />
      </Wrapper>

      <Wrapper titile="所属団体">
        <Input
          type="text"
          value={organization ?? ''}
          set={(v) => setOrganization(v)}
          supplement="なければ空白にしてください"
        />
      </Wrapper>
    </div>
  );
}

type WrapperProps = {
  titile: string;
  supplement?: string;
  children: React.ReactNode;
};

function Wrapper(props: WrapperProps) {
  const { titile, supplement, children } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_container}>
        <h3 className={styles.title}>{titile}</h3>
        {supplement && <p className={styles.supplement}>{supplement}</p>}
      </div>

      <div>{children}</div>
    </div>
  );
}
