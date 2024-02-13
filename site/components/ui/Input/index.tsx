import { ChangeEvent, HTMLProps, useState } from 'react';
import styles from './input.module.scss';

type InputProps = HTMLProps<HTMLInputElement> & {
  // eslint-disable-next-line no-unused-vars
  set: (value: string) => void;
  supplement?: string;
  error: string | undefined;
};

export default function Input(props: InputProps) {
  const { className, supplement, set, error, ...others } = props;

  const [value, setValue] = useState(props.value);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (set) set(e.currentTarget.value);
  }

  return (
    <div {...others} className={`${styles.input_container} ${className}`}>
      <input
        {...others}
        className={styles.input}
        value={value}
        onChange={handleChange}
      />
      {supplement && <p className={styles.supplement}>{supplement}</p>}

      <div className={styles.error_wrapper}>
        <p className={styles.error}>{error}</p>
      </div>
    </div>
  );
}
