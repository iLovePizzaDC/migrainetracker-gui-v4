import Dot from '@/features/calendar/components/atoms/Dot';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<Dot />', () => {
  it('applies the given color class', () => {
    render(<Dot testId='dot' color='bg-cyan-400' />);

    expect(screen.getByTestId('dot')).toHaveClass('bg-cyan-400');
  });

  it('defaults to a transparent background', () => {
    render(<Dot testId='dot' />);

    expect(screen.getByTestId('dot')).toHaveClass('bg-transparent');
  });

  it('adds a ring when ring is true', () => {
    render(<Dot testId='dot' ring />);

    expect(screen.getByTestId('dot')).toHaveClass('ring-1', 'ring-red-500');
  });

  it('omits the ring by default', () => {
    render(<Dot testId='dot' />);

    expect(screen.getByTestId('dot')).not.toHaveClass('ring-1');
  });
});
