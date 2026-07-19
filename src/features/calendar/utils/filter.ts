import type { MigraineDescription, MigraineEvent } from '@/features/calendar/types/event';
import { ANY_FILTER_TYPE, EFFECTIVENESS_TYPES } from '@/shared/constants/event/event-details';
import type { EventFilter } from '@/shared/types/event/event';

function getEventMedicines(medicine: string): string[] {
  return medicine
    .split(',')
    .map((m) => m.trim().toLowerCase())
    .filter(Boolean);
}

function matchesIntensity(description: MigraineDescription, filter: EventFilter): boolean {
  if (!filter.intensity) return true;
  return description.intensity === filter.intensity;
}

function matchesSymptoms(description: MigraineDescription, filter: EventFilter): boolean {
  if (filter.symptom.length === 0) return true;

  return filter.symptom.every((symptom) => {
    if (symptom === ANY_FILTER_TYPE.ANY) {
      return description.symptoms.length > 0;
    }
    return description.symptoms.includes(symptom);
  });
}

function matchesMedicine(eventMedicines: string[], filter: EventFilter): boolean {
  if (filter.medicine.length === 0) return true;

  const allowedMedicines = filter.medicine.map((m) => m.abbreviation.toLowerCase());

  return allowedMedicines.every((med) => {
    if (med === ANY_FILTER_TYPE.ANY) {
      return eventMedicines.length > 0;
    }
    return eventMedicines.includes(med);
  });
}

function matchesEffectiveness(
  description: MigraineDescription,
  eventMedicines: string[],
  filter: EventFilter,
): boolean {
  if (!filter.effectiveness) return true;

  const allowedMedicines = filter.medicine.map((m) => m.abbreviation.toLowerCase());
  const filtersSpecificMedicine =
    allowedMedicines.length > 0 && !allowedMedicines.includes(ANY_FILTER_TYPE.ANY);

  if (filtersSpecificMedicine) {
    return allowedMedicines.every((med) => {
      const index = eventMedicines.indexOf(med);
      if (index === -1) return false;
      return description.effectiveness[index] === filter.effectiveness;
    });
  }

  if (filter.effectiveness === EFFECTIVENESS_TYPES.EFFECTIVE) {
    return description.effectiveness.includes(EFFECTIVENESS_TYPES.EFFECTIVE);
  }
  if (filter.effectiveness === EFFECTIVENESS_TYPES.INEFFECTIVE) {
    return description.effectiveness.includes(EFFECTIVENESS_TYPES.INEFFECTIVE);
  }

  return true;
}

function matchesMidas(description: MigraineDescription, filter: EventFilter): boolean {
  if (filter.midas.length === 0) return true;

  return filter.midas.every((key) => {
    if (key === ANY_FILTER_TYPE.ANY) return true;
    return description.midas[key];
  });
}

export function filterEvents(parsedEvent: MigraineEvent, filter: EventFilter) {
  const { description } = parsedEvent;
  const eventMedicines = getEventMedicines(description.medicine);

  return (
    matchesIntensity(description, filter) &&
    matchesSymptoms(description, filter) &&
    matchesMedicine(eventMedicines, filter) &&
    matchesEffectiveness(description, eventMedicines, filter) &&
    matchesMidas(description, filter)
  );
}

export const isDefaultFilter = (filter: EventFilter) => {
  return (
    filter.intensity === null &&
    filter.symptom.length === 0 &&
    filter.medicine.length === 0 &&
    filter.effectiveness === null &&
    filter.midas.length === 0
  );
};
