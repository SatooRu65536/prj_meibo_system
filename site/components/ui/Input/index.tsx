import { HTMLProps, useState } from 'react';
import styles from './input.module.scss';

type InputProps = HTMLProps<HTMLInputElement> & {
  set: (value: string) => void;
  supplement?: string;
};

export default function Input(props: InputProps) {
  const { className, supplement, set, ...others } = props;

  const [value, setValue] = useState(props.value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    </div>
  );
}
