import { HTMLProps } from 'react';
import styles from './select.module.scss';

type SelectProps = HTMLProps<HTMLSelectElement> & {
  options: string[];
};

export default function Select(props: SelectProps) {
  const { options, ...others } = props;

  return (
    <select {...others} className={styles.select}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
