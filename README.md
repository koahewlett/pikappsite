# Pi Kapp ASU Rush Portal

Modern fraternity recruitment web app built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase setup
1. Create a Supabase project.
2. Paste `supabase/schema.sql` into the Supabase SQL editor and run it.
3. Add your project URL and anon key to `.env.local`.
4. Enable email auth in Supabase Authentication.

## Pages
- `/` premium landing page and multi-step rush application
- `/events` RSVP cards
- `/login` sign up, log in, forgot password
- `/dashboard` member dashboard
- `/admin` recruitment dashboard with search and CSV export

## Production notes
Add role-based admin checks before launch. Current admin route assumes authenticated/internal use and should be hardened with Supabase custom claims or an `admin_users` table.
