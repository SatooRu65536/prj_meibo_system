import MemberTable from '../sections/cards/Cards';
import styles from './Top.module.scss';

export default function TopPage() {
  return (
    <main className={styles.top}>
      <MemberTable />
    </main>
  );
}
