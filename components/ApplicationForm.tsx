'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const steps = ['Personal Information', 'ASU Information', 'Involvement', 'Social Links', 'Submit'];

export function ApplicationForm() {
	const [step, setStep] = useState(0);
	const [status, setStatus] = useState('');
	const [form, setForm] = useState<Record<string, string>>({});

	const fields = [
		['first_name', 'last_name', 'phone', 'email'],
		['major', 'graduation_year', 'hometown'],
		['sports', 'clubs', 'leadership_positions'],
		['instagram', 'linkedin'],
		[]
	][step];

	async function submit() {
		setStatus('Submitting...');

		// Insert into rush_applications (primary expected table)
		const { error } = await supabase.from('rush_applications').insert([{ ...form, status: 'new' }]);
		if (error) {
			setStatus(error.message);
			return;
		}

		// Also attempt to create a lightweight `users` record so signups are available
		// in a users table if one exists. This is non-fatal: if the table doesn't
		// exist or insertion is restricted, ignore the error so the application still succeeds.
		try {
			const signupPayload: Record<string, string> = {};
			if (form.email) signupPayload.email = form.email;
			if (form.first_name) signupPayload.first_name = form.first_name;
			if (form.last_name) signupPayload.last_name = form.last_name;
			if (form.phone) signupPayload.phone = form.phone;
			if (form.major) signupPayload.major = form.major;
			if (form.graduation_year) signupPayload.graduation_year = form.graduation_year;
			if (form.hometown) signupPayload.hometown = form.hometown;
			if (form.sports) signupPayload.sports = form.sports;
			if (form.clubs) signupPayload.clubs = form.clubs;
			if (form.leadership_positions) signupPayload.leadership_positions = form.leadership_positions;
			if (form.instagram) signupPayload.instagram = form.instagram;
			if (form.linkedin) signupPayload.linkedin = form.linkedin;
			if (Object.keys(signupPayload).length > 0) {
				await supabase.from('signups').insert([signupPayload]);
			}
		} catch (e) {
			// ignore: insertion might fail due to missing table or RLS; primary insert already succeeded
		}

		setStatus('Application submitted. Our rush team will reach out soon.');
	}

	return (
		<div id="apply" className="glass mx-auto max-w-3xl rounded-[2rem] p-6 md:p-10">
			<div className="mb-6 flex flex-wrap gap-2">
				{steps.map((s, i) => (
					<button
						key={s}
						onClick={() => setStep(i)}
						className={`rounded-full px-3 py-1 text-xs ${i === step ? 'bg-gold text-ink' : 'bg-white/10 text-white/60'}`}>
						{i + 1}. {s}
					</button>
				))}
			</div>

			<h2 className="mb-6 text-3xl font-black">Rush Application</h2>

			{fields.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2">
					{fields.map((f) => (
						<label key={f} className="text-sm capitalize text-white/70">
							{f.replaceAll('_', ' ')}
							<input
								className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-gold"
								value={form[f] || ''}
								onChange={(e) => setForm({ ...form, [f]: e.target.value })}
							/>
						</label>
					))}
				</div>
			) : (
				<div className="rounded-3xl bg-white/5 p-5 text-white/75">Review your information, then submit your application to Pi Kappa Phi at ASU.</div>
			)}

			<div className="mt-8 flex justify-between">
				<button disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full bg-white/10 px-5 py-3 disabled:opacity-30">Back</button>
				{step < 4 ? (
					<button onClick={() => setStep(step + 1)} className="rounded-full bg-gold px-5 py-3 font-bold text-ink">Next</button>
				) : (
					<button onClick={submit} className="rounded-full bg-gold px-5 py-3 font-bold text-ink">Submit</button>
				)}
			</div>

			{status && <p className="mt-4 text-gold">{status}</p>}
		</div>
	);
}
