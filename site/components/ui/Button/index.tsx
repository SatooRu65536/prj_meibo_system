import { ButtonHTMLAttributes } from 'react';
import styles from './button.module.scss';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  return <button {...props} className={`${styles.button} ${className}`} />;
}
