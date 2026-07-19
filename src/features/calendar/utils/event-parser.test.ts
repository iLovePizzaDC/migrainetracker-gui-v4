import type { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import type { MigraineEvent } from '@/features/calendar/types/event';
import {
  createEntry,
  enrichMedicineLabels,
  parseMedicineData,
  parseMigraineEventDescription,
  parseProphylaxisEventDescription,
} from '@/features/calendar/utils/event-parser';
import { INTENSITY_TYPES, SYMPTOM_TYPES } from '@/shared/constants/event/event-details';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { parseDecimalToTime } from '@/shared/utils/date/date';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/date/date', () => ({
  parseDecimalToTime: vi.fn((n: number) => `${n}:00`),
}));

const mockUserMedicineOptions = [
  { value: MEDICINE_TYPES.MIGRAINE_PAINKILLER, label: 'Test medicine 1' },
  { value: MEDICINE_TYPES.PAINKILLER, label: 'Test medicine 2' },
];

const makeEvent = (overrides: Partial<MigraineEvent['description']> = {}): MigraineEvent => ({
  date: new Date('2026-01-01'),
  strength: 200 as keyof typeof STRENGTH_MAP,
  description: {
    duration: [{ start: 10, end: 15 }],
    intensity: INTENSITY_TYPES.HIGH,
    symptoms: [SYMPTOM_TYPES.NOISE],
    medicine: 'med_a,med_b',
    effectiveness: ['yes', 'no'],
    midas: {
      workMissed: true,
      workImpaired: false,
      choresMissed: false,
      choresImpaired: false,
      socialMissed: false,
    },
    ...overrides,
  },
});

describe('parseMigraineEventDescription', () => {
  it('parses a valid object description', () => {
    const result = parseMigraineEventDescription({
      description: { intensity: INTENSITY_TYPES.HIGH, symptoms: [SYMPTOM_TYPES.NOISE] },
    } as any);

    expect(result).toEqual({ intensity: INTENSITY_TYPES.HIGH, symptoms: [SYMPTOM_TYPES.NOISE] });
  });

  it('parses a JSON string description', () => {
    const result = parseMigraineEventDescription({
      description: JSON.stringify({ intensity: INTENSITY_TYPES.LOW }),
    } as any);

    expect(result).toEqual({ intensity: INTENSITY_TYPES.LOW });
  });

  it('splits effectiveness string into array', () => {
    const result = parseMigraineEventDescription({
      description: { effectiveness: 'yes,no,yes' },
    } as any);

    expect(result?.effectiveness).toEqual(['yes', 'no', 'yes']);
  });

  it('leaves effectiveness array unchanged', () => {
    const result = parseMigraineEventDescription({
      description: { effectiveness: ['yes', 'no'] },
    } as any);

    expect(result?.effectiveness).toEqual(['yes', 'no']);
  });

  it('splits symptoms string into trimmed array', () => {
    const result = parseMigraineEventDescription({
      description: { symptoms: 'noi, lig , sme' },
    } as any);

    expect(result?.symptoms).toEqual(['noi', 'lig', 'sme']);
  });

  it('leaves symptoms array unchanged', () => {
    const result = parseMigraineEventDescription({
      description: { symptoms: [SYMPTOM_TYPES.NOISE] },
    } as any);

    expect(result?.symptoms).toEqual([SYMPTOM_TYPES.NOISE]);
  });

  it('returns null when description is invalid JSON', () => {
    const result = parseMigraineEventDescription({
      description: '{ invalid json',
    } as any);

    expect(result).toBeNull();
  });

  it('returns null when description is null', () => {
    const result = parseMigraineEventDescription({ description: null } as any);

    expect(result).toBeNull();
  });
});

describe('parseProphylaxisEventDescription', () => {
  it('parses a valid object description', () => {
    const result = parseProphylaxisEventDescription({
      description: { summary: 'Botox' },
    } as any);

    expect(result).toEqual({ summary: 'Botox' });
  });

  it('parses a JSON string description', () => {
    const result = parseProphylaxisEventDescription({
      description: JSON.stringify({ summary: 'Botox' }),
    } as any);

    expect(result).toEqual({ summary: 'Botox' });
  });

  it('returns null when description is invalid JSON', () => {
    const result = parseProphylaxisEventDescription({
      description: '{ invalid json',
    } as any);

    expect(result).toBeNull();
  });

  it('returns null when description is null', () => {
    const result = parseProphylaxisEventDescription({ description: null } as any);

    expect(result).toBeNull();
  });

  it('does not perform migraine-specific transformations', () => {
    const result = parseProphylaxisEventDescription({
      description: { effectiveness: 'yes,no', symptoms: 'noise, light' },
    } as any);

    expect(result).toEqual({ effectiveness: 'yes,no', symptoms: 'noise, light' });
  });
});

describe('parseMedicineData', () => {
  it('maps a single medicine entry correctly', () => {
    const result = parseMedicineData('med_a', ['yes']);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      medicine: { abbreviation: 'med_a', label: 'MED_A' },
      taken: 1,
      effectiveness: 1,
    });
  });

  it('counts taken correctly for repeated medicine', () => {
    const result = parseMedicineData('med_a,med_a', ['yes', 'no']);

    expect(result).toHaveLength(1);
    expect(result[0].taken).toBe(2);
    expect(result[0].effectiveness).toBe(1);
  });

  it('handles multiple distinct medicines', () => {
    const result = parseMedicineData('med_a,med_b', ['yes', 'no']);

    expect(result).toHaveLength(2);
    expect(result.find((m) => m.medicine.abbreviation === 'med_a')?.effectiveness).toBe(1);
    expect(result.find((m) => m.medicine.abbreviation === 'med_b')?.effectiveness).toBe(0);
  });

  it('ignores empty entries from trailing commas', () => {
    const result = parseMedicineData('med_a,', ['yes']);

    expect(result).toHaveLength(1);
  });

  it('returns empty array for empty medicine string', () => {
    const result = parseMedicineData('', []);

    expect(result).toEqual([]);
  });

  it('sets label to uppercase abbreviation', () => {
    const result = parseMedicineData('ibu', []);

    expect(result[0].medicine.label).toBe('IBU');
  });
});

describe('createEntry', () => {
  it('maps duration using parseDecimalToTime', () => {
    const result = createEntry(makeEvent());

    expect(parseDecimalToTime).toHaveBeenCalledWith(10);
    expect(parseDecimalToTime).toHaveBeenCalledWith(15);
    expect(result.durations[0]).toEqual({ id: 0, startTime: '10:00', endTime: '15:00' });
  });

  it('assigns sequential ids to durations', () => {
    const event = makeEvent({
      duration: [
        { start: 1, end: 2 },
        { start: 3, end: 4 },
      ],
    });
    const result = createEntry(event);

    expect(result.durations[0].id).toBe(0);
    expect(result.durations[1].id).toBe(1);
  });

  it('maps intensity and symptoms from description', () => {
    const result = createEntry(makeEvent());

    expect(result.intensity).toBe(INTENSITY_TYPES.HIGH);
    expect(result.symptoms).toEqual([SYMPTOM_TYPES.NOISE]);
  });

  it('maps medicine and effectiveness via parseMedicineData', () => {
    const result = createEntry(makeEvent());

    expect(result.medicines).toHaveLength(2);
    expect(result.medicines[0].medicine.abbreviation).toBe('med_a');
    expect(result.medicines[1].medicine.abbreviation).toBe('med_b');
  });

  it('uses midas from description when present', () => {
    const result = createEntry(makeEvent());

    expect(result.midas.workMissed).toBe(true);
  });

  it('falls back to all-false midas when description.midas is null', () => {
    const event = makeEvent({ midas: undefined });
    const result = createEntry(event);

    expect(result.midas).toEqual({
      workMissed: false,
      workImpaired: false,
      choresMissed: false,
      choresImpaired: false,
      socialMissed: false,
    });
  });
});

describe('enrichMedicineLabels', () => {
  it('returns empty array when medicines is empty', () => {
    const result = enrichMedicineLabels([], mockUserMedicineOptions);

    expect(result).toEqual([]);
  });

  it('enriches label when abbreviation and label are equal', () => {
    const medicines = [
      {
        medicine: {
          abbreviation: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
          label: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
        },
      },
    ] as any;

    const result = enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(result[0].medicine.label).toBe('Test medicine 1');
  });

  it('does not enrich label when abbreviation and label differ', () => {
    const medicines = [
      { medicine: { abbreviation: MEDICINE_TYPES.MIGRAINE_PAINKILLER, label: 'Test medicine 1' } },
    ] as any;

    const result = enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(result[0].medicine.label).toBe('Test medicine 1');
  });

  it('does not enrich label when no matching option is found', () => {
    const medicines = [{ medicine: { abbreviation: 'xyz', label: 'xyz' } }] as any;

    const result = enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(result[0].medicine.label).toBe('xyz');
  });

  it('is case-insensitive when matching', () => {
    const medicines = [
      {
        medicine: {
          abbreviation: MEDICINE_TYPES.MIGRAINE_PAINKILLER.toUpperCase(),
          label: MEDICINE_TYPES.MIGRAINE_PAINKILLER.toUpperCase(),
        },
      },
    ] as any;

    const result = enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(result[0].medicine.label).toBe('Test medicine 1');
  });

  it('enriches only matching medicines and leaves others unchanged', () => {
    const medicines = [
      {
        medicine: {
          abbreviation: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
          label: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
        },
      },
      { medicine: { abbreviation: 'xyz', label: 'xyz' } },
    ] as any;

    const result = enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(result[0].medicine.label).toBe('Test medicine 1');
    expect(result[1].medicine.label).toBe('xyz');
  });

  it('does not mutate the original medicines array', () => {
    const medicines = [
      {
        medicine: {
          abbreviation: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
          label: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
        },
      },
    ] as any;

    enrichMedicineLabels(medicines, mockUserMedicineOptions);

    expect(medicines[0].medicine.label).toBe(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
  });
});
