import { Nav } from '@/components/Nav';
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';

export default function UpdatePassword() {
  return (
    <main className="member-page min-h-screen bg-ink px-6 py-32">
      <Nav />
      <UpdatePasswordForm />
    </main>
  );
}
