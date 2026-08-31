import LoginButton from '@/features/auth/components/atoms/LoginButton';

function LandingPage() {
	return (
		<div className='mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center'>
			<div className='glass-panel w-full px-8 py-10 sm:px-10 sm:py-12'>
				<p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35'>Luna</p>
				<h1 className='page-heading mt-3'>MigraineTracker</h1>
				<p className='page-subheading mx-auto mt-3 max-w-sm'>
					Track episodes, patterns, and recovery — quietly, in one place.
				</p>
				<div className='mt-8'>
					<LoginButton />
				</div>
			</div>
		</div>
	);
}

export default LandingPage;
