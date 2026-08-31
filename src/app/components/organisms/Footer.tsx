import { fetchUserLogout } from '@/shared/api/user.api';
import { useUser } from '@/shared/hooks/use-user';

function Footer() {
	const { user } = useUser();

	const logout = async () => {
		await fetchUserLogout();
	};

	return (
		<footer className='mt-auto w-full border-t border-white/[0.06] bg-black/20 backdrop-blur-xl'>
			<div className='mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row sm:px-6'>
				<span className='text-xs text-white/35'>MigraineTracker – Luna</span>
				{user && (
					<button
						onClick={logout}
						className='text-xs text-white/40 transition-colors hover:text-white/70'
					>
						Logout
					</button>
				)}
			</div>
		</footer>
	);
}

export default Footer;
