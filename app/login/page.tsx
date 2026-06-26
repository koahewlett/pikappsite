import { AuthForm } from '@/components/AuthForm';
import { Nav } from '@/components/Nav';

export default function Login() {
  return (
    <main className="member-page min-h-screen bg-ink px-6 py-32">
      <Nav />
      <AuthForm />
    </main>
  );
}
