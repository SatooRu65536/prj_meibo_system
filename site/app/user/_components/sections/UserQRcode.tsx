'use client';

import QRCode from 'react-qr-code';
import styles from './userQRcode.module.scss';
import { getMemberInfo } from '@/components/util';
import { useEffect, useState } from 'react';
import { Member } from '@/type/member';

const SAMPLE_MEMBER: Member = {
  id: 1,
  firstName: 'さとる',
  lastName: '佐藤',
  firstNameKana: 'サトル',
  lastNameKana: 'サトウ',
  skills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular'],
  graduationYear: 2022,
  iconUrl:
    'https://lh3.googleusercontent.com/a/ACg8ocJ5UcBEd0RtC1DD9i6jN8O4wN4cIu8kpq041CgD5aHMglo=s96-c',
  slackName: 'k23000_佐藤さとる',
  updatedAt: '2021-01-01T00:00:00Z',
  createdAt: '2022-02-02T00:00:00Z',
  type: 'active',
  position: '会計',
  studentNumber: 'k23000',
  grade: 'B1',
};

export default function UserQRcode() {
  const [member, setMember] = useState<Member>();

  useEffect(() => {
    setMember(SAMPLE_MEMBER);
  }, []);

  return (
    <section className={styles.qrcode_section}>
      <div className={styles.qr_wrapper}>
        {member && (
          <>
            <QRCode
              className={styles.qrcode}
              value={`https://meibo.sysken.net/user/${member.id}`}
            />
            <h2 className={styles.info}>
              {`${getMemberInfo(member)} ${member.lastName} ${member.firstName}`}
            </h2>
          </>
        )}
      </div>
    </section>
  );
}
