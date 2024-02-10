type Keys = 'editMember' | 'isLivingWithParents';

export default function getLocalstorage<T>(key: Keys, defaultValue: T) {
  if (typeof window === 'undefined') return defaultValue;
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) as T : defaultValue;
}

export function setLocalstorage<T>(key: Keys, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
