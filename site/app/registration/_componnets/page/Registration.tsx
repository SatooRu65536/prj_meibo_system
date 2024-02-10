'use client';

import { useUserState } from '@/globalStates/firebaseUserState';
import styles from './registration.module.scss';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';
import Select from '@/components/ui/Select';
import useMember from '@/hooks/useMember';
import { useEffect, useState } from 'react';
import { MemberAll, MemberError, MemberType, Nullable } from '@/type/member';

/**
 * メンバー情報のバリデーション
 * @param member メンバー情報
 * @returns {[boolean, string[]]} [バリデーション結果, エラーメッセージ]
 */
function validateMember(member: Nullable<MemberAll>): [boolean, MemberError] {
  const errors: MemberError = {};

  const KANA_REGEXP = /[ァ-ンー　]+$/;
  const STUDENT_NUMBER_REGEXP = /^[a-z]\d{5}$/;
  const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const PHONE_NUMBER_REGEXP = /^\d{2,4}-\d{2,4}-\d{2,4}$/;
  const POSTAL_CODE_REGEXP = /^\d{3}-\d{4}$/;

  if (!member.firstName || !member.lastName)
    errors.name = '姓名が正しくありません';
  if (!member.firstNameKana || !member.lastNameKana)
    errors.kana = '姓名(フリガナ)が正しくありません';
  if (!member.firstNameKana?.match(KANA_REGEXP))
    errors.kana = '姓名(フリガナ)はカタカナで入力してください';
  else if (!member.lastNameKana?.match(KANA_REGEXP))
    errors.kana = '姓名(フリガナ)はカタカナで入力してください';
  if (!member.graduationYear)
    errors.graduationYear = '卒業(予定)年度を入力してください';
  else if (member.graduationYear < 1900 || member.graduationYear > 3000)
    errors.graduationYear = '卒業(予定)年度が正しくありません';
  if (!member.slackName) errors.slackName = 'Slack表示名を入力してください';
  if (!member.type) errors.type = 'タイプを選択してください';

  if (member.type === 'active') {
    if (!member.studentNumber)
      errors.studentNumber = '学籍番号を入力してください';
    else if (!member.studentNumber?.match(STUDENT_NUMBER_REGEXP))
      errors.studentNumber = '学籍番号の形式が正しくありません';
    if (!member.grade) errors.grade = '学年を選択してください';
  }

  if (member.type === 'obog') {
    if (!member.oldStudentNumber)
      errors.oldStudentNumber = '学籍番号を入力してください';
  }

  if (member.type === 'external') {
    if (!member.school) errors.school = '学校を入力してください';
    if (!member.organization)
      errors.organization = '所属団体を入力してください';
  }

  if (!member.privateInfo.gender) errors.gender = '性別を選択してください';
  if (!member.privateInfo.email)
    errors.email = 'メールアドレスを入力してください';
  else if (!member.privateInfo.email?.match(EMAIL_REGEXP))
    errors.email = 'メールアドレスの形式が正しくありません';
  if (!member.privateInfo.phoneNumber)
    errors.phoneNumber = '電話番号を入力してください';
  else if (!member.privateInfo.phoneNumber?.match(PHONE_NUMBER_REGEXP))
    errors.phoneNumber = '電話番号の形式が正しくありません';
  if (!member.privateInfo.birthdate)
    errors.birthdate = '生年月日を入力してください';
  if (!member.privateInfo.currentAddress.postalCode)
    errors.currentPostalCode = '現在の郵便番号を入力してください';
  if (!member.privateInfo.currentAddress.postalCode?.match(POSTAL_CODE_REGEXP))
    errors.currentPostalCode = '現在の郵便番号の形式が正しくありません';
  if (!member.privateInfo.currentAddress.address)
    errors.currentAddress = '現在の住所を入力してください';
  if (!member.privateInfo.homeAddress.postalCode)
    errors.homePostalCode = '実家の郵便番号を入力してください';
  if (!member.privateInfo.homeAddress.postalCode?.match(POSTAL_CODE_REGEXP))
    errors.homePostalCode = '実家の郵便番号の形式が正しくありません';
  if (!member.privateInfo.homeAddress.address)
    errors.homeAddress = '実家の住所を入力してください';

  const ok = Object.keys(errors).length === 0;
  return [ok, errors];
}

export default function RegistrationPage() {
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<MemberError>({});
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

  function handleSubmit() {
    const [isValid, errors] = validateMember(editMember);
    console.log(errors);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    console.log('submit', editMember);
  }

  return (
    <main className={styles.registration}>
      <section className={styles.registration_section}>
        <Wrapper title="アイコン">
          <Icon src={user?.photoURL ?? undefined} />
        </Wrapper>

        <Wrapper title="名前">
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
            error={errors.name}
          />
        </Wrapper>

        <Wrapper title="名前(フリガナ)">
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
            error={errors.kana}
          />
        </Wrapper>

        <Wrapper title="Slack表示名">
          <Input
            type="text"
            value={editMember.slackName ?? ''}
            set={(v) => setSlackName(v)}
            placeholder="学籍番号_名前 or 団体名_名前"
            error={errors.slackName}
          />
        </Wrapper>

        <Wrapper title="卒業(予定)年度">
          <Input
            type="number"
            value={editMember.graduationYear || ''}
            set={(v) => setGraduationYear(Number(v))}
            placeholder={String(new Date().getFullYear() + 5)}
            error={errors.graduationYear}
          />
        </Wrapper>

        <Wrapper title="技術スタック" supplement="触った事がある技術など">
          <Input
            type="text"
            value={editMember.skills.join(', ')}
            set={(v) => setSkills(v)}
            placeholder="C言語, Web制作, Next.js"
            supplement="「,」で区切ってください"
            error={errors.skills}
          />
        </Wrapper>

        <Wrapper title="タイプ">
          <Select<MemberType[]>
            options={[
              { key: null, value: '' },
              { key: 'active', value: '現役部員' },
              { key: 'obog', value: 'OB・OG' },
              { key: 'external', value: '外部' },
            ]}
            value={editMember.type ?? ''}
            set={(v) => setType(v)}
            error={errors.type}
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
          errors={errors}
        />
        <OBOGMember
          employment={editMember.employment}
          oldPosition={editMember.oldPosition}
          oldStudentNumber={editMember.oldStudentNumber}
          setEmployment={setEmployment}
          setOldPosition={setOldPosition}
          setOldStudentNumber={setOldStudentNumber}
          active={loaded && editMember.type === 'obog'}
          errors={errors}
        />
        <ExternalMember
          organization={editMember.organization}
          school={editMember.school}
          setOrganization={setOrganization}
          setSchool={setSchool}
          active={loaded && editMember.type === 'external'}
          errors={errors}
        />

        <div className={styles.descript_container}>
          <p>以下の項目は本人と役員以外には非公開となります</p>
        </div>

        <Wrapper title="性別">
          <Select
            options={[
              { key: '', value: '' },
              { key: '男', value: '男' },
              { key: '女', value: '女' },
              { key: 'その他', value: 'その他' },
            ]}
            value={editMember.privateInfo.gender ?? ''}
            set={(v) => setGender(v)}
            error={errors.gender}
          />
        </Wrapper>

        <Wrapper title="生年月日">
          <Input
            type="date"
            value={editMember.privateInfo.birthdate ?? ''}
            set={(v) => setBirthdate(v)}
            error={errors.birthdate}
          />
        </Wrapper>

        <Wrapper title="電話番号(携帯)">
          <Input
            type="text"
            value={editMember.privateInfo.phoneNumber ?? ''}
            set={(v) => setPhoneNumber(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx-xxxx"
            error={errors.phoneNumber}
          />
        </Wrapper>

        <Wrapper title="メールアドレス">
          <Input
            type="email"
            value={editMember.privateInfo.email ?? ''}
            set={(v) => setEmail(v)}
            supplement="愛工大アカウント以外を入力してください"
            placeholder="xxx@xxx.xxx"
            error={errors.email}
          />
        </Wrapper>

        <Wrapper title="現在の郵便番号">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.postalCode ?? ''}
            set={(v) => setCurrentAddressPostalCode(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
            error={errors.currentPostalCode}
          />
        </Wrapper>

        <Wrapper title="現在の住所">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.address ?? ''}
            set={(v) => setCurrentAddressAddress(v)}
            placeholder="x県x市x町x-xx-xx"
            error={errors.currentAddress}
          />
        </Wrapper>

        <Wrapper
          title="実家の郵便番号"
          supplement="実家暮らしの場合は現在と同じ"
        >
          <Input
            type="text"
            value={editMember.privateInfo.homeAddress.postalCode ?? ''}
            set={(v) => setHomeAddressPostalCode(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
            error={errors.homePostalCode}
          />
        </Wrapper>

        <Wrapper title="実家の住所" supplement="実家暮らしの場合は現在と同じ">
          <Input
            type="text"
            value={editMember.privateInfo.homeAddress.address ?? ''}
            set={(v) => setHomeAddressAddress(v)}
            supplement=""
            placeholder="x県x市x町x-xx-xx"
            error={errors.homeAddress}
          />
        </Wrapper>
      </section>

      <section className={styles.buttons_section}>
        <Button className={styles.next} onClick={handleSubmit}>
          次へ
        </Button>
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
  errors: MemberError;
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
    errors,
  } = props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper title="学年">
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
          error={errors.grade}
        />
      </Wrapper>

      <Wrapper title="学籍番号" supplement="現在の学籍番号">
        <Input
          type="text"
          value={studentNumber ?? ''}
          set={(v) => setStudentNumber(v)}
          placeholder="k23075"
          error={errors.studentNumber}
        />
      </Wrapper>

      <Wrapper title="役職" supplement="現在の役職">
        <Input
          type="text"
          value={position ?? ''}
          set={(v) => setPosition(v)}
          supplement="なければ空白にしてください"
          error={errors.position}
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
  errors: MemberError;
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
    errors,
  } = props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper title="学籍番号" supplement="卒業時の学籍番号">
        <Input
          type="text"
          value={oldStudentNumber ?? ''}
          set={(v) => setOldStudentNumber(v)}
          placeholder="k23075"
          error={errors.oldStudentNumber}
        />
      </Wrapper>

      <Wrapper title="旧役職" supplement="最終的な役職">
        <Input
          type="text"
          value={oldPosition ?? ''}
          set={(v) => setOldPosition(v)}
          supplement="なければ空白にしてください"
          error={errors.oldPosition}
        />
      </Wrapper>

      <Wrapper title="就職先(任意)">
        <Input
          type="text"
          value={employment ?? ''}
          set={(v) => setEmployment(v)}
          error={errors.employment}
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
  errors: MemberError;
};
function ExternalMember(props: ExternalMemberProps) {
  const { active, school, organization, setSchool, setOrganization, errors } =
    props;

  return (
    <div className={styles.type_box} data-active={active}>
      <Wrapper title="学校">
        <Input
          type="text"
          value={school ?? ''}
          set={(v) => setSchool(v)}
          supplement="なければ空白にしてください"
          error={errors.school}
        />
      </Wrapper>

      <Wrapper title="所属団体">
        <Input
          type="text"
          value={organization ?? ''}
          set={(v) => setOrganization(v)}
          supplement="なければ空白にしてください"
          error={errors.organization}
        />
      </Wrapper>
    </div>
  );
}

type WrapperProps = {
  title: string;
  supplement?: string;
  children: React.ReactNode;
};

function Wrapper(props: WrapperProps) {
  const { title, supplement, children } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_container}>
        <h3 className={styles.title}>{title}</h3>
        {supplement && <p className={styles.supplement}>{supplement}</p>}
      </div>

      <div>{children}</div>
    </div>
  );
}
