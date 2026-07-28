import CardSection from '@/features/home/components/organisms/CardSection';
import { CardSetupsProvider } from '@/features/home/hooks/card-setups-provider';

function OverviewPage() {
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
