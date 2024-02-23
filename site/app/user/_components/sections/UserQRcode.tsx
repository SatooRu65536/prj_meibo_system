'use client';

import QRCode from 'react-qr-code';
import styles from './userQRcode.module.scss';

type Props = {
  id: number;
};

export default function UserQRcode(props: Props) {
  const { id } = props;

  return (
    <section className={styles.qrcode_section}>
      <QRCode
        className={styles.qrcode}
        value={`https://meibo.sysken.net/user/?id=${id}`}
      />
    </section>
  );
}
