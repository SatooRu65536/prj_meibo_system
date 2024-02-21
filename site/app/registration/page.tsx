'use client';

import { useState } from 'react';
import PayeePage from './_components/page/Payment';
import RegistrationPage from '@/components/page/Registration';

export default function Page() {
  const [toPayeePage, setToPayeePage] = useState(false);

  return toPayeePage ? (
    <PayeePage isEditing={false} />
  ) : (
    <RegistrationPage setToPayeePage={setToPayeePage} isEditing={false} />
  );
}
