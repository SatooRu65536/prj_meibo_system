import { ReactNode } from 'react';
import styles from '../registration.module.scss';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { MemberError } from "@/type/member";

type ActiveMemberProps = {
  active: boolean;
  studentNumber: string | null;
  position: string | null;
  grade: string | null;
  // eslint-disable-next-line no-unused-vars
  setStudentNumber: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  setPosition: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  setGrade: (value: string) => void;
  errors: MemberError;
};

export function ActiveMember(props: ActiveMemberProps) {
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
  // eslint-disable-next-line no-unused-vars
  setOldPosition: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  setOldStudentNumber: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEmployment: (value: string) => void;
  errors: MemberError;
};
export function OBOGMember(props: OBOGMemberProps) {
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
  // eslint-disable-next-line no-unused-vars
  setSchool: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  setOrganization: (value: string) => void;
  errors: MemberError;
};
export function ExternalMember(props: ExternalMemberProps) {
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
  children: ReactNode;
};

export function Wrapper(props: WrapperProps) {
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