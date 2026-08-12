import type { AppendMedicine } from '@/shared/types/calendar';

export const formatMedicine = (medicine: AppendMedicine[]) => {
	const abbreviations = medicine.flatMap((item) => {
		return new Array(item.taken).fill(item.medicine.abbreviation);
	});

	return abbreviations.join(',');
};

export const formatEffectiveness = (medicine: AppendMedicine[]) => {
	let effectivenessString: string = '';

	medicine.map(({ taken, effectiveness }) => {
		const clampedEffectiveness = Math.max(0, Math.min(effectiveness, taken));

		for (let i = 0; i < taken - clampedEffectiveness; i++) {
			effectivenessString += 'no,';
		}

		for (let i = 0; i < clampedEffectiveness; i++) {
			effectivenessString += 'yes,';
		}
	});

	return effectivenessString.slice(0, -1);
};
