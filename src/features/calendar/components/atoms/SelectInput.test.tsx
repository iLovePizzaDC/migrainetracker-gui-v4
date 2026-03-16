import { SELECT_TYPES } from '@/shared/constants/input/select';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SelectInput from './SelectInput';

const onChange = vi.fn();

const optionsMock = [
	{
		label: 'test label 1',
		value: 'test_value_1',
	},
	{
		label: 'test label 2',
		value: 'test_value_2',
	},
	{
		label: 'test label 3',
		value: 'test_value_3',
	},
];

describe('<SelectInput />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		onChange.mockClear();
	});

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'renders label and options for type %s',
		(type) => {
			render(<SelectInput id='select' type={type} options={optionsMock} onChange={onChange} />);

			expect(screen.getByLabelText('test label 1')).toBeInTheDocument();
			expect(screen.getByLabelText('test label 2')).toBeInTheDocument();
			expect(screen.getByLabelText('test label 3')).toBeInTheDocument();
		},
	);

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'renders options with correct values for type %s',
		(type) => {
			render(<SelectInput id='select' type={type} options={optionsMock} onChange={onChange} />);

			expect(screen.getByRole(type, { name: 'test label 1' })).toHaveAttribute(
				'value',
				'test_value_1',
			);
			expect(screen.getByRole(type, { name: 'test label 2' })).toHaveAttribute(
				'value',
				'test_value_2',
			);
			expect(screen.getByRole(type, { name: 'test label 3' })).toHaveAttribute(
				'value',
				'test_value_3',
			);
		},
	);

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'calls onChange when clicking an option for type %s',
		async (type) => {
			render(<SelectInput id='select' type={type} options={optionsMock} onChange={onChange} />);

			await user.click(screen.getByLabelText('test label 2'));

			expect(onChange).toHaveBeenCalled();
		},
	);

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'renders label if provided for type %s',
		(type) => {
			render(
				<SelectInput
					id='select'
					type={type}
					options={optionsMock}
					onChange={onChange}
					label='Select'
				/>,
			);

			expect(screen.getByText('Select')).toBeInTheDocument();
		},
	);

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'is disabled if prop is true for type %s',
		(type) => {
			render(
				<SelectInput id='select' type={type} options={optionsMock} onChange={onChange} disabled />,
			);

			expect(screen.getByLabelText('test label 1')).toBeDisabled();
			expect(screen.getByLabelText('test label 2')).toBeDisabled();
			expect(screen.getByLabelText('test label 3')).toBeDisabled();
		},
	);

	it.each([SELECT_TYPES.RADIO, SELECT_TYPES.CHECKBOX])(
		'is required if prop is true for type %s',
		(type) => {
			render(
				<SelectInput id='select' type={type} options={optionsMock} onChange={onChange} required />,
			);

			expect(screen.getByLabelText('test label 1')).toBeRequired();
			expect(screen.getByLabelText('test label 2')).toBeRequired();
			expect(screen.getByLabelText('test label 3')).toBeRequired();
		},
	);

	describe('checkbox select', () => {
		it('renders one pre-checked option', () => {
			render(
				<SelectInput
					id='select'
					type={SELECT_TYPES.CHECKBOX}
					options={optionsMock}
					onChange={onChange}
					value={['test_value_1']}
				/>,
			);

			expect(screen.getByLabelText('test label 1')).toBeChecked();
			expect(screen.getByLabelText('test label 2')).not.toBeChecked();
			expect(screen.getByLabelText('test label 3')).not.toBeChecked();
		});

		it('renders pre-checked options with multiple values', () => {
			render(
				<SelectInput
					id='select'
					type={SELECT_TYPES.CHECKBOX}
					options={optionsMock}
					onChange={onChange}
					value={['test_value_1', 'test_value_2']}
				/>,
			);

			expect(screen.getByLabelText('test label 1')).toBeChecked();
			expect(screen.getByLabelText('test label 2')).toBeChecked();
			expect(screen.getByLabelText('test label 3')).not.toBeChecked();
		});
	});

	describe('radio select', () => {
		it('renders one pre-checked option', () => {
			render(
				<SelectInput
					id='select'
					type={SELECT_TYPES.RADIO}
					options={optionsMock}
					onChange={onChange}
					value='test_value_1'
				/>,
			);

			expect(screen.getByLabelText('test label 1')).toBeChecked();
			expect(screen.getByLabelText('test label 2')).not.toBeChecked();
			expect(screen.getByLabelText('test label 3')).not.toBeChecked();
		});

		it('not renders pre-checked option with multiple values', () => {
			render(
				<SelectInput
					id='select'
					type={SELECT_TYPES.RADIO}
					options={optionsMock}
					onChange={onChange}
					value={['test_value_1', 'test_value_2']}
				/>,
			);

			expect(screen.getByLabelText('test label 1')).not.toBeChecked();
			expect(screen.getByLabelText('test label 2')).not.toBeChecked();
			expect(screen.getByLabelText('test label 3')).not.toBeChecked();
		});
	});
});
