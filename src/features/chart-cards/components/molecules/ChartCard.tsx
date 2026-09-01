import AreaChart from '@/features/chart-cards/components/atoms/card/AreaChart';
import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import OverviewCardHeader from '@/features/chart-cards/components/atoms/card/OverviewCardHeader';
import PieChart from '@/features/chart-cards/components/atoms/card/PieChart';
import ContextMenu from '@/features/chart-cards/components/atoms/context-menu/ContextMenu';
import CardForm from '@/features/chart-cards/components/molecules/CardForm';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';
import { useChartData } from '@/features/chart-cards/hooks/use-chart-data';
import Skeleton from '@/shared/components/atoms/Skeleton';
import type { CardType, TimeFrameUnit } from '@/shared/types/card';
import type { ChartType } from '@/shared/types/chart';
import type { EventFilter } from '@/shared/types/event';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useCallback, useRef, useState } from 'react';
import type { CardSetup } from '@/features/chart-cards/types/card';
import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';
import { CARD_TYPES } from '@/shared/constants/chart-cards/cards';

interface IChartCard {
	index: number;
	title: string;
	cardType: CardType;
	chartType: ChartType;
	filter: EventFilter;
	timeframeCount: number;
	timeframeUnit: TimeFrameUnit;
}

function ChartCard({
	index,
	title,
	cardType,
	chartType,
	filter,
	timeframeCount,
	timeframeUnit,
}: IChartCard) {
	const contextButtonRef = useRef<HTMLButtonElement | null>(null);

	const { removeSetupByIndex, updateSetupByIndex } = useCardSetups();
	const { isLoading, areaData, pieData, currentPieValue, totalPieValue } = useChartData(
		cardType,
		chartType,
		filter,
		timeframeCount,
		timeframeUnit,
	);

	const [contextOpen, setContextOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const onEdit = useCallback(
		(setup: CardSetup) => {
			updateSetupByIndex(setup);
			setIsEditing(false);
		},
		[updateSetupByIndex],
	);

	const onRemove = useCallback(() => {
		removeSetupByIndex(index);
	}, [removeSetupByIndex, index]);

	const toggleContext = useCallback(() => setContextOpen((v) => !v), []);

	return (
		<CardShell>
			<OverviewCardHeader
				title={title}
				trailing={
					<>
						<button
							ref={contextButtonRef}
							data-testid='context-button'
							onClick={toggleContext}
							className='icon-btn'
							aria-label='Card options'
						>
							<EllipsisVerticalIcon />
						</button>

						<ContextMenu
							contextButtonRef={contextButtonRef}
							open={contextOpen}
							setOpen={setContextOpen}
							isEditing={isEditing}
							setIsEditing={setIsEditing}
							onRemoveClick={onRemove}
						/>
					</>
				}
			/>

			<div
				data-testid='chart-card-reveal'
				className={`grid min-w-0 overflow-hidden motion-reveal ${
					isEditing ? 'grid-rows-[minmax(0,0fr)_auto]' : 'grid-rows-[auto]'
				}`}
			>
				<div className='min-h-0 overflow-hidden'>
					<div className='chart-area'>
						{/* TODO set thresholdY danimcally based on mixed use (10) or without (15) */}
						{/* TODO add average line to areachart? */}
						{isLoading ? (
							<Skeleton data-testid='loading-skeleton' className='h-full w-full' />
						) : chartType === CHART_TYPES.AREA ? (
							<AreaChart
								data={areaData}
								showThresholdLine={cardType === CARD_TYPES.MOH}
								thresholdY={cardType === CARD_TYPES.MOH ? 10 : undefined}
							/>
						) : (
							<PieChart outerData={pieData} />
						)}
					</div>

					{!isLoading && chartType === CHART_TYPES.PIE && totalPieValue > 0 && (
						<div className='overview-card-footer'>
							<p className='card-footer-text'>
								{cardType !== CARD_TYPES.MEDICINE ? (
									<>
										{currentPieValue.toLocaleString('en-US')}/
										{totalPieValue.toLocaleString('en-US')}{' '}
										{cardType === CARD_TYPES.DURATION ? 'hours' : 'days'}
									</>
								) : (
									<>
										{currentPieValue.toLocaleString('en-US')} {'medicines'}
									</>
								)}
							</p>
						</div>
					)}
				</div>

				{isEditing && (
					<div data-testid='card-form-wrapper' className='min-h-0 overflow-hidden'>
						<div className='min-h-0 overflow-hidden pt-1'>
							<CardForm
								key={JSON.stringify({
									index,
									title,
									cardType,
									chartType,
									filter,
									timeframeCount,
									timeframeUnit,
								})}
								onButtonClick={onEdit}
								defaultIndex={index}
								defaultTitle={title}
								defaultCardType={cardType}
								defaultChartType={chartType}
								defaultFilter={filter}
								defaultCount={timeframeCount}
								defaultUnit={timeframeUnit}
							/>
						</div>
					</div>
				)}
			</div>
		</CardShell>
	);
}

export default ChartCard;
