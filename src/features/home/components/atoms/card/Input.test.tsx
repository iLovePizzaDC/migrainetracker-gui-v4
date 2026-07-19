import Input from '@/features/home/components/atoms/card/Input';
import { INPUT_TYPES } from '@/shared/constants/input/input';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<Input />', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    type: INPUT_TYPES.TEXT,
    value: '',
    onChange: vi.fn(),
  };

  it('renders label and input', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('associates label with input via id', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toHaveAttribute('id', 'test-input');
  });

  it('renders with correct type', () => {
    render(<Input {...defaultProps} type={INPUT_TYPES.NUMBER} />);

    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'number');
  });

  it('renders with correct value', () => {
    render(<Input {...defaultProps} value='hello' />);

    expect(screen.getByLabelText('Test Label')).toHaveValue('hello');
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<Input {...defaultProps} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Test Label'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('renders placeholder when provided', () => {
    render(<Input {...defaultProps} placeholder='Enter text...' />);

    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('is not required by default', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).not.toBeRequired();
  });

  it('is required when required prop is set', () => {
    render(<Input {...defaultProps} required />);

    expect(screen.getByLabelText('Test Label')).toBeRequired();
  });
});
