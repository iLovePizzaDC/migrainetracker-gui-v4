import { UserCircleIcon } from '@heroicons/react/24/outline';

function LoadingBox() {
	return (
		<div className='flex items-center justify-center py-28'>
			<div className='glass-panel flex animate-fade-up flex-col items-center gap-4 px-10 py-9'>
				<div className='relative flex h-14 w-14 items-center justify-center'>
					<UserCircleIcon className='h-10 w-10 text-white/25' />
					<div
						className='absolute inset-0 animate-spin rounded-full border border-transparent border-t-white/40'
						style={{ animationDuration: '1.4s' }}
					/>
				</div>
				<p className='text-xs font-medium uppercase tracking-[0.15em] text-white/40'>Signing in</p>
			</div>
		</div>
	);
}

export default LoadingBox;
