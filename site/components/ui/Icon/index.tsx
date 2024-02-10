import styles from './icon.module.scss';

export default function Icon(props: { src: string | undefined }) {
  const { src } = props;

  return (
    <div className={styles.icon_wrapper}>
      {src && <img src={src} alt="アイコン" className={styles.icon} />}
    </div>
  );
}
