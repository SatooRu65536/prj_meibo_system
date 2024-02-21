'use client';

import QRCode from 'react-qr-code';
import styles from './userQRcode.module.scss';
import { getMemberInfo } from '@/components/util';
import useMember from '@/hooks/useMember';

export default function UserQRcode() {
  const [editMember] = useMember();

  return (
    <section className={styles.qrcode_section}>
      <div className={styles.qr_wrapper}>
        {editMember && (
          <>
            <QRCode
              className={styles.qrcode}
              value={`https://meibo.sysken.net/user/${editMember.id}`}
            />
            <h2 className={styles.info}>
              {`${getMemberInfo(editMember)} ${editMember.lastName} ${editMember.firstName}`}
            </h2>
          </>
        )}
      </div>
    </section>
  );
}
