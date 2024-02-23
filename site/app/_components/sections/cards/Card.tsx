import styles from './card.module.scss';
import { getMemberInfo } from '@/components/util';
import { Member } from '@/type/member';

type Props = {
  member: Member;
};

export default function Card(props: Props) {
  const { member } = props;

  return (
    <a href={`/user/?id=${member.id}`} className={styles.card_wrapper}>
      <div className={styles.card}>
        <div className={styles.icon_wrapper}>
          <img className={styles.img} src={member.iconUrl} alt="" />
        </div>

        <div className={styles.card_body}>
          <p className={styles.subtitle}>{getMemberInfo(member)}</p>

          <h2 className={styles.name}>
            {member.lastName} {member.firstName}
          </h2>
        </div>
      </div>
    </a>
  );
}
