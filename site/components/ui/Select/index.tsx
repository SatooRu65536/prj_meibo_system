import { HTMLProps, useEffect, useState } from 'react';
import styles from './select.module.scss';

type SelectProps<T extends any[]> = HTMLProps<HTMLSelectElement> & {
  options: { key: T[number]; value: string }[];
  set: (value: T[number]) => void;
  error: string | undefined;
};

export default function Select<T extends any[]>(props: SelectProps<T>) {
  const { options, set, error, ...others } = props;

  const initValue = options.find((o) => o.key === props.value)?.value;
  const [value, setValue] = useState(initValue || '');
  const [err, setErr] = useState(error ?? ' ');

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setErr('');
    const value = e.currentTarget.value;
    const selectedOption = options.find((option) => option.value === value);
    if (!selectedOption) return;

    setValue(value);
    if (set) set(selectedOption.key);
  }

  useEffect(() => {
    setErr(error ?? '');
  }, [error]);

  return (
    <div className={styles.select_container}>
      <select
        {...others}
        className={styles.select}
        value={value}
        onChange={handleChange}
      >
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>

      <div className={styles.error_wrapper}>
        <p className={styles.error}>{err}</p>
      </div>
    </div>
  );
}
