import LoadingBox from '@/app/components/organisms/LoadingBox';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<LoadingBox />', () => {
  it('renders the loading text', () => {
    render(<LoadingBox />);

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
  });

  it('renders the user circle icon', () => {
    render(<LoadingBox />);

    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the spinning ring elements', () => {
    render(<LoadingBox />);

    expect(document.querySelectorAll('.animate-spin')).toHaveLength(2);
  });

  it('renders the shimmer progress bar', () => {
    render(<LoadingBox />);

    expect(
      document.querySelector('.animate-\\[shimmer_1\\.6s_ease-in-out_infinite\\]'),
    ).toBeInTheDocument();
  });

  it('outer spinner has correct animation duration', () => {
    render(<LoadingBox />);

    const [outerSpinner] = document.querySelectorAll('.animate-spin');
    expect((outerSpinner as HTMLElement).style.animationDuration).toBe('1.6s');
  });

  it('inner spinner rotates in reverse', () => {
    render(<LoadingBox />);

    const [, innerSpinner] = document.querySelectorAll('.animate-spin');
    expect((innerSpinner as HTMLElement).style.animationDirection).toBe('reverse');
  });
});
