import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const isAdminState = atom<boolean | undefined>({
  key: 'isAdminState',
  default: undefined,
});

export const useIsAdminState = () => {
  return useRecoilValue(isAdminState);
};

export const useIsAdminMutators = () => {
  const setIsAdmin = useSetRecoilState(isAdminState);

  return { setIsAdmin };
};
