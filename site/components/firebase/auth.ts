import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './client';
import { useUserMutators } from '@/globalStates/firebaseUserState';

export const login = (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};

export const useIsSigned = (): boolean | undefined => {
  const [isSigned, setIsSigned] = useState<boolean | undefined>();
  const { setUserState } = useUserMutators();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(user);
        setIsSigned(true);
      } else {
        setIsSigned(false);
      }
    });
  }, [setUserState]);

  return isSigned;
};