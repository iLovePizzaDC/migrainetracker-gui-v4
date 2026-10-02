import LoginButton from '@/features/auth/components/atoms/LoginButton';
import { CalendarDaysIcon, ChartBarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

type LandingNote = {
	title: string;
	text: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const landingNotes: LandingNote[] = [
	{
		title: 'Calendar',
		text: 'Log a day. Time, intensity, symptoms, and what you took.',
		icon: CalendarDaysIcon,
	},
	{
		title: 'Overview',
		text: 'See the month. MIDAS, counts, and how the pattern moves.',
		icon: ChartBarIcon,
	},
	{
		title: 'Your calendar',
		text: 'Entries stay in your Google Calendar. Sign-in is the only account.',
		icon: LockClosedIcon,
	},
];

function LandingPage() {
	return (
		<div className='my-auto flex w-full animate-fade-up flex-col gap-8 sm:gap-10'>
			<header className='max-w-xl text-left'>
				<p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35'>Luna</p>
				<h1 className='page-heading mt-3'>MigraineTracker</h1>
				<p className='page-subheading max-w-md'>
					A quiet diary for episodes, patterns, and recovery.
				</p>
				<div className='mt-6'>
					<LoginButton />
				</div>
				<p className='mt-3 max-w-md text-xs leading-relaxed text-white/35'>
					A private record. Not a diagnosis or a treatment.
				</p>
			</header>

			<ul className='grid gap-3 sm:grid-cols-3'>
				{landingNotes.map((landingNote) => {
					const NoteIcon = landingNote.icon;

					return (
						<li key={landingNote.title} className='glass-panel-soft px-4 py-4'>
							<div className='flex items-center gap-2'>
								<NoteIcon className='h-4 w-4 shrink-0 text-white/40' aria-hidden='true' />
								<h2 className='text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45'>
									{landingNote.title}
								</h2>
							</div>
							<p className='mt-2 text-sm leading-relaxed text-white/60'>{landingNote.text}</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default LandingPage;
