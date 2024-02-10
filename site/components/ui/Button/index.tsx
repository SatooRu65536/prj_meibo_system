import styles from './button.module.scss';
import { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...others } = props;
  return <button {...props} className={`${styles.button} ${className}`} />;
}
