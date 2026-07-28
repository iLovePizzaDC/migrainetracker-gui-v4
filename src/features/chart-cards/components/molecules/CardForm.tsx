import Input from '@/features/chart-cards/components/atoms/inputs/Input';
import { CARD_OPTIONS } from '@/features/chart-cards/constants/card';
import { CHART_OPTIONS } from '@/features/chart-cards/constants/chart';
import { TIME_FRAME_UNIT_OPTIONS } from '@/features/chart-cards/constants/time-frame';
import { useCardForm } from '@/features/chart-cards/hooks/use-card-form';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';
import DropdownInput from '@/shared/components/atoms/DropdownInput';
import SubmitButton from '@/shared/components/atoms/SubmitButton';
import FilterForm from '@/shared/components/molecules/FilterForm';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import { INPUT_TYPES } from '@/shared/constants/input/input';
import { FILTER_FORM_VARIANTS } from '@/shared/constants/variants/filter-form';
import type { EventFilter } from '@/shared/types/event';
import type { CardSetup } from '@/features/chart-cards/types/card';
import type { ChartType } from '@/shared/types/chart';
import type { CardType, TimeFrameUnit } from '@/shared/types/card';
import { CARD_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';

interface ICardForm {
	onButtonClick: (setup: CardSetup) => void;
	defaultIndex?: number;
	defaultTitle?: string;
	defaultCardType?: CardType;
	defaultChartType?: ChartType;
	defaultFilter?: EventFilter;
	defaultCount?: number;
	defaultUnit?: TimeFrameUnit;
}

function CardForm({
	onButtonClick,
	defaultIndex,
	defaultTitle = '',
	defaultCardType = CARD_TYPES.MIGRAINE,
	defaultChartType = CHART_TYPES.AREA,
	defaultFilter = {
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	},
	defaultCount = 12,
	defaultUnit = TIME_FRAME_UNITS.MONTHS,
}: ICardForm) {
	const { cardSetups } = useCardSetups();
	const {
		form,
		setTitle,
		setCardType,
		setChartType,
		setCount,
		setUnit,
		setFilter,
		reset,
		buildSetup,
	} = useCardForm({
		title: defaultTitle,
		cardType: defaultCardType,
		chartType: defaultChartType,
		filter: defaultFilter,
		count: defaultCount,
		unit: defaultUnit,
	});

	const onSubmit = () => {
		onButtonClick(buildSetup(defaultIndex ?? cardSetups.length));
		reset();
	};

	return (
		<form
			className='space-y-5'
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<Input
				id='appendTitle'
				label='Title'
				type={INPUT_TYPES.TEXT}
				value={form.title}
				onChange={(event) => setTitle(event.target.value)}
				placeholder='Enter a title'
				required
			/>
			<div className='grid gap-6 lg:grid-cols-2'>
				<DropdownInput
					id='appendCardType'
					label='Card Type'
					value={form.cardType}
					options={CARD_OPTIONS}
					onChange={(value) => setCardType(value as CardType)}
					required
				/>

				<DropdownInput
					id='appendChartType'
					label='Chart Type'
					value={form.chartType}
					options={CHART_OPTIONS}
					onChange={(value) => setChartType(value as ChartType)}
					required
				/>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
					<Input
						id='appendValue'
						label='Value'
						type={INPUT_TYPES.NUMBER}
						value={form.timeframe.count.toString()}
						onChange={(event) => setCount(Number(event.target.value))}
						placeholder='Enter number'
						required
					/>

					<DropdownInput
						id='appendUnit'
						label='Unit'
						value={form.timeframe.unit}
						options={TIME_FRAME_UNIT_OPTIONS}
						onChange={(value) => setUnit(value as TimeFrameUnit)}
						required
					/>
				</div>
			</div>

			<FilterForm
				variant={FILTER_FORM_VARIANTS.STANDARD}
				filter={form.filter}
				setFilter={setFilter}
				medicineInputVisible={form.cardType !== CARD_TYPES.MOH}
				midasInputVisible={false}
			/>

			<SubmitButton type={BUTTON_TYPES.SUBMIT} label='Submit' />
		</form>
	);
}

export default CardForm;
