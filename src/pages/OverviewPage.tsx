import CardSection from '@/features/chart-cards/components/organisms/CardSection';
import { CardSetupsProvider } from '@/features/chart-cards/hooks/card-setups-provider';

function OverviewPage() {
	return (
		<div className='w-full'>
			<header className='mb-6 text-left sm:mb-8'>
				<h1 className='page-heading'>Overview</h1>
				<p className='page-subheading'>Your migraine patterns at a glance.</p>
			</header>
			<CardSetupsProvider>
				<CardSection />
			</CardSetupsProvider>
		</div>
	);
}

export default OverviewPage;
