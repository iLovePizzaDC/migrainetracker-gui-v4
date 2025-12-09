import type { AppendMedicine } from "@/shared/types";

export const formatMedicine = (medicine: AppendMedicine[]) => {
    const abbreviations = medicine.flatMap(item => {

        return new Array(item.taken).fill(item.medicine.abbreviation);
    });

    return abbreviations.join(',');
}

export const formatEffectiveness = (medicine: AppendMedicine[]) => {
    let effectivenessString: string = ''

    medicine.map(({ taken, effectiveness }) => {
        for (let i = 0; i < (taken - effectiveness); i++) {
            effectivenessString += 'no,';
        }

        for (let i = 0; i < effectiveness; i++) {
            effectivenessString += 'yes,';
        }
    });

    return effectivenessString.slice(0, -1);
};
