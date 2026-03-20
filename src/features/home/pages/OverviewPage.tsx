import CardSection from '@/features/home/components/organisms/CardSection';
import { CardSetupsProvider } from '@/features/home/hooks/card-setups-provider';
import { useAuthCheck } from '@/shared/auth/use-auth-check';
import { useUser } from '@/shared/hooks/user/use-user';

function OverviewPage() {
	const { user, setUser } = useUser();
	useAuthCheck(user, setUser);

	return (
		<div className='w-full'>
			<CardSetupsProvider>
				<div className='max-w-6xl mx-auto'>
					<CardSection />
				</div>
			</CardSetupsProvider>
		</div>
	);
}

export default OverviewPage;
