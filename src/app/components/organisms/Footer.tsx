import { fetchUserLogout } from '@/shared/api/user.api';
import { useUser } from '@/shared/hooks/use-user';

function Footer() {
	const { user } = useUser();

	const logout = async () => {
		await fetchUserLogout();
	};

	return (
		<footer className='mt-auto w-full shrink-0 border-t border-white/[0.06] bg-black/20 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl'>
			<div className='page-padding-x mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 py-3 sm:flex-row'>
				<span className='text-xs text-white/35'>MigraineTracker – Luna</span>
				<nav
					aria-label='Legal'
					className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1'
				>
					<a href='/impressum' className='link-subtle'>
						Impressum
					</a>
					<a href='/datenschutz' className='link-subtle'>
						Datenschutz
					</a>
					<a href='/privacy' className='link-subtle'>
						Privacy Policy
					</a>
					{user && (
						<button type='button' onClick={logout} className='link-subtle'>
							Logout
						</button>
					)}
				</nav>
			</div>
		</footer>
	);
}

export default Footer;
