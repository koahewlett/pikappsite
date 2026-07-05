import { MemberDashboard } from '@/components/MemberDashboard';
import { Nav } from '@/components/Nav';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="member-page min-h-screen bg-ink px-6 py-28">
      <Nav />
      <MemberDashboard />
    </main>
  );
}
