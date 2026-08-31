import AreaChart from '@/features/chart-cards/components/atoms/card/AreaChart';
import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import PieChart from '@/features/chart-cards/components/atoms/card/PieChart';
import ContextMenu from '@/features/chart-cards/components/atoms/context-menu/ContextMenu';
import CardForm from '@/features/chart-cards/components/molecules/CardForm';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';
import { useChartData } from '@/features/chart-cards/hooks/use-chart-data';
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
			<div className='relative mb-4 grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-1'>
				<div aria-hidden='true' />

				<h2 className='truncate text-center text-sm font-medium tracking-wide text-white/80'>
					{title}
				</h2>

				<button
					ref={contextButtonRef}
					data-testid='context-button'
					onClick={toggleContext}
					className='icon-btn justify-self-end'
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
			</div>

			<div
				data-testid='chart-card-reveal'
				className={`
          grid min-w-0 overflow-hidden motion-reveal
          ${isEditing ? 'grid-rows-[0fr_1fr]' : 'grid-rows-[1fr_0fr]'}
	      `}
			>
				<div className='min-w-0 overflow-hidden'>
					<div className='chart-area'>
						{/* TODO set thresholdY danimcally based on mixed use (10) or without (15) */}
						{/* TODO add average line to areachart? */}
						{isLoading ? (
							<div
								data-testid='loading-skeleton'
								className='h-full w-full animate-pulse rounded-xl bg-white/5'
							/>
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
						<div className='mt-1 h-6 text-center'>
							<p className='text-sm font-medium tabular-nums text-white/70'>
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
				<div data-testid='card-form-wrapper' className='min-h-0 overflow-hidden px-0.5 pb-0.5 pt-1'>
					<CardForm
						key={JSON.stringify({
							index,
							title,
							cardType,
							chartType,
							filter,
							timeframeCount,
							timeframeUnit,
							isEditing,
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
		</CardShell>
	);
}

export default ChartCard;
