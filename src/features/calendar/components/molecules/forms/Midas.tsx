import { MIDAS_OPTIONS, type MidasType } from '@/shared/constants/event/event-details';
import { SELECT_TYPES } from '@/shared/constants/input/select';
import type { AppendMidas } from '@/shared/types/calendar';
import SelectInput from '@/features/calendar/components/atoms/inputs/SelectInput';

interface IMidas {
	midas: AppendMidas;
	onChange: (midas: AppendMidas) => void;
	disabled?: boolean;
}

function Midas({ midas, onChange, disabled = false }: IMidas) {
	return (
		<div
			data-testid='midas'
			className='self-start p-4 rounded-xl bg-white/5 border border-white/10'
		>
			<h3 className='text-sm font-medium text-purple-300 mb-2'>MIDAS</h3>

			<SelectInput
				id='midas'
				type={SELECT_TYPES.CHECKBOX}
				options={MIDAS_OPTIONS}
				value={Object.entries(midas)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					.filter(([_, checked]) => checked)
					.map(([key]) => key as MidasType)}
				onChange={(event) => {
					const key = event.target.value as MidasType;

					onChange({
						...midas,
						[key]: event.target.checked,
					});
				}}
				disabled={disabled}
			/>
		</div>
	);
}

export default Midas;
