import LoginButton from '@/features/auth/components/atoms/LoginButton';

function LandingPage() {
	return (
		<div className='mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center'>
			<div className='glass-panel w-full px-5 py-8 sm:px-10 sm:py-12'>
				<p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35'>Luna</p>
				<h1 className='page-heading mt-3'>MigraineTracker</h1>
				<p className='page-subheading mx-auto mt-3 max-w-sm'>
					Track episodes, patterns, and recovery — quietly, in one place.
				</p>
				<div className='mt-8'>
					<LoginButton />
				</div>
				<p className='mx-auto mt-4 max-w-sm text-xs leading-relaxed text-white/40'>
					Signing in saves migraine entries, including health details, in your Google Calendar.{' '}
					<a
						href='/privacy'
						className='link-subtle underline decoration-white/20 underline-offset-2'
					>
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	);
}

export default LandingPage;
