import Symptoms from '@/features/calendar/components/molecules/Symptoms';
import { SYMPTOM_TYPES } from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockSetSymptoms = vi.fn();

describe('<Symptoms />', () => {
  const user = userEvent.setup();

  it('renders the heading', () => {
    render(<Symptoms symptoms={[]} setSymptoms={mockSetSymptoms} />);

    expect(screen.getByText('Symptoms')).toBeInTheDocument();
  });

  it('renders pre checked symptoms', () => {
    render(
      <Symptoms
        symptoms={[SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT]}
        setSymptoms={mockSetSymptoms}
      />,
    );

    expect(screen.getByLabelText('Noise Sensitive')).toBeChecked();
    expect(screen.getByLabelText('Light Sensitive')).toBeChecked();
    expect(screen.getByLabelText('Smell Sensitive')).not.toBeChecked();
    expect(screen.getByLabelText('Vision Problems')).not.toBeChecked();
    expect(screen.getByLabelText('Dizzy')).not.toBeChecked();
    expect(screen.getByLabelText('Nausea')).not.toBeChecked();
    expect(screen.getByLabelText('Vomit')).not.toBeChecked();
    expect(screen.getByLabelText('Neck Pain')).not.toBeChecked();
    expect(screen.getByLabelText('Jaw Pain')).not.toBeChecked();
  });

  it('adds symptom when clicking unchecked option', async () => {
    render(<Symptoms symptoms={[]} setSymptoms={mockSetSymptoms} />);

    await user.click(screen.getByLabelText('Noise Sensitive'));

    expect(mockSetSymptoms).toHaveBeenCalled();

    const updater = mockSetSymptoms.mock.calls[0][0];
    expect(updater([])).toEqual([SYMPTOM_TYPES.NOISE]);
  });

  it('removes symptom when clicking checked option', async () => {
    render(<Symptoms symptoms={[SYMPTOM_TYPES.NOISE]} setSymptoms={mockSetSymptoms} />);

    await user.click(screen.getByLabelText('Noise Sensitive'));

    expect(mockSetSymptoms).toHaveBeenCalled();

    const updater = mockSetSymptoms.mock.calls[0][0];
    expect(updater([])).toEqual([SYMPTOM_TYPES.NOISE]);
  });

  it('is disabled if prop is true', () => {
    render(<Symptoms symptoms={[]} setSymptoms={mockSetSymptoms} disabled />);

    expect(screen.getByLabelText('Noise Sensitive')).toBeDisabled();
    expect(screen.getByLabelText('Light Sensitive')).toBeDisabled();
    expect(screen.getByLabelText('Smell Sensitive')).toBeDisabled();
    expect(screen.getByLabelText('Light Sensitive')).toBeDisabled();
    expect(screen.getByLabelText('Vision Problems')).toBeDisabled();
    expect(screen.getByLabelText('Dizzy')).toBeDisabled();
    expect(screen.getByLabelText('Nausea')).toBeDisabled();
    expect(screen.getByLabelText('Vomit')).toBeDisabled();
    expect(screen.getByLabelText('Neck Pain')).toBeDisabled();
    expect(screen.getByLabelText('Jaw Pain')).toBeDisabled();
  });
});
