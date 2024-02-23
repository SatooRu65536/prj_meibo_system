'use client';

import { useRouter } from 'next/navigation';
import styles from './menu.module.scss';
import { useIsAdminState } from '@/globalStates/isAdmin';

type Props = {
  id: string | null;
};

export default function Menu(props: Props) {
  const { id } = props;

  const router = useRouter();
  const isAdmin = useIsAdminState();
  const isShowEdit = isAdmin || id === null;
  const editLink = id ? `/user/edit/?id=${id}` : '/user/edit';

  return (
    <section className={styles.menu_section}>
      <button onClick={() => router.back()}>戻る</button>

      <span className={styles.spacer} />
      {isShowEdit && <a href={editLink}>編集</a>}
    </section>
  );
}
