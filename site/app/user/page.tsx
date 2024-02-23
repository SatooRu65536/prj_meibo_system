'use client';

import { useSearchParams } from 'next/navigation';
import UserInfo from './_components/sections/UserInfo';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <UserInfo id={id} />;
}
