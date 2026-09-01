import type { ReactNode } from 'react';

interface IOverviewCardHeader {
	title: string;
	align?: 'center' | 'left';
	trailing?: ReactNode;
}

function OverviewCardHeader({ title, align = 'center', trailing }: IOverviewCardHeader) {
	if (align === 'left') {
		return (
			<div className='overview-card-header--left'>
				<h2 className='card-title min-w-0 flex-1'>{title}</h2>
				{trailing}
			</div>
		);
	}

	return (
		<div className='overview-card-header relative'>
			<div aria-hidden='true' />
			<h2 className='card-title text-center'>{title}</h2>
			{trailing && <div className='justify-self-end'>{trailing}</div>}
		</div>
	);
}

export default OverviewCardHeader;
