'use client';

import { useSearchParams } from 'next/navigation';
import UserInfo from './_components/sections/UserInfo';
import UserQRcode from './_components/sections/UserQRcode';
import RegistrationPage from '@/components/page/Registration';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <main>
      {id && <UserInfo id={id} />}
      {id || (
        <>
          <UserQRcode />
          <RegistrationPage isEditing />
        </>
      )}
    </main>
  );
}
