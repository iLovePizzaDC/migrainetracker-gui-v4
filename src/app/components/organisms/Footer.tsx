import { fetchUserLogout } from '@/shared/api/user.api';
import { useUser } from '@/shared/hooks/use-user';

function Footer() {
	const { user } = useUser();

	const logout = async () => {
		await fetchUserLogout();
	};

	return (
		<footer className='mt-auto w-full border-t border-white/[0.06] bg-black/20 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl'>
			<div className='mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row sm:px-6'>
				<span className='text-xs text-white/35'>MigraineTracker – Luna</span>
				{user && (
					<button type='button' onClick={logout} className='link-subtle'>
						Logout
					</button>
				)}
			</div>
		</footer>
	);
}

export default Footer;
