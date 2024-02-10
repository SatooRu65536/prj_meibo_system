import RegistrationPage from '@/components/page/Registration';
import UserQRcode from './_components/sections/UserQRcode';

export default function Page() {
  return (
    <main>
      <UserQRcode />
      <RegistrationPage isEditing />
    </main>
  );
}
