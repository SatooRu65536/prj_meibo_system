import { Member } from '@/type/member';
import styles from './Cards.module.scss';

type Props = {
  member: Member;
};

export default function Card(props: Props) {
  const { member } = props; 

  function getSubtitle(member: Member) {
    switch (member.type) {
      case 'active':
        return `[${member.grade}] ${member.studentNumber}`;
      case 'obog':
        return member.employment ? `${member.employment}(OB・OG)` : 'OB・OG';
      case 'external':
        return `${member.organization}(外部)`;
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon_wrapper}>
        <img className={styles.img} src={member.iconUrl} alt="" />
      </div>

      <div className={styles.card_body}>
        <p className={styles.subtitle}>{getSubtitle(member)}</p>

        <h2 className={styles.name}>
          {member.lastName} {member.firstName}
        </h2>
      </div>
    </div>
  );
}
