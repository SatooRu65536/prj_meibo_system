import { HTMLProps } from 'react';
import styles from './input.module.scss';

type InputProps = HTMLProps<HTMLInputElement> & {
  supplement?: string;
};

export default function Input(props: InputProps) {
  const { className, supplement, ...others } = props;

  return (
    <div {...others} className={`${styles.input_container} ${className}`}>
      <input {...others} className={styles.input} />
      {supplement && <p className={styles.supplement}>{supplement}</p>}
    </div>
  );
}
