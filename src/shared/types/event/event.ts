import type {
  AnyFilterType,
  AnyInputFilterType,
  EffectivenessType,
  IntensityType,
  MidasType,
  SymptomType,
} from '@/shared/constants/event/event-details';
import type { InputContent } from '@/shared/types/calendar/calendar';

export type EventFilter = {
  intensity: IntensityType | null;
  symptom: (SymptomType | AnyFilterType)[];
  medicine: (InputContent | AnyInputFilterType)[];
  effectiveness: EffectivenessType | null;
  midas: (MidasType | AnyFilterType)[];
};
