import UserQRcode from './_components/sections/UserQRcode';
import RegistrationPage from '@/components/page/Registration';

export default function Page() {
  return (
    <main>
      <UserQRcode />
      <RegistrationPage isEditing />
    </main>
  );
}
