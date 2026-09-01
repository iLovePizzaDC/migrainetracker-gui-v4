import CardSection from '@/features/chart-cards/components/organisms/CardSection';
import { CardSetupsProvider } from '@/features/chart-cards/hooks/card-setups-provider';

function OverviewPage() {
	return (
		<div className='min-w-0 w-full'>
			<header className='page-header'>
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
