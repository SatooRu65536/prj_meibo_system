import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const livingWithParentsState = atom<boolean | undefined>({
  key: 'livingWithParents',
  default: undefined,
});

export const useLiveWithParentsState = () => {
  return useRecoilValue(livingWithParentsState);
};

export const useLiveWithParentsMutators = () => {
  const setIsLivingWithParents = useSetRecoilState(livingWithParentsState);

  return { setIsLivingWithParents };
};
