'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { baseGetFetcher, basePutFetcher } from '../fetcher';
import {
  ActiveMember,
  ExternalMember,
  OBOGMember,
  Wrapper,
} from './_components';
import styles from './registration.module.scss';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { validateMember } from '@/components/validation';
import { useUserState } from '@/globalStates/firebaseUserState';
import getLocalstorage, {
  setLocalstorage,
} from '@/globalStates/foundations/localstorage';
import {
  useLiveWithParentsMutators,
  useLiveWithParentsState,
} from '@/globalStates/livingWithParents';
import useMember from '@/hooks/useMember';
import {
  MemberAll,
  MemberError,
  MemberType,
  MemberWithPrivateInfo,
} from '@/type/member';
import { MemberRes } from '@/type/response';

type Porps = {
  isEditing: boolean;
  setToPayeePage?: Dispatch<SetStateAction<boolean>>;
};

export default function RegistrationPage(props: Porps) {
  const { isEditing, setToPayeePage } = props;

  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<MemberError>({});
  const isLivingWithParents = useLiveWithParentsState();
  const { setIsLivingWithParents } = useLiveWithParentsMutators();
  const user = useUserState();
  const [editMember, dispatch] = useMember();

  const ref = useRef(false);

  useEffect(() => {
    const iconUrl = user?.photoURL;
    if (!iconUrl || editMember.iconUrl) return;

    dispatch.setIconUrl(iconUrl);
    dispatch.setEmail(user?.email ?? '');
    setLoaded(true);
  }, [dispatch, editMember.iconUrl, user]);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    (async () => {
      const token = await user?.getIdToken();
      const res = await baseGetFetcher<MemberRes<MemberAll>>(
        '/api/user',
        token,
      );

      if (res?.ok) dispatch.setMember(res.user);
    })();
  }, [dispatch, user]);

  useEffect(() => {
    if (isLivingWithParents !== undefined) {
      setLocalstorage<boolean>('isLivingWithParents', isLivingWithParents);
      return;
    }

    const value = getLocalstorage<boolean>('isLivingWithParents', false);
    setIsLivingWithParents(value);
  }, [
    isLivingWithParents,
    editMember.privateInfo.currentAddress,
    setIsLivingWithParents,
  ]);

  async function handleSubmit() {
    if (isLivingWithParents === undefined) return;

    const [isValid, errors] = validateMember(editMember, isLivingWithParents);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    if (!isEditing && setToPayeePage) setToPayeePage(true);
    else if (isEditing) sendEdited();
    else
      alert(
        'エラーが発生しました\n' +
          'もう一度お試しください' +
          'バグなので何度試しても変わらないと思います',
      );
  }

  async function sendEdited() {
    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${editMember.id}`,
      token,
      { user: editMember },
    );
    if (res === undefined) {
      alert('エラーが発生しました\nもう一度お試しください');
      return;
    } else if (!res.ok) {
      alert(`${res.message}\n${res.approach ?? ''}`);
      return;
    }
    alert('変更しました');
  }

  function getFullName(first: string | null, last: string | null): string {
    if (first === undefined) return last ?? '';
    return `${last} ${first}`;
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
            value={getFullName(editMember.firstName, editMember.lastName)}
            set={(v) => dispatch.setName(v)}
            placeholder="佐藤 智"
            supplement="姓と名の間には空白を入れてください"
            error={errors.name}
          />
        </Wrapper>

        <Wrapper title="名前(フリガナ)">
          <Input
            type="text"
            value={getFullName(
              editMember.firstNameKana,
              editMember.lastNameKana,
            )}
            set={(v) => dispatch.setKana(v)}
            placeholder="サトウ サトル"
            supplement="姓と名の間には空白を入れてください"
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
          {user ? (
            <p>{user.email}</p>
          ) : (
            <Input
              type="email"
              value={editMember.privateInfo.email ?? ''}
              set={(v) => dispatch.setEmail(v)}
              supplement="愛工大アカウント以外を入力してください"
              placeholder="xxx@xxx.xxx"
              error={errors.email}
            />
          )}
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

        <Wrapper title="実家暮らしですか？">
          <div className={styles.living_wrapper}>
            <input
              type="checkbox"
              id="living"
              className={styles.checkbox}
              checked={isLivingWithParents ?? false}
              onChange={() => setIsLivingWithParents((v) => !v)}
            />
            <label htmlFor="living">
              {isLivingWithParents ? 'はい' : 'いいえ'}
            </label>
          </div>
        </Wrapper>

        {isLivingWithParents || (
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
        )}
      </section>

      <section className={styles.buttons_section}>
        <Button className={styles.next} onClick={handleSubmit}>
          {isEditing ? '変更' : '次へ'}
        </Button>
      </section>
    </main>
  );
}
