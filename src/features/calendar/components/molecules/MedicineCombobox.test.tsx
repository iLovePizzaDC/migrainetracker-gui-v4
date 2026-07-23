import MedicineCombobox from '@/features/calendar/components/molecules/MedicineCombobox';
import { fetchUserMedicinesDelete } from '@/shared/api/medicine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useUser } from '@/shared/hooks/user/use-user';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';
const mockUserMedicines = [
  {
    name: `${mockMedLabel} 1`,
    abbreviation: `${mockMedValue}_1`,
    type: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
  },
  {
    name: `${mockMedLabel} 2`,
    abbreviation: `${mockMedValue}_2`,
    type: MEDICINE_TYPES.PAINKILLER,
  },
];

vi.mock('@/shared/hooks/user/use-user');
vi.mock('@/shared/hooks/use-click-outside');
vi.mock('@/shared/api/medicine.api');
vi.mock('@/shared/components/atoms/Combobox', () => ({
  default: vi.fn(({ selected, onChange, renderOptionActions, disabled }: any) => {
    const firstOption = { label: `${mockMedLabel} 1`, value: `${mockMedValue}_1` };
    const secondOption = { label: `${mockMedLabel} 2`, value: `${mockMedValue}_2` };

    return (
      <div data-testid='combobox'>
        <div data-testid='selected-medicines'>
          {selected.map((option: any) => (
            <span key={option.value} data-testid={`selected-${option.value}`}>
              {option.label}
            </span>
          ))}
        </div>
        <div data-testid='option-actions'>{renderOptionActions?.(firstOption)}</div>
        <button data-testid='change-selection-btn' onClick={() => onChange([firstOption])}>
          Select Medicine 1
        </button>
        <button
          data-testid='select-both-btn'
          onClick={() => onChange([firstOption, secondOption])}
        >
          Select Medicine 1 and 2
        </button>
        {disabled && <span data-testid='disabled-indicator' />}
      </div>
    );
  }),
}));

const mockMedicines = [
  {
    medicine: {
      abbreviation: `${mockMedValue}_1`,
      label: `${mockMedLabel} 1`,
    },
    taken: 1,
    effectiveness: 0,
  },
  {
    medicine: {
      abbreviation: `${mockMedValue}_2`,
      label: `${mockMedLabel} 2`,
    },
    taken: 2,
    effectiveness: 2,
  },
];

describe('<MedicineCombobox />', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({
      medicines: mockUserMedicines,
      removeMedicine: vi.fn(),
    } as any);

    vi.mocked(useClickOutside).mockImplementation(() => { });
    vi.mocked(fetchUserMedicinesDelete).mockResolvedValue([]);

    vi.clearAllMocks();
  });

  it('renders pre-selected medicines', () => {
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    expect(screen.getByTestId(`selected-${mockMedValue}_1`)).toBeInTheDocument();
    expect(screen.getByTestId(`selected-${mockMedValue}_2`)).toBeInTheDocument();
  });

  it('calls setMedicines with correct structure when selecting', async () => {
    const mockSetMedicines = vi.fn();
    render(<MedicineCombobox medicines={[]} setMedicines={mockSetMedicines} />);

    await user.click(screen.getByTestId('change-selection-btn'));

    expect(mockSetMedicines).toHaveBeenCalledWith([
      {
        medicine: { label: `${mockMedLabel} 1`, abbreviation: `${mockMedValue}_1` },
        taken: 1,
        effectiveness: 0,
      },
    ]);
  });

  it('preserves taken and effectiveness for medicines that remain selected', async () => {
    const customMedicines = [
      {
        medicine: {
          abbreviation: `${mockMedValue}_1`,
          label: `${mockMedLabel} 1`,
        },
        taken: 4,
        effectiveness: 3,
      },
    ];
    const mockSetMedicines = vi.fn();
    render(<MedicineCombobox medicines={customMedicines} setMedicines={mockSetMedicines} />);

    await user.click(screen.getByTestId('change-selection-btn'));

    expect(mockSetMedicines).toHaveBeenCalledWith(customMedicines);
  });

  it('keeps existing values while defaulting newly added medicines', async () => {
    const customMedicines = [
      {
        medicine: {
          abbreviation: `${mockMedValue}_1`,
          label: `${mockMedLabel} 1`,
        },
        taken: 4,
        effectiveness: 3,
      },
    ];
    const mockSetMedicines = vi.fn();
    render(<MedicineCombobox medicines={customMedicines} setMedicines={mockSetMedicines} />);

    await user.click(screen.getByTestId('select-both-btn'));

    expect(mockSetMedicines).toHaveBeenCalledWith([
      customMedicines[0],
      {
        medicine: { label: `${mockMedLabel} 2`, abbreviation: `${mockMedValue}_2` },
        taken: 1,
        effectiveness: 0,
      },
    ]);
  });

  it('resets deletion confirmation when changing selection', async () => {
    const mockSetMedicines = vi.fn();
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={mockSetMedicines} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });
    await user.click(deleteBtn);

    expect(screen.getByTestId('confirm-icon')).toBeInTheDocument();

    await user.click(screen.getByTestId('change-selection-btn'));

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('confirm-icon')).not.toBeInTheDocument();
  });

  it('shows trash icon by default', () => {
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('shows confirm icon after clicking trash icon', async () => {
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });
    await user.click(deleteBtn);

    expect(screen.getByTestId('confirm-icon')).toBeInTheDocument();
  });

  it('deletes medicine after confirming deletion', async () => {
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });

    await user.click(deleteBtn);
    expect(screen.getByTestId('confirm-icon')).toBeInTheDocument();

    await user.click(deleteBtn);

    const mockUseUserResult = vi.mocked(useUser).mock.results[0].value;
    expect(mockUseUserResult.removeMedicine).toHaveBeenCalledWith(`${mockMedValue}_1`);
    expect(vi.mocked(fetchUserMedicinesDelete)).toHaveBeenCalledWith(
      `${mockMedLabel} 1`,
      `${mockMedValue}_1`,
    );
  });

  it('handles delete error gracefully', async () => {
    vi.mocked(fetchUserMedicinesDelete).mockRejectedValueOnce(new Error('Delete failed'));

    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });

    await user.click(deleteBtn);
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(vi.mocked(fetchUserMedicinesDelete)).toHaveBeenCalled();
    });

    const mockUseUserResult = vi.mocked(useUser).mock.results[0].value;
    expect(mockUseUserResult.removeMedicine).toHaveBeenCalledWith(`${mockMedValue}_1`);
  });

  it('disables delete button while deleting', async () => {
    vi.mocked(fetchUserMedicinesDelete).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });

    await user.click(deleteBtn);
    await user.click(deleteBtn);

    expect(deleteBtn).toBeDisabled();

    await waitFor(() => {
      expect(deleteBtn).not.toBeDisabled();
    });
  });

  it('closes deletion confirmation when clicking outside', () => {
    render(<MedicineCombobox medicines={mockMedicines} setMedicines={vi.fn()} />);

    const mockUseClickOutsideCall = vi.mocked(useClickOutside).mock.calls[0];
    const callback = mockUseClickOutsideCall[1];

    const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });

    userEvent.click(deleteBtn);
    callback();

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('disables combobox when disabled prop is true', () => {
    render(<MedicineCombobox medicines={[]} setMedicines={vi.fn()} disabled={true} />);

    expect(screen.getByTestId('disabled-indicator')).toBeInTheDocument();
  });
});
