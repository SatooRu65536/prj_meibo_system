'use client';

import { useEffect, useState } from 'react';
import styles from './userEdit.module.scss';
import { basePutFetcher } from '@/components/fetcher';
import {
  ActiveMember,
  ExternalMember,
  OBOGMember,
  Wrapper,
} from '@/components/page/_components';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { toFlatMember } from '@/components/util';
import { validateMember } from '@/components/validation';
import { useUserState } from '@/globalStates/firebaseUserState';
import useEditMember from '@/hooks/useEditMember';
import { MemberError, MemberType, MemberWithPrivateInfo } from '@/type/member';
import { MemberRes } from '@/type/response';

type Props = {
  member: MemberWithPrivateInfo;
};

export default function UserEdit(props: Props) {
  const { member } = props;
  const [loaded, setLoaded] = useState(false);
  const [editMember, dispatch] = useEditMember(toFlatMember(member));
  const [errors, setErrors] = useState<MemberError>({});
  const user = useUserState();

  useEffect(() => {
    setLoaded(true);
  }, []);

  async function handleSubmit() {
    const [isValid, errors] = validateMember(editMember, false);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${editMember.id}`,
      token,
      { user: editMember },
    );
    if (res === undefined)
      alert('エラーが発生しました\nもう一度お試しください');
    else if (!res.ok) alert(`${res.message}\n${res.approach ?? ''}`);
    else alert('変更しました');
  }

  return (
    <main>
      <section className={styles.edit_section}>
        <Wrapper title="アイコン">
          <Icon src={editMember.iconUrl} />
        </Wrapper>

        <Wrapper title="名前(姓)">
          <Input
            type="text"
            value={editMember.lastName}
            set={(v) => dispatch.setLastName(v)}
            placeholder="佐藤"
            error={errors.name}
          />
        </Wrapper>

        <Wrapper title="名前(名)">
          <Input
            type="text"
            value={editMember.firstName}
            set={(v) => dispatch.setFirstName(v)}
            placeholder="佐藤"
            error={errors.name}
          />
        </Wrapper>

        <Wrapper title="名前(セイ)">
          <Input
            type="text"
            value={editMember.lastNameKana}
            set={(v) => dispatch.setLastNameKana(v)}
            placeholder="サトウ"
            error={errors.kana}
          />
        </Wrapper>

        <Wrapper title="名前(メイ)">
          <Input
            type="text"
            value={editMember.firstNameKana}
            set={(v) => dispatch.setFirstNameKana(v)}
            placeholder="サトル"
            error={errors.kana}
          />
        </Wrapper>

        <Wrapper title="Slack表示名">
          <Input
            type="text"
            value={editMember.slackName ?? ''}
            set={(v) => dispatch.setSlackName(v)}
            placeholder="学籍番号_名前 or 団体名_名前"
            error={errors.slackName}
          />
        </Wrapper>

        <Wrapper title="卒業(予定)年度">
          <Input
            type="number"
            value={editMember.graduationYear || ''}
            set={(v) => dispatch.setGraduationYear(Number(v))}
            placeholder={String(new Date().getFullYear() + 5)}
            error={errors.graduationYear}
          />
        </Wrapper>

        <Wrapper title="技術スタック" supplement="触った事がある技術など">
          <Input
            type="text"
            value={editMember.skills.join(', ')}
            set={(v) => dispatch.setSkills(v)}
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
            set={(v) => dispatch.setType(v)}
            error={errors.type}
          />
        </Wrapper>

        <ActiveMember
          grade={editMember.grade}
          position={editMember.position}
          studentNumber={editMember.studentNumber}
          setGrade={dispatch.setGrade}
          setPosition={dispatch.setPosition}
          setStudentNumber={dispatch.setStudentNumber}
          active={loaded && editMember.type === 'active'}
          errors={errors}
        />
        <OBOGMember
          employment={editMember.employment}
          oldPosition={editMember.oldPosition}
          oldStudentNumber={editMember.oldStudentNumber}
          setEmployment={dispatch.setEmployment}
          setOldPosition={dispatch.setOldPosition}
          setOldStudentNumber={dispatch.setOldStudentNumber}
          active={loaded && editMember.type === 'obog'}
          errors={errors}
        />
        <ExternalMember
          organization={editMember.organization}
          school={editMember.school}
          setOrganization={dispatch.setOrganization}
          setSchool={dispatch.setSchool}
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
            set={(v) => dispatch.setGender(v)}
            error={errors.gender}
          />
        </Wrapper>

        <Wrapper title="生年月日">
          <Input
            type="date"
            value={editMember.privateInfo.birthdate ?? ''}
            set={(v) => dispatch.setBirthdate(v)}
            error={errors.birthdate}
          />
        </Wrapper>

        <Wrapper title="電話番号(携帯)">
          <Input
            type="text"
            value={editMember.privateInfo.phoneNumber ?? ''}
            set={(v) => dispatch.setPhoneNumber(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx-xxxx"
            error={errors.phoneNumber}
          />
        </Wrapper>

        <Wrapper title="メールアドレス">
          <p>{editMember.privateInfo.email}</p>
        </Wrapper>

        <Wrapper title="現在の郵便番号">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.postalCode ?? ''}
            set={(v) => dispatch.setCurrentAddressPostalCode(v)}
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
            error={errors.currentPostalCode}
          />
        </Wrapper>

        <Wrapper title="現在の住所">
          <Input
            type="text"
            value={editMember.privateInfo.currentAddress.address ?? ''}
            set={(v) => dispatch.setCurrentAddressAddress(v)}
            placeholder="x県x市x町x-xx-xx"
            error={errors.currentAddress}
          />
        </Wrapper>

        <>
          <Wrapper title="実家の郵便番号">
            <Input
              type="text"
              value={editMember.privateInfo.homeAddress.postalCode ?? ''}
              set={(v) => dispatch.setHomeAddressPostalCode(v)}
              supplement="「-」で区切ってください"
              placeholder="xxx-xxxx"
              error={errors.homePostalCode}
            />
          </Wrapper>

          <Wrapper title="実家の住所">
            <Input
              type="text"
              value={editMember.privateInfo.homeAddress.address ?? ''}
              set={(v) => dispatch.setHomeAddressAddress(v)}
              supplement=""
              placeholder="x県x市x町x-xx-xx"
              error={errors.homeAddress}
            />
          </Wrapper>
        </>
      </section>

      <section className={styles.buttons_section}>
        <Button className={styles.next} onClick={handleSubmit}>
          変更
        </Button>
      </section>
    </main>
  );
}
