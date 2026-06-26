import { MemberDashboard } from '@/components/MemberDashboard';
import { Nav } from '@/components/Nav';

export default function Dashboard() {
  return (
    <main className="member-page min-h-screen bg-ink px-6 py-28">
      <Nav />
      <MemberDashboard />
    </main>
  );
}
